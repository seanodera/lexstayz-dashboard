import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    writeBatch
} from "@firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/hotelsData";

export const fetchStaysAsync = createAsyncThunk(
    'stay/fetchStays',
    async (_, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const firestore = getFirestore();
            const userDocRef = doc(firestore, 'hosts', user.uid);
            const staysRef = collection(userDocRef, 'stays');

            const stays: any[] = [];
            const snapshot = await getDocs(staysRef);
            for (const doc of snapshot.docs) {
                const partialStay = doc.data()

                if (partialStay.type === 'Hotel') {
                    const rooms = await getRoomsFirebase(doc.id);
                    stays.push({...doc.data(), rooms});
                } else {
                    stays.push({...doc.data(), rooms: []});
                }
            }

            console.log(stays);
            return stays;
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