'use client'
import {Button, Divider, Layout} from "antd";
import {MenuOutlined, MessageOutlined} from "@ant-design/icons";
import FocusSelector from "@/components/navigation/focusSelector";
import Breadcrumbs from "@/components/navigation/breadcrumbs";
import {useState} from "react";
import NavDrawer from "@/components/navigation/navDrawer";
import MainTour from "@/components/mainTour";

export default function Navbar() {
const [showMenu, setShowMenu] = useState(false);
    return <Layout.Header
        className="bg-white border-b border-[#f1f1f1] flex items-center justify-between sticky top-0 z-10 leading-none shadow-md shadow-primary-200 px-4 md:px-10">
        <div className={'flex items-center justify-between w-full'}>
            <div className="flex items-center gap-2">
                <Breadcrumbs/>
            </div>
            <div className="md:flex items-center hidden gap-2">
                <MainTour/>
                <Button  icon={<MessageOutlined/>} />
                <Divider type={'vertical'} className={'text-gray-500'}/>
                <FocusSelector/>
            </div>
            <div className={'md:hidden'}>
                <Button onClick={() => setShowMenu(true)} icon={<MenuOutlined />} type={'text'} size={'large'}/>
            </div>
        </div>
        <NavDrawer show={showMenu} setShow={setShowMenu}/>
    </Layout.Header>
}
