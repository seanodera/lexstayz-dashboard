import {createAsyncThunk} from '@reduxjs/toolkit';
import {collection, query, where, getCountFromServer} from 'firebase/firestore';
import {firestore} from '@/lib/firebase';
import {getServerTime} from '@/lib/utils';
import {getCurrentUser} from "@/data/hotelsData";
import {addDays, subDays} from "date-fns";

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
                where('checkInDate', '<=', currentDate.toISOString()),
                where('checkOutDate', '>=', currentDate.toISOString()),
                where('status', '==', 'Confirmed')
            );
            const checkInQuery = query(
                bookingsRef,
                where('checkInDate', '>=', addDays(currentDate, 1).toISOString()),
                where('checkInDate', '<=', subDays(currentDate, 1).toISOString()),
                where('status', '==', 'Confirmed')
            );
            const checkOutQuery = query(
                bookingsRef,
                where('checkOutDate', '>', addDays(currentDate, 1).toISOString()),
                where('checkOutDate', '<', subDays(currentDate, 1).toISOString()),
                where('status', '==', 'Confirmed')
            );
            const pendingQuery = query(
                bookingsRef,
                where('status', '==', 'Pending')

            );
            const upComingQuery = query(
                bookingsRef,
                where('checkInDate', '>', currentDate.toISOString())
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
            console.log(stats)
            return stats;
        } catch (e) {
            console.error('Error fetching statistics:', e);
            throw e;
        }
    }
);

export default FetchStatistics;

