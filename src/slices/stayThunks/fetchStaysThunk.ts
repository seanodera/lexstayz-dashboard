import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    writeBatch, where
} from "@firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/hotelsData";
import {query} from "firebase/firestore";
import {getServerTime} from "@/lib/utils";
import {firestore} from "@/lib/firebase";

export const fetchStaysAsync = createAsyncThunk(
    'stay/fetchStays',
    async (_, {rejectWithValue}) => {
        try {
            const user = getCurrentUser();
            const userDocRef = doc(firestore, 'hosts', user.uid);
            const staysRef = collection(userDocRef, 'stays');
            const publicStaysRef = collection(firestore, 'stays');
            const stays: any[] = [];
            const serverTime = await getServerTime()
            const queryPub = query(publicStaysRef, where('hostId', '==', user.uid), where('published', '==', true))
            const queryLoc = query(staysRef, where('published', '==', false))
            const snapshotLocal = await getDocs(queryLoc);
            const snapshotPub = await getDocs(queryPub)
            for (const doc of snapshotLocal.docs) {
                const partialStay = doc.data()
                if (partialStay.type === 'Hotel') {
                    const rooms = await getRoomsFirebase(doc.id);
                    stays.push({...doc.data(), rooms});
                } else {
                    stays.push({...doc.data(), rooms: []});
                }
            }
            const pubStays = snapshotPub.docs.map(doc => doc.data());
            let occupancy = {
                vacant: 0,
                booked: 0,
            }
            pubStays.forEach((doc) => {
                if (doc.type === 'Home') {
                    if (doc.bookedDates && doc.bookedDates.includes(serverTime.toISOString().split('T')[ 0 ])) {
                        occupancy.booked += 1
                    } else {
                        occupancy.vacant += 1
                    }
                    console.log(doc.id, occupancy)
                } else {
                    const rooms = doc.rooms;
                    rooms.forEach((room: any) => {
                        if (room.bookedDates && room.bookedDates[ serverTime.toISOString().split('T')[ 0 ] ]) {
                            occupancy.booked += room.bookedDates[ serverTime.toISOString().split('T')[ 0 ] ];
                            occupancy.vacant += room.available - room.bookedDates[ serverTime.toISOString().split('T')[ 0 ] ]
                        } else {
                            occupancy.vacant += room.available
                        }
                        console.log(doc.id, room.id, occupancy, room.bookedDates)
                    })
                }
            })

            return {
                stays: [...pubStays, ...stays],
                occupancy,
            };
        } catch (error) {

            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);

async function getRoomsFirebase(stayId: string): Promise<any[]> {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const roomsRef = collection(userDocRef, 'stays', stayId, 'rooms');

        const rooms: any[] = [];
        const snapshot = await getDocs(roomsRef);
        snapshot.docs.forEach(doc => rooms.push(doc.data()));

        return rooms;
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}
