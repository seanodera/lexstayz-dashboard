import {Avatar, Breadcrumb, Button, Divider, Layout} from "antd";
import {HomeOutlined, MessageOutlined, RadarChartOutlined} from "@ant-design/icons";
import {faker, fakerEN} from "@faker-js/faker";
import {MdOutlineLocalHotel} from "react-icons/md";
import FocusSelector from "@/components/navigation/focusSelector";
import {usePathname} from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/navigation/breadcrumbs";

function itemRender(currentRoute: any, params: string[], items: any, paths: string[]) {
    const isLast = currentRoute?.path === items[ items.length - 1 ]?.path;

    return isLast ? (
        <span>{currentRoute.title}</span>
    ) : (
        <Link href={`/${paths.join("/")}`}>{currentRoute.title}</Link>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const pathnames = pathname.split("/");

    return <Layout.Header
        className="bg-white border-b border-[#f1f1f1] shadow-md flex items-center justify-between sticky top-0 z-10 leading-none">
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