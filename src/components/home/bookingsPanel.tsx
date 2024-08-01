import {Card, Dropdown, Table} from "antd";
import {useSelector} from "react-redux";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId} from "@/slices/staySlice";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {BsChevronDown} from "react-icons/bs";
import {getRooms, getTag} from "@/components/common";
import {selectBookings} from "@/slices/bookingSlice";


const {Column} = Table;
export default function BookingsPanel() {
    const bookings = useSelector(selectBookings);

    const dispatch = useAppDispatch();
    const stays = useAppSelector(selectAllStays)
    const currentStay = useAppSelector(selectCurrentStay)
    const menuItems = stays.map((item: any, index: number) => {

        return {
            key: index,
            label: <div onClick={() => dispatch(setCurrentStayFromId(index))} className={''}>
                <div className={'font-semibold'}>{item.name}</div>
                <div className={'text-gray-500 '}>{item.location.district}, {item.location.country}</div>
                </div>,
        }
    })
    return <Card className={'rounded-xl'} classNames={{body: 'px-0 pt-0 pb-0'}} title={<h2 className={'mb-0 font-semibold'}>Recent Bookings</h2>}
                 extra={<Dropdown menu={{items: menuItems}}>
                     <div className={'border border-solid border-gray-300 px-3 py-2 rounded flex justify-between items-center gap-2 hover:border-primary'}>
                         {currentStay?.name} <BsChevronDown className={'text-xs'}/>
                     </div>
                 </Dropdown>}>
        <Table scroll={{x: true}} dataSource={bookings.slice(0,5)} pagination={false}>
            <Column title={'Guest'} dataIndex={['user']} render={(value, record, index) =>
                <div key={index}>
                    <div className={'font-medium'}>{value.firstName} {value.lastName}</div>
                    <div className={'text-gray-500 '}>{value.email}</div>
                </div>
            }/>
            <Column className={'text-nowrap'} title={'Check-In'} dataIndex={'checkInDate'}
                    render={value => dateReader({date: value})}/>
            <Column className={'text-nowrap'} title={'Check-Out'} dataIndex={'checkOutDate'}
                    render={value => dateReader({date: value})}/>
            <Column className={'text-nowrap'} title={'Status'} dataIndex={'status'} render={value => getTag(value)}/>
            <Column className={'text-nowrap'} title={'Rooms'} dataIndex={'rooms'} render={value => getRooms(value)}/>
            <Column className={'text-nowrap'} title={'Guests'} dataIndex={'numGuests'}/>
            <Column className={'text-nowrap'} title={'Total'} dataIndex={'totalPrice'} render={(value) => '$' + toMoneyFormat(value,{})}/>
        </Table>
    </Card>
}