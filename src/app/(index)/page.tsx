'use client'
import {Badge, Card, Col, Divider, Flex, Progress, Row, Statistic, Typography} from "antd";
import {BookFilled, BookOutlined, WalletFilled, WalletOutlined} from "@ant-design/icons";
import {toMoneyFormat} from "@/lib/utils";
import CountUp from "react-countup";
import NotificationsPanel from "@/components/home/NotificationsPanel";
import BookingsPanel from "@/components/home/bookingsPanel";
import CheckInPanel from "@/components/home/checkInPanel";
import ReviewsPanel from "@/components/home/ReviewsPanel";
import {useAppSelector} from "@/hooks/hooks";

import {selectAvailableBalance, selectAverageEarnings, selectPendingBalance} from "@/slices/transactionsSlice";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {selectBookingStats} from "@/slices/bookingSlice";
import {selectOccupancy} from "@/slices/staySlice";

export default function Home() {
    const pendingBalance = useAppSelector(selectPendingBalance)
    const availableBalance = useAppSelector(selectAvailableBalance)
    const userDetails = useAppSelector(selectCurrentUser)
    const bookingStats = useAppSelector(selectBookingStats)
    const occupancy = useAppSelector(selectOccupancy)
    return <div className={'overflow-y-scroll overflow-x-hidden pt-4 pb-10 px-10 bg-white'}>
        <h3 className={'font-medium'}> Welcome back {userDetails?.firstName}</h3>
        <h2 className={'font-bold'}>Overview</h2>
        <div className={'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
            <Card className={'bg-lightGray'}>
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
            <Card>
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

        <div className={'grid grid-cols-3 mt-4 gap-4'}>
            <div className={'col-span-2'}>
                <BookingsPanel/>
            </div>
            <CheckInPanel/>
        </div>
    </div>;
}


const Overview = () => {
    const pendingBalance = useAppSelector(selectPendingBalance)
    const availableBalance = useAppSelector(selectAvailableBalance)
    const averageEarnings = useAppSelector(selectAverageEarnings)
    return (
        <Card className={'border-0'}>
            <h2>Revenue</h2>
            <div className={' space-y-4'}>
                <div className={'flex justify-between items-center'}>
                    <div className={''}>
                        <h3 className={'text-gray-500 text-lg'}>Total Balance</h3>
                        <CountUp className={'font-semibold text-2xl'} start={0}
                                 end={pendingBalance + availableBalance}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>
                    <Divider type={'vertical'} className={'text-gray-500 h-full'}/>
                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Available Balance</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={availableBalance}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>
                </div>
                <div className={'flex justify-between items-center'}>
                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Avg Earnings per Booking</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={averageEarnings}
                                 duration={2}
                                 separator=","
                                 decimals={2}
                                 prefix="USD "
                        />
                    </div>
                    <Divider type={'vertical'} className={'text-gray-500 h-full'}/>
                    <div>
                        <h3 className={'text-gray-500 font-medium'}>Pending Balance</h3>
                        <CountUp className={'font-semibold text-xl'} start={0}
                                 end={pendingBalance}
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


