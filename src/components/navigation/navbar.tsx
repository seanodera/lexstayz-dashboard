import {Button, Divider, Layout} from "antd";
import {MessageOutlined} from "@ant-design/icons";
import FocusSelector from "@/components/navigation/focusSelector";
import Breadcrumbs from "@/components/navigation/breadcrumbs";

export default function Navbar() {

    return <Layout.Header
        className="bg-white border-b border-[#f1f1f1] flex items-center justify-between sticky top-0 z-10 leading-none shadow-md shadow-primary-200">
        <div className={'flex items-center justify-between w-full'}>
            <div className="flex items-center gap-2">
                <Breadcrumbs/>
            </div>
            <div className="flex items-center">
                <Button  icon={<MessageOutlined/>} />
                <Divider type={'vertical'} className={'text-gray-500'}/>
                <FocusSelector/>
            </div>
        </div>
    </Layout.Header>
}