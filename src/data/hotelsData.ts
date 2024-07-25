import { collection, doc, setDoc, updateDoc, getDocs, getFirestore } from "@firebase/firestore";
import { auth, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { createFile } from "@/lib/utils";

async function uploadImage(file: File, path: string) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}

export async function uploadStay(stay: any, poster: string, images: string[]) {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
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
    } catch (error) {
        console.error('Error uploading stay:', error);
    }
}

export async function addRoomFirebase(room: any, stayId: string, poster: string, images: string[]) {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');
        console.log('Here', staysRef.path, stayId)
        const stayRef = doc(staysRef, stayId);
        console.log('Here', stayRef.id)
        const roomsRef = collection(stayRef, 'rooms');


        const docRef = doc(roomsRef);

        const processedRoom = { ...room, id: docRef.id };
        await setDoc(docRef, processedRoom);

        const posterFile = await createFile({ url: poster, name: 'poster' });
        const posterURL = await uploadImage(posterFile, `${stayId}/${docRef.id}/poster`);
        await updateDoc(docRef, { poster: posterURL });

        const imageUrls = await Promise.all(images.map(async (image, index) => {
            const imageFile = await createFile({ url: image, name: `image-${index}` });
            return await uploadImage(imageFile, `${stayId}/${docRef.id}/image-${index}`);
        }));
        await updateDoc(docRef, { images: imageUrls });

        console.log('Document and images uploaded successfully');
    } catch (error) {
        console.error('Error adding room:', error);
    }
}

export async function getStaysFirebase() {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');

        const stays: Array<any> = [];
        const snapshot = await getDocs(staysRef);
        for (const doc1 of snapshot.docs) {
            const rooms = await getRoomsFirebase(doc1.id);
            stays.push({ ...doc1.data(), rooms });
        }

        console.log(stays);
        return stays;
    } catch (error) {
        console.error('Error getting stays:', error);
        return [];
    }
}

async function getRoomsFirebase(stayId: string) {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const roomsRef = collection(userDocRef, 'stays', stayId, 'rooms');

        const rooms: Array<any> = [];
        const snapshot = await getDocs(roomsRef);
        snapshot.docs.forEach(doc => rooms.push(doc.data()));

        return rooms;
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}

export async function updateRoomFirebase(room:any, stayId:string, roomId:string, poster?:string, images?:string[]){

}