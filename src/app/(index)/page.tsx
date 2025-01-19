'use client'
import {Card, Progress, Skeleton,} from "antd";
import CountUp from "react-countup";
import BookingsPanel from "@/components/home/bookingsPanel";
import CheckInPanel from "@/components/home/checkInPanel";
import {useAppSelector} from "@/hooks/hooks";

import {selectAverageEarnings} from "@/slices/transactionsSlice";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {selectBookingStats} from "@/slices/bookingSlice";
import {selectOccupancy} from "@/slices/staySlice";
import {useEffect} from "react";
import {useTour} from "@/context/tourContext";

export default function Home() {
    const userDetails = useAppSelector(selectCurrentUser)
    const bookingStats = useAppSelector(selectBookingStats)
    const occupancy = useAppSelector(selectOccupancy)
    const {openDashboardTour,isMainOpen} = useTour()
    useEffect(() => {
        if (!isMainOpen && userDetails?.onboarded?.includes('dashboard')) {
            openDashboardTour();
        }
    }, []);
    return <div id={'tour-dashboard-screen'} className={'overflow-y-scroll overflow-x-hidden pt-6 pb-10 px-4 md:px-10 h-full bg-white bg-cross-dots-light bg-[length:30px_30px]  '}>
        <h3 className={'font-medium'}> Welcome back {userDetails?.firstName}</h3>
        <h2 className={'font-bold'}>Overview</h2>
        <div className={'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
            <Card id={'tour-dashboard-reservations'} className={'bg-lightGray bg-opacity-70 shadow shadow-primary-100'}>
                <h2>Reservations</h2>
                <div className={'flex justify-between items-center'}>
                    <div>
                        <h4>Ongoing</h4>
                        <h2>{bookingStats.onGoing}</h2>
                    </div>
                    <div>
                        <h4>Check In</h4>
                        <h2>{bookingStats.checkIn}</h2>
                    </div>
                    <div>
                        <h4>Check out</h4>
                        <h2>{bookingStats.checkOut}</h2>
                    </div>
                </div>
                <div className={'flex justify-between items-center'}>
                   <div>
                       <h4>Pending Bookings</h4>
                       <h2>{bookingStats.pending}</h2>
                   </div>
                    <div>
                        <h4>Upcoming Bookings</h4>
                        <h2>{bookingStats.upComing}</h2>
                    </div>
                </div>
            </Card>
            <Card id={'tour-dashboard-Occupancy'} className={'bg-white bg-opacity-70 shadow shadow-primary-100'}>
                <h2>Occupancy</h2>
                <div className={'flex justify-start items-center gap-4'}>
                    <div>
                        <div className={'flex items-center flex-nowrap gap-2'}>
                            <div className={'w-2 h-4 bg-dark rounded'}/>
                            Vacant
                        </div>
                        <h1>{occupancy.vacant}</h1>
                    </div>
                    <div>
                        <div className={'flex items-center flex-nowrap gap-2'}>
                            <div className={'w-2 h-4 bg-primary rounded'}/>Occupied
                        </div>
                        <h1>{occupancy.booked}</h1>
                    </div>
                </div>
                <Progress strokeColor={'#001529'} size={{
                    height: 70,
                }} showInfo={false} percent={100} success={{
                    percent: (occupancy.booked/(occupancy.booked + occupancy.vacant)) * 100,
                    strokeColor: '#584cf4'
                }} />
            </Card>
            <Overview/>
        </div>

        <div className={'grid grid-cols-1 md:grid-cols-3 mt-16 gap-4'}>
            <div className={'md:col-span-2'}>
                <BookingsPanel/>
            </div>
            <CheckInPanel/>
        </div>

    </div>;
}


const Overview = () => {
    const user = useAppSelector(selectCurrentUser)
    const averageEarnings = useAppSelector(selectAverageEarnings)
    if (!user){
        return <Skeleton active className={'border-0 bg-white bg-opacity-60 shadow shadow-primary-100'} />

    }

    return (
        <Card id={'tour-dashboard-revenue'} className={'border-0 bg-white bg-opacity-60 shadow shadow-primary-100'}>
            <h2>Revenue</h2>
            <div className={' space-y-4'}>
                <div className={'flex justify-between items-center'}>
                    <div className={''}>
                        <h3 className={'text-gray-500 text-lg'}>Total Balance</h3>
                        <CountUp className={'font-semibold text-xl md:text-2xl'} start={0}
                                 end={(user.balance.pending || 0) + (user.balance.available || 0)}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>

                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Available Balance</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={user.balance.available || 0}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>
                </div>
                <div className={'flex justify-between items-center'}>
                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Revenue per Booking</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={averageEarnings}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>

                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Pending Balance</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={user.balance.pending || 0}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>

                </div>
            </div>
        </Card>
    );
};


