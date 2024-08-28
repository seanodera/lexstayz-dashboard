import { Col, Row } from "antd";
import AccountComponent from "@/components/cashier/accountComponent";
import WithdrawList from "@/components/cashier/withdrawList";
import BalancesComponent from "@/components/cashier/balancesComponent";

export default function Page() {
    return (
        <div className="pt-4 pb-8 px-4 md:px-8 lg:px-8">
            <Row gutter={[16, 16]}>
                {/* BalancesComponent column */}
                <Col
                    xs={24}    // Full width on extra small screens (mobile)
                    sm={24}    // Full width on small screens (larger mobile/tablets)
                    md={24}    // Full width on medium screens (landscape tablets)
                    lg={6}     // 6 out of 24 columns on large screens (desktops)
                    className="order-1 md:order-2 space-y-4"
                >
                    <BalancesComponent />
                    {/*<WithdrawComponent />*/}
                    <AccountComponent />
                </Col>

                {/* WithdrawList column */}
                <Col
                    xs={24}    // Full width on extra small screens (mobile)
                    sm={24}    // Full width on small screens (larger mobile/tablets)
                    md={18}    // 18 out of 24 columns on medium screens (landscape tablets)
                    lg={18}    // 18 out of 24 columns on large screens (desktops)
                    className="order-2 md:order-1"
                >
                    <WithdrawList />
                </Col>

            </Row>
        </div>
    );
}
