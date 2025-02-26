import {auth, firestore} from "@/lib/firebase";
import {arrayUnion, doc, getDoc, setDoc} from "firebase/firestore";
import {confirmPasswordReset, sendPasswordResetEmail, verifyPasswordResetCode} from "firebase/auth";
import {updateDoc} from "@firebase/firestore";


export async function createUser(user: any, id: string) {
    const userDoc = doc(firestore, 'hosts', id);
     await setDoc(userDoc, {...user, balance: {
         available: 0,
             pending: 0,
             prevAvailable: 0,
             prevPending: 0,
         }})
    return user;
}

export async function getUserDetails(id: string) {
    try {
        const userDoc = doc(firestore, 'hosts', id);
        const docSnap = await getDoc(userDoc);
        console.log(docSnap.data());
        const user = docSnap.data();
        if (user) {
            if (!user.balance){
                user.balance = {
                    available: 0,
                    prevAvailable: 0,
                    pending: 0,
                    prevPending: 0
                }
            }
        }

        return user;
    } catch (error:any) {
        throw Error(error.message);
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


export async function addOnboarded(name: string) {
    try {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(firestore, 'hosts', user.uid);
            await updateDoc(docRef, {
                onboarded: arrayUnion(name),
            });
        }
        return user
    } catch (error) {
        console.error("Error updating onboarded list: ", error);
    }
}
