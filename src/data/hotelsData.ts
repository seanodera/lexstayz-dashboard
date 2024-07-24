import { collection, doc, setDoc, updateDoc } from "@firebase/firestore";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { createFile } from "@/lib/utils";
import {getDocs, getFirestore} from "firebase/firestore";

const user = auth.currentUser;

export async function uploadStay(stay : any, poster: string, images: string[]) {



    if (user) {
        try {
            const firestore = getFirestore();

            const userDocRef = doc(firestore, 'hosts', user.uid)

            // Create a reference to the 'stays' collection within the user's document
            const staysRef = collection(userDocRef, 'stays');

            // Generate a new document reference with an auto-generated ID
            const docRef = doc(staysRef);

            // Create the processed stay object
            const processedStay = {
                ...stay,
                id: docRef.id,
            };

            // Set the document in Firestore
            await setDoc(docRef, processedStay);

            // Upload the poster image
            const posterFile = await createFile({ url: poster, name: 'poster' });
            const posterStorageRef = ref(storage, `${docRef.id}/poster`);
            const posterSnapshot = await uploadBytes(posterStorageRef, posterFile);
            const posterURL = await getDownloadURL(posterSnapshot.ref);

            // Update Firestore document with poster URL
            await updateDoc(docRef, { poster: posterURL });

            // Upload the other images
            const imageUrls = await Promise.all(images.map(async (image, index) => {
                const imageFile = await createFile({ url: image, name: `image-${index}` });
                const imageStorageRef = ref(storage, `${docRef.id}/image-${index}`);
                const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);
                return await getDownloadURL(imageSnapshot.ref);
            }));

            // Update Firestore document with image URLs
            await updateDoc(docRef, { images: imageUrls });

            console.log('Document and images uploaded successfully');
        } catch (error) {
            console.error('Error uploading stay:', error);
        }
    } else {
        console.error('No user is signed in');
    }
}

export async function addRoomFirebase(room:any,stayId:string, poster:string, images: string[]){
    if (user){
        try {
            const firestore = getFirestore();

            const userDocRef = doc(firestore, 'hosts', user.uid)

            // Create a reference to the 'stays' collection within the user's document
            const roomsRef = collection(userDocRef, 'stays', stayId, 'rooms');

            // Generate a new document reference with an auto-generated ID
            const docRef = doc(roomsRef);

            const processedRoom = {
                ...room,
                id: docRef.id,
            };
            await setDoc(docRef, processedRoom);
            const posterFile = await createFile({ url: poster, name: 'poster' });
            const posterStorageRef = ref(storage, `${stayId}/${docRef.id}/poster`);
            const posterSnapshot = await uploadBytes(posterStorageRef, posterFile);
            const posterURL = await getDownloadURL(posterSnapshot.ref);

            await updateDoc(docRef, { poster: posterURL });

            const imageUrls = await Promise.all(images.map(async (image, index) => {
                const imageFile = await createFile({ url: image, name: `image-${index}` });
                const imageStorageRef = ref(storage, `${stayId}/${docRef.id}/image-${index}`);
                const imageSnapshot = await uploadBytes(imageStorageRef, imageFile);
                return await getDownloadURL(imageSnapshot.ref);
            }));

            // Update Firestore document with image URLs
            await updateDoc(docRef, { images: imageUrls });
            console.log('Document and images uploaded successfully');
        } catch (error){
            console.error('Error adding room', error);
        }
    }else {
        console.error('No user is signed in');
    }
}

export async function getStaysFirebase() {
    if (user){
        try {
            const firestore = getFirestore();

            const userDocRef = doc(firestore, 'hosts', user.uid)

            // Create a reference to the 'stays' collection within the user's document
            const staysRef = collection(userDocRef, 'stays');
            let stays: Array<any> = []
            const snapshot = await getDocs(staysRef)
            snapshot.docs.forEach(doc => {
                stays.push(doc.data())
            })
            console.log(stays)
            return stays;
        } catch (error){
            console.error('Error getting stays:', error);
        }
    } else {

        return [];
    }

}