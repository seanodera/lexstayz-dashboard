import {faker} from "@faker-js/faker";
import {differenceInDays} from "date-fns";
import {Stay} from "@/lib/types";
import {firestore} from "@/lib/firebase";
import {collection, limit, orderBy, query, startAt, writeBatch} from "@firebase/firestore";
import {doc, getDocs} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";
import axios from "axios";

export const statuses = ['Pending', 'Confirmed', 'Canceled', 'Rejected']


async function createBookingFirebase({
                                         stay,
                                         checkInDate,
                                         checkOutDate,
                                         rooms,
                                         paymentData,
                                         userId,
                                         contact,
                                         numGuests,
                                         specialRequest,
                                         totalPrice,
                                         currency,
                                         usedRate
                                     }: {
    stay: Stay,
    checkInDate: Date,
    checkOutDate: Date,
    rooms: object[],
    paymentData: any,
    userId: string,
    contact: any,
    numGuests: number, specialRequest: string, totalPrice: number, currency: string, usedRate: number,
}) {
    try {
        const user = getCurrentUser()
        const batch = writeBatch(firestore);
        const hostDoc = doc(firestore, 'hosts', user.uid, 'bookings')
        const userDoc = doc(firestore, 'user', userId, 'bookings', hostDoc.id)
        const booking = {
            id: hostDoc.id,
            accommodationId: stay.id,
            accountId: userId,
            hostId: user.uid,
            user: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                country: contact.country,
            },
            rooms: rooms,
            status: 'Pending',
            numGuests: numGuests,
            isConfirmed: false,
            specialRequest: specialRequest,
            totalPrice: totalPrice,
            currency: currency,
            usedRate: usedRate,
            paymentData: paymentData
        }
        batch.set(hostDoc, booking)
        batch.set(userDoc, booking)
        await batch.commit();
    } catch (error) {
        console.log(error)
    }
}


export async function getBookings(page: number, limitNum: number, last: string | undefined) {
    try {
        let bookings: any = [];
        const user = getCurrentUser();
        const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings');
        const q = (last) ? query(
            bookingsRef,
            orderBy('createdAt', ),
            limit(limitNum),
            startAt(last)
        ) : query(
            bookingsRef,
            orderBy('createdAt', 'desc'),
            limit(limitNum));
        const snapshot = await getDocs(q);

        snapshot.docs.forEach((document) => {
            bookings.push(document.data());
        });

        return bookings;
    } catch (error) {
        console.log(error);
        return [];
    }
}


// export async function updateStatus(status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any) {
//     try {
//         console.log(booking, 'At status')
//         const user = getCurrentUser()
//         const batch = writeBatch(firestore);
//         const hostDoc = doc(firestore, 'hosts', user.uid, 'bookings', booking.id)
//         const userDoc = doc(firestore, 'users', booking.accountId, 'bookings', booking.id)
//
//         if (status === 'Rejected' || status === 'Canceled'){
//
//         }
//         batch.update(hostDoc, {status: status, acceptedAt: new Date().toString()})
//         batch.update(userDoc, {status: status, acceptedAt: new Date().toString()})
//
//         await batch.commit();
//         let newBooking = {...booking};
//         newBooking.status = status
//         return newBooking;
//     } catch (error) {
//         console.log(error)
//     }
// }

export async function refundBooking(booking: any, amount?: number) {
    let response;
   if (amount){
       response = await axios.post('/api/createRefund', {reference: booking.id, amount: amount * 100})
   } else {
     response = await axios.post('/api/createRefund', {reference: booking.id})
   }
    return response.data;
}