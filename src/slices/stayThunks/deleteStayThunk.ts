import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    writeBatch
} from "@firebase/firestore";
import { auth, firestore, storage } from "@/lib/firebase";
import { createFile } from "@/lib/utils";
import { getDoc } from "firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteImage, getCurrentUser, uploadImage} from "@/data/hotelsData";
import {Stay} from "@/lib/types";

export const deleteStayAsync = createAsyncThunk(
    'stay/deleteStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const firestore = getFirestore();
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
            const userDocRef = doc(firestore, 'hosts', user.uid);

            if (stay.published) {
                throw new Error('You have to unpublish the stay before deleting it.');
            }

            const batch = writeBatch(firestore);

            // Delete room images and documents
            for (const room of stay.rooms) {
                await deleteImage(`${stay.id}/${room.id}/poster`);
                await Promise.all(room.images.map((_:string, index: number) => deleteImage(`${stay.id}/${room.id}/image-${index}`)));

                const roomRef = doc(originStayRef, 'rooms', room.id);
                batch.delete(roomRef);
            }

            // Delete stay images
            if (stay.poster) {
                await deleteImage(`${stay.id}/poster`);
            }
            await Promise.all(stay.images.map((_:string, index: number) => deleteImage(`${stay.id}/image-${index}`)));

            // Delete stay document
            batch.delete(originStayRef);
            await batch.commit();

            return stay.id;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays');
            }
        }
    }
);
