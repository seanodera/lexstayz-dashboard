import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    writeBatch
} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {createFile} from "@/lib/utils";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser, uploadImage} from "@/data/hotelsData";

export const uploadStayAsync = createAsyncThunk(
    'stay/uploadStay',
    async ({stay, poster, images}: { stay: any, poster: string, images: string[] }, {rejectWithValue}) => {
        try {
            const user = getCurrentUser();
            const userDocRef = doc(firestore, 'hosts', user.uid);
            const staysRef = collection(userDocRef, 'stays');
            const docRef = doc(staysRef);

            const processedStay = { ...stay, id: docRef.id };
            await setDoc(docRef, processedStay);

            const posterFile = await createFile({ url: poster, name: 'poster' });
            const posterURL = await uploadImage(posterFile, `${docRef.id}/poster`);
            await updateDoc(docRef, { poster: posterURL });

            const imageUrls = await Promise.all(images.map(async (image, index) => {
                const imageFile = await createFile({ url: image, name: `image-${index}` });
                return await uploadImage(imageFile, `${docRef.id}/image-${index}`);
            }));
            await updateDoc(docRef, { images: imageUrls });
            console.log('Document and images uploaded successfully');
            return {...processedStay, poster: posterURL, images: imageUrls}
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error uploading stay');
            }


        }
    }
);

export default uploadStayAsync;