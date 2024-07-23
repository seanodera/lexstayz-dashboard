import {faker} from "@faker-js/faker";
import {statuses} from "@/data/bookingsData";


const structure = {
    amenities: [
    {
        name: "WiFi",
        description: "High-speed wireless internet"
    },
    {
        name: "Pool",
        description: "Outdoor swimming pool"
    },
    {
        name: "Gym",
        description: "Fully equipped fitness center"
    }
],
    accommodations: [
    {
        accommodationId: 1,
        name: "Grand Hotel",
        address: "123 Street",
        district: "City",
        state: "State",
        country: "Country",
        zipCode: "12345",
        phoneNumber: "123-456-7890",
        email: "info@grandhotel.com",
        amenities: [
            { name: "WiFi", description: "High-speed wireless internet" },
            { name: "Pool", description: "Outdoor swimming pool" },
            { name: "Gym", description: "Fully equipped fitness center" }
        ],
        reviews: [
            {
                reviewId: 1,
                userId: 101,
                rating: 4.5,
                comment: "Great place!",
                date: "2023-07-20T00:00:00Z"
            },
            {
                reviewId: 2,
                userId: 102,
                rating: 3.8,
                comment: "Good but could be better.",
                date: "2023-08-10T00:00:00Z"
            }
        ],
        description: "A luxurious stay in the heart of the city.",
        rating: 4.3,
        isAvailable: true,
        type: "Hotel",
        rooms: [
            {
                roomId: 101,
                bedType: "Queen",
                numBeds: 1,
                maxOccupancy: 2,
                pricePerNight: 100.0,
                amenities: [
                    { name: "WiFi", description: "High-speed wireless internet" },
                    { name: "Gym", description: "Fully equipped fitness center" }
                ],
                isAvailable: true
            },
            {
                roomId: 102,
                bedType: "King",
                numBeds: 2,
                maxOccupancy: 4,
                pricePerNight: 150.0,
                amenities: [
                    { name: "WiFi", description: "High-speed wireless internet" },
                    { name: "Pool", description: "Outdoor swimming pool" }
                ],
                isAvailable: true
            }
        ],
        checkInTime: "15:00",
        checkOutTime: "11:00",
        hotelChain: "Luxury Hotels"
    },
    {
        accommodationId: 2,
        name: "Cozy Cottage",
        address: "456 Avenue",
        district: "Town",
        state: "State",
        country: "Country",
        zipCode: "67890",
        phoneNumber: "098-765-4321",
        email: "contact@cozycottage.com",
        amenities: [
            { name: "WiFi", description: "High-speed wireless internet" },
            { name: "Pool", description: "Outdoor swimming pool" }
        ],
        reviews: [
            {
                reviewId: 1,
                userId: 101,
                rating: 4.8,
                comment: "A cozy retreat away from the hustle and bustle.",
                date: "2023-07-20T00:00:00Z"
            }
        ],
        description: "A cozy retreat away from the hustle and bustle.",
        rating: 4.8,
        isAvailable: true,
        type: "Home",
        numBedrooms: 3,
        numBathrooms: 2,
        hasKitchen: true,
        hasLaundry: true
    }
],
    bookings: [
        {
            bookingId: 0,
            userId: 0,
            user: {
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                country: '',
            },
            accommodationId: 0,
            checkInDate: "2024-07-20T00:00:00Z",
            checkOutDate: "2024-07-25T00:00:00Z",
            numGuests: 2,
            totalPrice: 500.0,
            isConfirmed: true,
            rooms: [
                {
                    roomId: 1,
                    numRooms: 1,
                }
            ],

        }
]
}