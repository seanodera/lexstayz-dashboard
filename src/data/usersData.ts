import {auth, firestore} from "@/lib/firebase";
import {addDoc, doc, getDoc, getDocs, setDoc} from "firebase/firestore";
import { sendPasswordResetEmail, verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";


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


// Send Password Reset Email
export async function resetPassword(email: string) {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log("Password reset email sent successfully");
    } catch (error) {
        console.error("Error sending password reset email:", error);
    }
}

// Verify Password Reset Code
export async function verifyReset(code: string) {
    try {
        const email = await verifyPasswordResetCode(auth, code);
        return email;
    } catch (error) {
        console.error("Error verifying password reset code:", error);
        throw error;
    }
}

// Confirm Password Reset
export async function passwordReset(code: string, newPassword: string) {
    try {
        await confirmPasswordReset(auth, code, newPassword);
        console.log("Password has been reset successfully");
    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
}

