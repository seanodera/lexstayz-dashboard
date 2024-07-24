import {firestore} from "@/lib/firebase";
import {addDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";


export async function createUser(user: any, id: string) {
    const userDoc = doc(firestore, 'hosts', id);
     await setDoc(userDoc, user)
    return user;
}

export async function getUserDetails(id: string) {
    try {
        const userDoc = doc(firestore, 'hosts', id);
        const docSnap = await getDoc(userDoc);
        return docSnap.data();
    } catch (error) {
        console.error(error);
    }
}