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
import {createFile, extractFirebaseStoragePath} from "@/lib/utils";
import { getDoc } from "firebase/firestore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {deleteImage, getCurrentUser, uploadImage} from "@/data/hotelsData";

export const updateRoomAsync = createAsyncThunk(
    'stay/updateRoom',
    async ({ room, previousRoom, stayId, roomId, poster, images }: {
        room: any,
        previousRoom: any,
        stayId: string,
        roomId: string,
        poster?: string,
        images?: string[]
    }, { rejectWithValue }) => {
        try {
            console.log('Here', 'room: ', room, 'prev: ', previousRoom, 'stay: ', stayId, 'room: ', roomId, 'poster: ', poster);
            const user = getCurrentUser();
            const firestore = getFirestore();
            const userDocRef = doc(firestore, 'hosts', user.uid);
            const staysRef = collection(userDocRef, 'stays');
            const stayRef = doc(staysRef, stayId);
            const roomsRef = collection(stayRef, 'rooms');
            const docRef = doc(roomsRef, roomId);

            let finalPoster = previousRoom.poster;
            if (poster && previousRoom.poster !== poster) {
                await deleteImage(`${stayId}/${roomId}/poster`);

                const posterFile = await createFile({ url: poster, name: 'poster' });
                finalPoster = await uploadImage(posterFile, `${stayId}/${docRef.id}/poster`);
            }

            let finalImages = previousRoom.images;
            if (images) {
                const oldImages = images.filter(image => previousRoom.images.includes(image));
                const newImages = images.filter(image => !previousRoom.images.includes(image));
                const removedImages:string[] = previousRoom.images.filter((image:string) => !images.includes(image));

                await Promise.all(removedImages.map(async image => {
                    const oldImagePath = extractFirebaseStoragePath(image);
                    await deleteImage(oldImagePath);
                }));

                const newImageUrls = await Promise.all(newImages.map(async (image, index) => {
                    const imageFile = await createFile({ url: image, name: `image-${index}` });
                    return await uploadImage(imageFile, `${stayId}/${docRef.id}/image-${index}`);
                }));

                finalImages = [...oldImages, ...newImageUrls];
            }

            const newRoom = { ...room, poster: finalPoster, images: finalImages };
            await updateDoc(docRef, newRoom);

            console.log('Document and images updated successfully');

            return { room: newRoom, stayId };
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);
