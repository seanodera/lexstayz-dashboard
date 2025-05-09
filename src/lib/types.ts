export interface Stay {
    type: 'Home' | 'Hotel';
    id: string;
    hostId: string;
    facilities: string[];
    smoking: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    published: boolean;
    poster: string;
    description: string;
    rating: number;
    publishedDate: string;
    location: Location ;
    images: string[];
    name: string;
    numReviews: number;
    parties: string;
    cancellation: {
        timeSpace: string;
        preDate: boolean;
        time: number;
        cancellation: string;
        rate: number;
    };
    pets: string;
    minAge: number;
    bookedDates?: string[];
}

export interface Home extends Stay {
    type: 'Home';
    maxGuests: number;
    bathrooms: number;
    beds: number;
    price: number;
    pricing: {
        base: number;
        weekly?: number;
        yearly?: number;
        monthly?: number;
    }
    bedrooms: number;
    homeType: string;
    bookedDates?: string[];
}

export interface Hotel extends Stay {
    type: 'Hotel';
    rooms: Room[];
}


export interface Room {
    poster: string;
    beds: Array<{
        number: number;
        type: string;
    }>;
    description: string;
    amenities: string[];
    name: string;
    maxGuests: number;
    available: number;
    id: string;
    price: number;
    images: string[];
    bookedDates?: { [ key: string ]: number;};
    fullDates?: string[];
    pricing: {
        base: number;
        weekly?: number;
        yearly?: number;
        monthly?: number;
    }
}

export interface Location
{
    latitude: number;
    longitude: number;
    zipCode: string;
    street2: string;
    fullAddress: string;
    district: string;
    country: string;
    street: string;
    city: string;
}


export interface Dates {
    startDate: string;
    endDate: string;
    length: number;
}

export interface Balance {
    available: number;
    prevAvailable: number;
    pending: number;
    prevPending: number;
}

export interface WithdrawAccount {
    method: string;
    account: string;
}

export interface Withdraw {
    account: WithdrawAccount;
    withdrawals: any[];
}

export interface Host {
    companyName?: string;
    "email": string,
    "phone": string,
    "uid": string,
    "firstName": string,
    "published": string[],
    "accountType": "Individual" | "Organization",
    "lastName": string,
    "wishlist": string[]
    onboarded: string[],
    balance: Balance,
    dob?: string,
    avatar?:string,
    gender?: string,
    address?: {
        zipCode: string;
        street2: string;
        fullAddress: string;
        district: string;
        country: string;
        street: string;
        city: string;
    },
}

export interface IPayout {
    id: string;
    hostId: string,
    account: IWithdrawalAccount,
    currency: string,
    method: string,
    amount: number,
    originalAmount: number,
    approved: boolean,
    flagged: boolean,
    reason?: string,
    createdAt: string,
    approvedAt?: string,
    status: string,
}
export interface IWithdrawalAccount {
    userId: string; // MongoDB ObjectId is stored as a string
    type: string;
    name: string;
    accountNumber: string;
    bankCode?: string;
    currency: string;
    bankName?: string;
    recipient_code?: string;
    service: 'Pawapay' | 'Paystack' | 'Paystack_KE';
    createdAt?: string; // Date with a default value
    active?: boolean; // Boolean with a default value
    flagged?: boolean; // Boolean with a default value
    reason?: string; // String with a default value
}
export interface IPromotion {
    id: string,
    hostId: string,
    poster: string;
    name: string;
    startDate: string | Date,
    endDate: string | Date,
    createdAt:string;
    description: string,
    stays: string[],
    currency: string,
    amount: number,
    status: string
}

export interface OperationType {
    operationType: string;
    minTransactionLimit: string;
    maxTransactionLimit: string;
}

export interface Correspondent {
    correspondent: string;
    currency: string;
    ownerName: string;
    operationTypes: OperationType[];
}

export interface PawaPayCountryData {
    country: string;
    correspondents: Correspondent[];
}


export interface Booking {
    acceptedAt: string;
    accommodationId: string;
    accountId: string;
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    currency: string;
    fees: number;
    grandTotal: number;
    hostId: string;
    id: string;
    isConfirmed: boolean;
    numGuests: number;
    paymentCurrency: string;
    paymentData: PaymentData;
    paymentMethod: string;
    paymentRate: number;
    specialRequest: string;
    status: string;
    subtotal: number;
    totalPrice: number;
    usedRate: number;
    user: BookingUser;
    rooms?: BookingRoom[];
}

export interface BookingRoom {
    roomId: string;
    numRooms: number;
    name: string;
    price: number
}

interface PaymentData {
    data: {
        paidAt: string;
        plan: string | null;
        created_at: string;
        paid_at: string;
        createdAt: string;
    }
    // Add other properties that might be inside the paymentData object
    message: string;
    status: boolean;
    refunded: boolean;
}

export interface BookingUser {
    country: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}
