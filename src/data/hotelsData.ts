import {
    collection,
    doc,
    setDoc,
    updateDoc,
    getDocs,
    writeBatch
} from "@firebase/firestore";
import { auth,firestore,  storage } from "@/lib/firebase";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { createFile } from "@/lib/utils";
import {arrayUnion, getDoc} from "firebase/firestore";


export async function uploadImage(file: File, path: string): Promise<string> {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

/**
 * Deletes an image from Firebase Storage.
 * @param path - The storage path of the image to delete.
 */
export async function deleteImage(path: string): Promise<void> {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

/**
 * Gets the current authenticated user.
 * @returns The current authenticated user.
 */
export function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}

/**
 * Uploads a stay document and its associated images to Firestore and Firebase Storage.
 * @param stay - The stay details.
 * @param poster - The poster image URL.
 * @param images - The array of image URLs.
 */
export async function uploadStay(stay: any, poster: string, images: string[]): Promise<void> {
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
    } catch (error) {
        console.error('Error uploading stay:', error);
    }
}


export async function updateStayFirebase(stay: any, newStay: any,  poster?: string, images?: string[]) {
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
                const oldImagePath = new URL(image).pathname;
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
    } catch (error){
        console.log(error)
    }
}


export async function addRoomFirebase(room: any, stayId: string, images: string[], poster?: string): Promise<any> {
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
        return { ...processedRoom, poster: posterURL, images: imageUrls };
    } catch (error) {
        console.error('Error adding room:', error);
    }
}


export async function getStaysFirebase(): Promise<any[]> {
    try {
        const user = getCurrentUser();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const staysRef = collection(userDocRef, 'stays');

        const stays: any[] = [];
        const snapshot = await getDocs(staysRef);
        for (const doc of snapshot.docs) {
            const partialStay = doc.data()

            if (partialStay.type === 'Hotel') {
                const rooms = await getRoomsFirebase(doc.id);
                stays.push({...doc.data(), rooms});
            } else {
                stays.push({...doc.data(), rooms: []});
            }
        }

        console.log(stays);
        return stays;
    } catch (error) {
        console.error('Error getting stays:', error);
        return [];
    }
}


async function getRoomsFirebase(stayId: string): Promise<any[]> {
    try {
        const user = getCurrentUser();
        const userDocRef = doc(firestore, 'hosts', user.uid);
        const roomsRef = collection(userDocRef, 'stays', stayId, 'rooms');

        const rooms: any[] = [];
        const snapshot = await getDocs(roomsRef);
        snapshot.docs.forEach(doc => rooms.push(doc.data()));

        return rooms;
    } catch (error) {
        console.error('Error getting rooms:', error);
        return [];
    }
}


export async function updateRoomFirebase(room: any, previousRoom: any, stayId: string, roomId: string, poster?: string, images?: string[]): Promise<any> {
    try {
        console.log('Here', 'room: ', room, 'prev: ', previousRoom, 'stay: ', stayId, 'room: ', roomId, 'poster: ', poster);
        const user = getCurrentUser();
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
                const oldImagePath = new URL(image).pathname;
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
        return newRoom;
    } catch (error) {
        console.error('Error updating room:', error);
    }
}

/**
 * Publishes a stay to a public collection.
 * @param stay - The stay details.
 */
export async function publishStayFirebase(stay: any): Promise<void> {
    try {
        const user = getCurrentUser();

        const publicStaysRef = doc(firestore, 'stays', stay.id);
        const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
        const timestamp = new Date().toString();

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
    } catch (error) {
        console.error('Error publishing stay:', error);
    }
}

/**
 * Unpublishes a stay, removing it from the public collection.
 * @param stay - The stay details.
 */
export async function unPublishStay(stay: any): Promise<void> {
    try {
        const user = getCurrentUser();
        const publicStaysRef = doc(firestore, 'stays', stay.id);
        const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);

        const batch = writeBatch(firestore);
        batch.update(originStayRef, { published: false });
        batch.update(publicStaysRef, {published:false});
        await batch.commit();
    } catch (error) {
        console.error('Error unpublishing stay:', error);
    }
}

/**
 * Deletes a stay and its associated images and rooms.
 * @param stay - The stay details.
 */
export async function deleteStay(stay: any): Promise<void> {
    try {
        const user = getCurrentUser();

        const originStayRef = doc(firestore, 'hosts', user.uid, 'stays', stay.id);
        const userDocRef = doc(firestore, 'hosts', user.uid);

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
        await batch.commit();
    } catch (error) {
        console.error('Error deleting stay:', error);
    }
}
