import {Button, Card} from "antd";
import {StarFilled, StarOutlined} from "@ant-design/icons";
import {faker} from "@faker-js/faker";


export default function NotificationsPanel() {

    return <Card title={<h2 className={'mb-0 font-semibold'}>Recent Reviews</h2>} className={'rounded-lg'} bordered>

        <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-row justify-between items-center rounded-lg border border-black '}>
                <div>
                    <h3 className={'mb-0'}>Sarah.G wrote a review</h3>
                    <p className={'line-clamp-2'}>
                        {faker.lorem.paragraph()}
                    </p>
                    <div className={'flex justify-between items-center'}>
                        <div className={'text-lg'}>
                            <StarFilled className={'text-primary'}/>
                            <StarFilled className={'text-primary'}/>
                            <StarFilled className={'text-primary'}/>
                            <StarFilled className={'text-primary'}/>
                            <StarOutlined className={'text-primary'}/>
                        </div>
                        <Button className={'text-primary'} type={'text'}>View</Button>
                    </div>
                </div>
            </div>

        </div>
    </Card>
}