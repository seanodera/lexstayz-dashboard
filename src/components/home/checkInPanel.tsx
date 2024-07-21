import {Card, Table} from "antd";


export default function CheckInPanel() {

    return <Card classNames={{body: 'px-0 pt-0'}} title={<h2 className={'mb-0 font-semibold'}>Today&apos;s Check Ins</h2>}>
        <Table dataSource={[]} pagination={{
            pageSize: 5,
            simple: true
        }}/>
    </Card>
}