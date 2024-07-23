import {Card, Empty} from "antd";


export default function NotificationsPanel() {

    return <Card  title={<h2 className={'mb-0 font-semibold'}>Messages</h2>} className={'rounded-lg h-full'} bordered>
        <div className={'flex flex-col justify-center h-full items-center'}>
            <Empty/>
        </div>
    </Card>
}