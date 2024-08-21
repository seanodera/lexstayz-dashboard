import {createAsyncThunk} from "@reduxjs/toolkit";
import {collection, doc, setDoc, updateDoc} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {createFile} from "@/lib/utils";
import {getCurrentUser, uploadImage} from "@/data/hotelsData";

export const addRoomAsync = createAsyncThunk(
    'stay/addRoom',
    async ({ room, stayId, poster, images }: { room: any, stayId: string, poster?: string, images: string[] }, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const userDocRef = doc(firestore, 'hosts', user.uid);
            const staysRef = collection(userDocRef, 'stays');
            const stayRef = doc(staysRef, stayId);
            const roomsRef = collection(stayRef, 'rooms');
            const docRef = doc(roomsRef);

            const processedRoom = { ...room, id: docRef.id };
            await setDoc(docRef, processedRoom);

            let posterURL;
            if (poster) {
                const posterFile = await createFile({ url: poster, name: 'poster' });
                posterURL = await uploadImage(posterFile, `${stayId}/${docRef.id}/poster`);
            }

            const imageUrls = await Promise.all(images.map(async (image, index) => {
                const imageFile = await createFile({ url: image, name: `image-${index}` });
                return await uploadImage(imageFile, `${stayId}/${docRef.id}/image-${index}`);
            }));
            await updateDoc(docRef, { poster: posterURL, images: imageUrls });

            console.log('Document and images uploaded successfully');
            return { room: { ...processedRoom, poster: posterURL, images: imageUrls }, stayId };
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);
