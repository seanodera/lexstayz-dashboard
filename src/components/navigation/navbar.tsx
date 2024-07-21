import {Avatar, Layout} from "antd";
import {HomeOutlined, RadarChartOutlined} from "@ant-design/icons";
import {faker, fakerEN} from "@faker-js/faker";
import {MdOutlineLocalHotel} from "react-icons/md";
import FocusSelector from "@/components/navigation/focusSelector";


export default function Navbar() {

    return <Layout.Header  className="bg-white border-b border-[#f1f1f1] shadow-md flex items-center justify-between sticky top-0 z-10">
        <div className={'flex items-center justify-between'}>
            <div className="flex items-center gap-2">
                <div className={'font-semibold text-xl'}>LexStayz</div>
            </div>
            <div className="flex">
                {/*<FocusSelector/>*/}
            </div>
        </div>
    </Layout.Header>
}