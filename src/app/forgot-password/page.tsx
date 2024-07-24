import {Card} from "antd";
import LogoIcon from "@/components/LogoIcon";


export default function Page(){

    return <div className={'h-screen w-screen flex items-center justify-center bg-primary-50'}>
        <Card className={'text-center md:w-1/3 rounded-xl flex flex-col justify-center px-6 py-12 lg:px-8'}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <LogoIcon className="mx-auto h-20 w-auto"/>
                <div className={'text-3xl'}>LexStayz</div>
                <h2 className="mt-12 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
        </Card>
    </div>
}