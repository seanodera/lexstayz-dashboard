import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    getFirestore,
    Timestamp,
    runTransaction
} from "@firebase/firestore";
import {auth, firestore, storage} from "@/lib/firebase";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "@firebase/storage";
import {createFile} from "@/lib/utils";
import {getDoc} from "firebase/firestore";


async function uploadImage(file: File, path: string) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}
async function deleteImage(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}

export function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}

export async function uploadStay(stay: any, poster: string, images: string[]) {
    try {
        const user = getCurrentUser();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');
        const docRef = doc(staysRef);

        const processedStay = {...stay, id: docRef.id};
        await setDoc(docRef, processedStay);

        const posterFile = await createFile({url: poster, name: 'poster'});
        const posterURL = await uploadImage(posterFile, `${docRef.id}/poster`);
        await updateDoc(docRef, {poster: posterURL});

        const imageUrls = await Promise.all(images.map(async (image, index) => {
            const imageFile = await createFile({url: image, name: `image-${index}`});
            return await uploadImage(imageFile, `${docRef.id}/image-${index}`);
        }));
        await updateDoc(docRef, {images: imageUrls});

        console.log('Document and images uploaded successfully');
    } catch (error) {
        console.error('Error uploading stay:', error);
    }
}

export async function addRoomFirebase(room: any, stayId: string, images: string[], poster?: string) {
    try {
        const user = getCurrentUser();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');
        console.log('Here', staysRef.path, stayId)
        const stayRef = doc(staysRef, stayId);
        console.log('Here', stayRef.id)
        const roomsRef = collection(stayRef, 'rooms');


        const docRef = doc(roomsRef);

        const processedRoom = {...room, id: docRef.id};
        await setDoc(docRef, processedRoom);

        let posterURL;
        if (poster){
            const posterFile = await createFile({url: poster, name: 'poster'});
            posterURL = await uploadImage(posterFile, `${stayId}/${docRef.id}/poster`);
        }

        const imageUrls = await Promise.all(images.map(async (image, index) => {
            const imageFile = await createFile({url: image, name: `image-${index}`});
            return await uploadImage(imageFile, `${stayId}/${docRef.id}/image-${index}`);
        }));
        await updateDoc(docRef, {poster: posterURL, images: imageUrls});
        console.log('Document and images uploaded successfully');
        return {
            ...processedRoom,
            poster: posterURL,
            images: imageUrls,
        }
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
            stays.push({...doc1.data(), rooms});
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

export async function updateRoomFirebase(room: any, previousRoom: any, stayId: string, roomId: string, poster?: string, images?: string[]) {
    try {
        console.log('Here', 'room: ', room,'prev: ' , previousRoom, 'stay: ',stayId,'room: ', roomId, 'poster: ', poster);
        const user = getCurrentUser();
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');
        const stayRef = doc(staysRef, stayId);
        const roomsRef = collection(stayRef, 'rooms');


        const docRef = doc(roomsRef, roomId);


        let finalPoster = previousRoom.poster;

        if (poster && previousRoom.poster !== poster) {
            const storageRef = ref(storage, `${stayId}/${roomId}/poster`);
            await deleteObject(storageRef);

            const posterFile = await createFile({url: poster, name: 'poster'});
            const posterURL = await uploadImage(posterFile, `${stayId}/${docRef.id}/poster`);
            finalPoster = posterURL;
        }
        let finalImages = previousRoom.images;
        if (images) {
            let oldImages: string[] = [];
            let newImages: string[] = [];
            let removedImages: string[] = [];
            images.forEach(image => {
                if (previousRoom.images.includes(image)) {
                    oldImages.push(image)
                } else {
                    newImages.push(image);
                }
            });
            previousRoom.images.forEach((image: string) => {
                if (!newImages.includes(image)) {
                    removedImages.push(image);
                }
            });

            for (const image of removedImages) {
                const oldImagePath = new URL(image).pathname;
                await deleteImage(oldImagePath);
            }
            let newList = []

            const imageUrls = await Promise.all(newImages.map(async (image, index) => {
                const imageFile = await createFile({url: image, name: `image-${index}`});
                return await uploadImage(imageFile, `draft/${stayId}/${docRef.id}/image-${index}`);
            }));

            finalImages = [...oldImages, ...imageUrls]
        }
        let newRoom = {
            ...room,
            poster: finalPoster,
            images: finalImages,
        }
        await updateDoc(docRef, newRoom)
        console.log('Document and images uploaded successfully');
        return newRoom

    } catch (error) {
        console.log( 'Error updating docs:', error);
    }
}

export async function publishStayFirebase(stay: any) {
    try {
        const user = getCurrentUser();
        const firestore = getFirestore();
        const publicStays = doc(firestore, 'stays', stay.id)
        const originStay = doc(firestore, 'hosts', user.uid, 'stays', stay.id)
        const timestamp = Timestamp.now()
        if (stay.published && stay.modified) {
            await updateDoc(publicStays, {...stay, published: true, publishedDate: timestamp, hostId: user.uid});
        } else {
            await setDoc(publicStays, {...stay, published: true, publishedDate: timestamp, hostId: user.uid});
            const userDocRef = doc(firestore, 'hosts', user.uid);

            const userDoc = await getDoc(userDocRef);
            const pub = userDoc.get('published')
            if (pub) {
                const newPublished: string[] = [...pub, publicStays.id]
                await updateDoc(userDocRef, {published: newPublished});
            } else {
                await updateDoc(userDocRef, {published: [publicStays.id]});
            }
        }
        await updateDoc(originStay, {published: true, publishedDate: timestamp});


    } catch (error) {
        console.error('Error updating stay:', error);
    }
}