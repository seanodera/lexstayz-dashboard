import {Col, Row} from "antd";
import AccountComponent from "@/components/cashier/accountComponent";
import WithdrawComponent from "@/components/cashier/withdrawComponent";
import WithdrawList from "@/components/cashier/withdrawList";
import BalancesComponent from "@/components/cashier/balancesComponent";


export default function Page(){


    return <div className={'pt-4 pb-8 px-8'}>
        <Row gutter={[16,16]}>
            <Col span={18}>
                <WithdrawList/>
            </Col>
            <Col span={6} className={'space-y-4'}>
                <BalancesComponent/>
                <WithdrawComponent/>
                <AccountComponent/>
            </Col>
        </Row>
    </div>
}