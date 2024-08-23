import { createAsyncThunk } from '@reduxjs/toolkit';
import {collection, query, where, getCountFromServer} from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { getServerTime } from '@/lib/utils';
import {getCurrentUser} from "@/data/hotelsData";

const FetchStatistics = createAsyncThunk(
    'booking/fetchStatistics',
    async () => {
        try {
            const user = getCurrentUser();
            const bookingsRef = collection(firestore, 'hosts', user.uid, 'bookings');
            const currentDate = await getServerTime();

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
                where('checkInDate', '<=', currentDate),
                where('checkOutDate', '>=', currentDate)
            );
            const checkInQuery = query(
                bookingsRef,
                where('checkInDate', '==', currentDate)
            );
            const checkOutQuery = query(
                bookingsRef,
                where('checkOutDate', '==', currentDate)
            );
            const pendingQuery = query(
                bookingsRef,
                where('status', '==', 'Pending')
            );
            const upComingQuery = query(
                bookingsRef,
                where('checkInDate', '>', currentDate)
            );

            // Aggregate counts from the server
            const [onGoingCount, checkInCount, checkOutCount, pendingCount, upComingCount] = await Promise.all([
                getCountFromServer(onGoingQuery).then((snapshot) => snapshot.data().count),
                getCountFromServer(checkInQuery).then((snapshot) => snapshot.data().count),
                getCountFromServer(checkOutQuery).then((snapshot) => snapshot.data().count),
                getCountFromServer(pendingQuery).then((snapshot) => snapshot.data().count),
                getCountFromServer(upComingQuery).then((snapshot) => snapshot.data().count),
            ]);

            // Set stats based on server results
            stats.onGoing = onGoingCount;
            stats.checkIn = checkInCount;
            stats.checkOut = checkOutCount;
            stats.pending = pendingCount;
            stats.upComing = upComingCount;

            return stats;
        } catch (e) {
            console.error('Error fetching statistics:', e);
            throw e;
        }
    }
);

export default FetchStatistics;
