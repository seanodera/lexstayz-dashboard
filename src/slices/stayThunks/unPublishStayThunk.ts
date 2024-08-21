import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    writeBatch, deleteDoc
} from "@firebase/firestore";
import { auth, firestore, storage } from "@/lib/firebase";
import { createFile } from "@/lib/utils";
import { getDoc } from "firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteImage, getCurrentUser, uploadImage} from "@/data/hotelsData";
import {Stay} from "@/lib/types";

export const unPublishStayAsync = createAsyncThunk(
    'stay/unPublishStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const firestore = getFirestore();
            const publicStaysRef = doc(firestore, 'stays', stay.id);
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);

            const batch = writeBatch(firestore);
            batch.update(originStayRef, { published: false });
            batch.update(publicStaysRef, {published:false});
            await batch.commit();
            return {...stay,published:false };
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);
