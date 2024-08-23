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

export const updateStayAsync = createAsyncThunk(
    'stay/updateStay',
    async ({ stay, newStay, poster, images }: {
        stay: any,
        newStay: any,
        poster: string,
        images: string[]
    }, { rejectWithValue }) => {
        try {
            const batch = writeBatch(firestore)
            const user = getCurrentUser();
            const publicStaysRef = doc(firestore, 'stays', stay.id);
            const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);


            let finalPoster = stay.poster;
            if (poster && stay.poster !== poster) {
                await deleteImage(`${stay.id}/poster`);

                const posterFile = await createFile({ url: poster, name: 'poster' });
                finalPoster = await uploadImage(posterFile, `${stay.id}/poster`);
            }

            let finalImages = stay.images;
            if (images) {
                const oldImages = images.filter(image => stay.images.includes(image));
                const newImages = images.filter(image => !stay.images.includes(image));
                const removedImages:string[] = stay.images.filter((image:string) => !images.includes(image));

                await Promise.all(removedImages.map(async image => {
                    const oldImagePath = extractFirebaseStoragePath(image)
                    await deleteImage(oldImagePath);
                }));

                const newImageUrls = await Promise.all(newImages.map(async (image, index) => {
                    const imageFile = await createFile({ url: image, name: `image-${index}` });
                    return await uploadImage(imageFile, `${stay.id}/image-${index}`);
                }));

                finalImages = [...oldImages, ...newImageUrls];
            }
            const finalStay = { ...stay,...newStay, poster: finalPoster, images: finalImages };

            if (stay.publishedDate){
                batch.update(publicStaysRef, finalStay);
            }
            batch.update(originStayRef, finalStay);
            await batch.commit()
            return finalStay;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error getting stays:');
            }
        }
    }
);
