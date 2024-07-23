import {faker} from "@faker-js/faker";

export const bedTypes = ['King', 'Double', 'Single', 'Sofa']

function getRandomSubarray(arr: Array<any>, size: number) {
    let shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[ index ];
        shuffled[ index ] = shuffled[ i ];
        shuffled[ i ] = temp;
    }
    return shuffled.slice(0, size);
}


const hotelAmenitiesAll = [
    'Air Conditioning/Heating',
    'Wi-Fi/Internet Access',
    'Television with Cable/Satellite Channels',
    'Telephone',
    'Mini-Bar',
    'Coffee/Tea Maker',
    'In-Room Safe',
    'Work Desk',
    'Iron and Ironing Board',
    'Hairdryer',
    'Room Service',
    'Alarm Clock/Radio',
    'Bathrobes and Slippers',
    'Toiletries',
    'Closet/Wardrobe',
    'On-Site Restaurant(s)',
    'Bar/Lounge',
    'Coffee Shop',
    'Breakfast Buffet',
    '24-Hour Room Service',
    'Fitness Center/Gym',
    'Swimming Pool (Indoor/Outdoor)',
    'Spa and Wellness Center',
    'Sauna/Steam Room',
    'Massage Services',
    'Hot Tub/Jacuzzi',
    'Yoga/Pilates Classes',
    'Tennis Court',
    'Golf Course',
    'Bicycle Rentals',
    'Business Center',
    'Meeting Rooms',
    'Conference Facilities',
    'Banquet Halls',
    'Audio/Visual Equipment Rental',
    'Fax/Photocopying Services',
    'Secretarial Services',
    '24-Hour Front Desk',
    'Concierge Services',
    'Luggage Storage',
    'Laundry/Dry Cleaning Services',
    'Valet Parking',
    'Shuttle Service',
    'Car Rental Desk',
    'Tour Desk',
    'ATM/Cash Machine',
    'Currency Exchange',
    'Accessible Rooms',
    'Wheelchair Accessibility',
    'Elevator/Lift',
    'Accessible Parking',
    'Hearing-Impaired Services',
    'Babysitting/Child Services',
    'Kids\' Club',
    'Children\'s Play Area',
    'Family Rooms',
    'Cribs/Infant Beds',
    'Children’s Menu',
    'Gift Shop',
    'Beauty Salon',
    'Garden/Terrace',
    'Library',
    'Pet-Friendly Services',
    'Smoking/Non-Smoking Rooms',
    'Fireplace in Lobby',
    'BBQ Facilities'
];

export const hotelFacilities = [
    {
        'Guest Room Amenities': [
            'Air Conditioning/Heating',
            'Wi-Fi/Internet Access',
            'Television with Cable/Satellite Channels',
            'Telephone',
            'Mini-Bar',
            'Coffee/Tea Maker',
            'In-Room Safe',
            'Work Desk',
            'Iron and Ironing Board',
            'Hairdryer',
            'Room Service',
            'Alarm Clock/Radio',
            'Bathrobes and Slippers',
            'Toiletries',
            'Closet/Wardrobe'
        ]
    },
    {
        'Dining Facilities': [
            'On-Site Restaurant(s)',
            'Bar/Lounge',
            'Coffee Shop',
            'Breakfast Buffet',
            '24-Hour Room Service'
        ]
    },
    {
        'Wellness and Recreation': [
            'Fitness Center/Gym',
            'Swimming Pool (Indoor/Outdoor)',
            'Spa and Wellness Center',
            'Sauna/Steam Room',
            'Massage Services',
            'Hot Tub/Jacuzzi',
            'Yoga/Pilates Classes',
            'Tennis Court',
            'Golf Course',
            'Bicycle Rentals'
        ]
    },
    {
        'Business and Event Facilities': [
            'Business Center',
            'Meeting Rooms',
            'Conference Facilities',
            'Banquet Halls',
            'Audio/Visual Equipment Rental',
            'Fax/Photocopying Services',
            'Secretarial Services'
        ]
    },
    {
        'General Services': [
            '24-Hour Front Desk',
            'Concierge Services',
            'Luggage Storage',
            'Laundry/Dry Cleaning Services',
            'Valet Parking',
            'Shuttle Service',
            'Car Rental Desk',
            'Tour Desk',
            'ATM/Cash Machine',
            'Currency Exchange'
        ]
    },
    {
        'Accessibility': [
            'Accessible Rooms',
            'Wheelchair Accessibility',
            'Elevator/Lift',
            'Accessible Parking',
            'Hearing-Impaired Services'
        ]
    },
    {
        'Family and Kid-Friendly Services': [
            'Babysitting/Child Services',
            'Kids\' Club',
            'Children\'s Play Area',
            'Family Rooms',
            'Cribs/Infant Beds',
            'Children’s Menu'
        ]
    },
    {
        'Additional Facilities': [
            'Gift Shop',
            'Beauty Salon',
            'Garden/Terrace',
            'Library',
            'Pet-Friendly Services',
            'Smoking/Non-Smoking Rooms',
            'Fireplace in Lobby',
            'BBQ Facilities'
        ]
    }
];


function hotelsDataGenerator() {
    let hotels = [];
    for (let i = 0; i < 3; i++) {
        let rooms = [];
        let price = 0;
        for (let j = 0; j < faker.number.int({max: 6, min: 1}); j++) {

            let room = {
                id: j,
                accommodationId: i,
                name: faker.word.sample() + ' Room',
                poster: faker.image.urlLoremFlickr({category: 'HotelRoom'}),
                images: [faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}),faker.image.urlLoremFlickr({category: 'HotelRoom'})],
                maxGuests: faker.number.int({max: 7}),
                beds: bedsDataGenerator(),
                description: faker.lorem.paragraph(),
                amenities: getRandomSubarray(hotelAmenitiesAll, 10),
                price: faker.number.int({max: 1000}),
                discounted: false,
                discount: {
                    oldPrice: 400,
                    dealId: 0,
                    message: ''
                },
                available: 10,
            }
            if (room.price > price) {
                price = room.price;
            }
            rooms.push(room);
        }

        const stay = {
            id: i,
            published: true,
            checkInTime: '14:00',
            checkOutTime: '12:00',
            name: 'The ' + faker.person.lastName() + ' Inn',
            price: price,
            rating: faker.number.int({max: 1000}) / 100,
            bath: faker.number.int({max: 10}),
            bed: faker.number.int({max: 10}),
            maxGuests: faker.number.int({max: 10}),
            description: faker.lorem.paragraphs(),
            facilities: getRandomSubarray(hotelAmenitiesAll, 20),
            type: 'hotel',
            rooms: rooms,
            location: {
                street: faker.location.street(),
                district: faker.location.city(),
                country: faker.location.country(),
            },
            poster: faker.image.urlLoremFlickr({category: 'HotelRoom'}),
            images: [faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'})]
        }
        hotels.push(stay);

    }
    return hotels;
}

function bedsDataGenerator() {
    let beds = [];
    for (let i = 0; i < faker.number.int({max: 4, min: 1}); i++) {
        let bedType = bedTypes[ Math.floor(Math.random() * bedTypes.length) ];
        let number = (bedType === 'King' || bedType === 'Sofa') ? 1 : (bedType === 'Double') ? 2 : faker.number.int({max: 4});
        beds.push({
            type: bedType,
            number
        })
    }
    return beds;
}

const hotelsData = [
    ...hotelsDataGenerator()
]


export default hotelsData;