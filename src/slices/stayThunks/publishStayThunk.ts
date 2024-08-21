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

export const publishStayAsync = createAsyncThunk(
    'stay/publishStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const firestore = getFirestore();
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
