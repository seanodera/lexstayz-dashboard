import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { getServerTime } from '@/lib/utils';
import { getCurrentUser } from "@/data/hotelsData";

const FetchStatistics = createAsyncThunk(
    'booking/fetchStatistics',
    async () => {
        try {
            const user = getCurrentUser();
            const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings');
            const currentDate = await getServerTime();

            // Extract date part from currentDate (YYYY-MM-DD)
            const todayDate = currentDate.toISOString().split('T')[0];

            // Initialize stats object
            let stats = {
                onGoing: 0,
                checkIn: 0,
                checkOut: 0,
                pending: 0,
                upComing: 0,
            };

            // Queries for statistics
            const onGoingQuery = query(
                bookingsRef,
                where('checkInDate', '<', `${todayDate}T00:00:00.000Z`),  // Ongoing if check-in was before today
                where('checkOutDate', '>', `${todayDate}T23:59:59.999Z`),  // and check-out is after today
                where('status', '==', 'Confirmed')
            );

            // Check-in Query: Match checkInDate to today's date
            const checkInQuery = query(
                bookingsRef,
                where('status', '==', 'Confirmed'),
                where('checkInDate', '>=', `${todayDate}T00:00:00.000Z`),
                where('checkInDate', '<=', `${todayDate}T23:59:59.999Z`)
            );

            // Check-out Query: Match checkOutDate to today's date
            const checkOutQuery = query(
                bookingsRef,
                where('status', '==', 'Confirmed'),
                where('checkOutDate', '>=', `${todayDate}T00:00:00.000Z`),
                where('checkOutDate', '<=', `${todayDate}T23:59:59.999Z`)
            );

            // Pending Query: Bookings with 'Pending' status
            const pendingQuery = query(
                bookingsRef,
                where('status', '==', 'Pending')
            );

            // Upcoming Query: Bookings with a check-in date after today
            const upComingQuery = query(
                bookingsRef,
                where('checkInDate', '>', `${todayDate}T23:59:59.999Z`),
                where('status', '==', 'Confirmed'),
            );

            // Aggregate counts from the server
            const onGoingCount = await getCountFromServer(onGoingQuery);
            const checkInCount = await getCountFromServer(checkInQuery);
            const checkOutCount = await getCountFromServer(checkOutQuery);
            const pendingCount = await getCountFromServer(pendingQuery);
            const upComingCount = await getCountFromServer(upComingQuery);

            // Set stats based on server results
            stats.onGoing = onGoingCount.data().count;
            stats.checkIn = checkInCount.data().count;
            stats.checkOut = checkOutCount.data().count;
            stats.pending = pendingCount.data().count;
            stats.upComing = upComingCount.data().count;

            console.log(stats);
            return stats;
        } catch (e) {
            console.error('Error fetching statistics:', e);
            throw e;
        }
    }
);

export default FetchStatistics;
