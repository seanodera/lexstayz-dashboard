import {getDocs, collection, query, where, deleteDoc, doc, Firestore} from "firebase/firestore";
import { subMinutes } from "date-fns";
import {firestore} from "@/lib/firebase";

export async function deleteOldUnconfirmedAdverts() {
    // Create a query for documents created more than 15 minutes ago and not confirmed
    const fifteenMinutesAgo = subMinutes(new Date(), 15);
    const advertsQuery = query(
        collection(firestore, "adverts"),
        where("createdAt", "<=", fifteenMinutesAgo.toISOString()), // Ensure the date format matches Firestore timestamps
        where("isConfirmed", "==", false)
    );

    try {
        // Fetch the documents
        const snap = await getDocs(advertsQuery);

        if (snap.empty) {
            // console.log("No matching documents to delete.");
            return;
        }

        // Iterate over the snap results and delete each document
        const deletePromises = snap.docs.map((docSnapshot) => {

            return deleteDoc(doc(firestore, "adverts", docSnapshot.id));
        });

        await Promise.all(deletePromises); // Wait for all deletions to complete


    } catch (error) {
        console.error("Error deleting documents: ", error);
    }
}

