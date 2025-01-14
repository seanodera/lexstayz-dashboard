import {doc, setDoc, updateDoc} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {arrayUnion, getDoc} from "firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/hotelsData";
import {Stay} from "@/lib/types";

export const publishStayAsync = createAsyncThunk(
    'stay/publishStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const publicStaysRef = doc(firestore, 'stays', stay.id);
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
            const timestamp = new Date().toISOString();

            if (stay.publishedDate) {
                await updateDoc(publicStaysRef, { ...stay, published: true, publishedDate: timestamp, hostId: user.uid });
            } else {
                await setDoc(publicStaysRef, { ...stay, published: true, publishedDate: timestamp, hostId: user.uid });

                const userDocRef = doc(firestore, 'hosts', user.uid);
                const userDoc = await getDoc(userDocRef);
                const publishedStays = userDoc.get('published') || [];
                const newPublishedStays = [...publishedStays, publicStaysRef.id];
                await updateDoc(userDocRef, { published: newPublishedStays });
            }

            await updateDoc(originStayRef, { published: true, publishedDate: timestamp });
            await updateCollectedProperties(stay)
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


async function updateCollectedProperties(stay: any) {
    const docRef = doc(firestore, "general", "collectedProperties");

    const { location, rooms, ...otherProps } = stay;

    const updateData: { [key: string]: any } = {};

    // Process other properties
    for (let key in otherProps) {
        updateData[key] = arrayUnion(otherProps[key]);
    }

    // Process location properties
    for (let subKey in location) {
        if (location[subKey] !== "") {
            updateData[`location.${subKey}`] = arrayUnion(location[subKey]);
        }
    }

    // Process room prices
    if (rooms) {
        for (let room of rooms) {
            if (room.price) {
                updateData["price"] = arrayUnion(room.price);
            }
        }
    }

    // Update the Firestore document
    await updateDoc(docRef, updateData);

    console.log("Collected properties updated successfully using arrayUnion!");
}
