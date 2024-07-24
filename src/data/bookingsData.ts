import {faker} from "@faker-js/faker";
import {differenceInDays} from "date-fns";

export const statuses = ['Pending', 'Confirmed', 'Canceled', 'Rejected']


function bookingsData({stay}: {
    stay: {
        id: number, rooms: Array<any>
    }
}) {
    let bookings = [];
    for (let i = 0; i < 100; i++) {
        let checkInDate = faker.date.soon({days: 30});
        let checkOutDate = faker.date.soon({days:14, refDate: checkInDate});
        let lengthOfStay  = differenceInDays(checkOutDate,checkInDate);
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
            totalPrice += stay.rooms[j].price * room.numRooms * lengthOfStay;
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
            status: statuses[ faker.number.int({max: statuses.length -1}) ],
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