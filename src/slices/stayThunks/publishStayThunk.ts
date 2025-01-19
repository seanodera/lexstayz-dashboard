import {doc, WriteBatch, writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {arrayUnion, getDoc} from "firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/hotelsData";
import {Location, Stay} from "@/lib/types";

export const publishStayAsync = createAsyncThunk(
    'stay/publishStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const publicStaysRef = doc(firestore, 'stays', stay.id);
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
            const timestamp = new Date().toISOString();
            const batch = writeBatch(firestore)
            if (stay.publishedDate) {
                batch.update(publicStaysRef, { ...stay, published: true, publishedDate: timestamp, hostId: user.uid });
            } else {
                batch.set(publicStaysRef, { ...stay, published: true, publishedDate: timestamp, hostId: user.uid }, {merge: true});

                const userDocRef = doc(firestore, 'hosts', user.uid);
                const userDoc = await getDoc(userDocRef);
                const publishedStays = userDoc.get('published') || [];
                const newPublishedStays = [...publishedStays, publicStaysRef.id];
                batch.update(userDocRef, { published: newPublishedStays });
            }

            batch.update(originStayRef, { published: true, publishedDate: timestamp });
            updateCollectedProperties(stay, batch)
            await batch.commit()
            return { ...stay, published: true, publishedDate: timestamp, hostId: user.uid }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);


function updateCollectedProperties(stay: any, batch:WriteBatch) {
    const docRef = doc(firestore, "general", "collectedProperties");

    const { location, rooms, ...otherProps } = stay;

    const updateData: { [key: string]: any } = {};
    updateData.type = arrayUnion(stay.type)
    updateData.smoking = arrayUnion(stay.smoking)
    updateData.pets = arrayUnion(stay.pets)
    updateData.parties = arrayUnion(stay.parties)

    if (stay.type === 'Home'){
        updateData.price = arrayUnion(stay.price)
        updateData.maxGuests = arrayUnion(stay.maxGuests)
        updateData.beds = arrayUnion(stay.beds)
        updateData.bedrooms = arrayUnion(stay.bedrooms)
        updateData.bathrooms = arrayUnion(stay.bathrooms)
        updateData.homeType = arrayUnion(stay.homeType)
    }
    updateData['location.country'] = arrayUnion(location['country'])
    updateLocationIndexes(location, batch);
    // Process room prices
    if (rooms) {
        for (let room of rooms) {
            if (room.price) {
                updateData["price"] = arrayUnion([...(updateData.price? updateData.price : [] ) ,room.price]);
            }
        }
    }

    // Update the Firestore document

    batch.set(docRef, updateData, {merge: true});

    console.log("Collected properties updated successfully using arrayUnion!");
}



export function updateLocationIndexes(location: Location, batch:WriteBatch) {



    // Base reference for general location data
    const locationRef = doc(firestore, "general", "locations");

    // Add country-level data
    if (location.country) {
        batch.set(locationRef, { country: arrayUnion(location.country) }, { merge: true });

        const countryRef = doc(locationRef, `countries/${location.country}`);
        batch.set(countryRef, { name: location.country }, { merge: true });

        // Add city-level data
        if (location.city) {
            batch.set(countryRef, { city: arrayUnion(location.city) }, { merge: true });

            const cityRef = doc(countryRef, `cities/${location.city}`);
            batch.set(cityRef, { name: location.city, district: [] }, { merge: true });

            batch.set(locationRef, { city: arrayUnion(location.city) }, { merge: true });

            // Add district-level data
            if (location.district) {
                batch.set(cityRef, { district: arrayUnion(location.district) }, { merge: true });

                const districtRef = doc(cityRef, `districts/${location.district}`);
                batch.set(districtRef, { name: location.district, street2: [] }, { merge: true });

                batch.set(locationRef, { district: arrayUnion(location.district) }, { merge: true });

                // Add street2-level data
                if (location.street2) {
                    batch.set(districtRef, { street2: arrayUnion(location.street2) }, { merge: true });

                    const street2Ref = doc(districtRef, `street2/${location.street2}`);
                    batch.set(street2Ref, { name: location.street2, street: [] }, { merge: true });

                    batch.set(locationRef, { street2: arrayUnion(location.street2) }, { merge: true });

                    // Add street-level data
                    if (location.street) {
                        batch.set(street2Ref, { street: arrayUnion(location.street) }, { merge: true });

                        batch.set(locationRef, { street: arrayUnion(location.street) }, { merge: true });
                    }
                }
            }
        }
    }


}

