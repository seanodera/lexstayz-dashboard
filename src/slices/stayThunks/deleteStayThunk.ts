import {doc, writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteImage, getCurrentUser} from "@/data/hotelsData";
import {Stay} from "@/lib/types";

export const deleteStayAsync = createAsyncThunk(
    'stay/deleteStay',
    async (stay: Stay, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
            const publicStaysRef = doc(firestore, 'stays', stay.id);

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
            batch.delete(publicStaysRef)
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
