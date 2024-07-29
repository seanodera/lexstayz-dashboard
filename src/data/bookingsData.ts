import {faker} from "@faker-js/faker";
import {differenceInDays} from "date-fns";
import {Stay} from "@/lib/types";
import {firestore} from "@/lib/firebase";
import {collection, writeBatch} from "@firebase/firestore";
import {doc, getDocs} from "firebase/firestore";
import {getCurrentUser} from "@/data/hotelsData";

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


export async function getBookings() {
    try {
        let bookings: any = []
        const user = getCurrentUser()
        const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings')
        const snapshot = await getDocs(bookingsRef)

        snapshot.docs.forEach((document) => {
            bookings.push(document.data())
        })

        return bookings;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function updateStatus(status: 'Pending' | 'Confirmed'| 'Canceled'| 'Rejected', booking: any){
    try {
        console.log(booking, 'At status')
        const user = getCurrentUser()
        const batch = writeBatch(firestore);
        const hostDoc = doc(firestore, 'hosts', user.uid, 'bookings', booking.id)
        const userDoc = doc(firestore, 'user', booking.accountId, 'bookings', booking.id)
        batch.update(hostDoc, {status: status, acceptedAt: new Date().toString()})
        batch.update(userDoc, {status: status, acceptedAt: new Date().toString()})

        await batch.commit();
        let newBooking = {...booking};
        newBooking.status  = status
        return newBooking;
    } catch (error){
        console.log(error)
    }
}

function bookingsData({stay}: {
    stay: {
        id: number, rooms: Array<any>
    }
}) {
    let bookings = [];
    for (let i = 0; i < 100; i++) {
        let checkInDate = faker.date.soon({days: 30});
        let checkOutDate = faker.date.soon({days: 14, refDate: checkInDate});
        let lengthOfStay = differenceInDays(checkOutDate, checkInDate);
        let rooms = [];
        let totalPrice = 0;

        for (let j = 0; j < faker.number.int({max: stay.rooms.length, min: 1}); j++) {
            let room = {
                stayId: stay.id,
                roomId: stay.rooms[ j ].id,
                name: stay.rooms[ j ].name,
                numRooms: faker.number.int({max: 10, min: 1}),
                price: stay.rooms[ j ].price,
            }
            totalPrice += stay.rooms[ j ].price * room.numRooms * lengthOfStay;
            rooms.push(room)
        }


        let booking = {
            bookingId: i,
            accountId: i,
            bookingCode: faker.string.alphanumeric(7).toUpperCase(),
            user: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                phone: faker.phone.number(),
                country: faker.location.country(),
                city: faker.location.city(),
            },
            accommodationId: stay.id,
            checkInDate: checkInDate.toDateString(),
            checkOutDate: checkOutDate.toDateString(),
            lengthOfStay: lengthOfStay,
            status: statuses[ faker.number.int({max: statuses.length - 1}) ],
            numGuests: faker.number.int({max: 10}),
            rooms: rooms,
            totalPrice: totalPrice,
            isConfirmed: false,
            specialRequest: faker.lorem.paragraph(),
        }
        bookings.push(booking);
    }
    return bookings;
}

export default bookingsData;