import type {Metadata} from "next";
import "../styles/globals.css";
import ContextProvider from "@/context/contextProvider";
import StoreProvider from "@/context/storeProvider";
import {AntdRegistry} from "@ant-design/nextjs-registry";
import {ConfigProvider} from "antd";


// antd theme
const theme = {
    token: {
        colorPrimary: '#584cf4', // Your custom primary color
    },
};

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body><StoreProvider><AntdRegistry>
            <ConfigProvider theme={theme}><ContextProvider>
                <div>{children}</div>
            </ContextProvider></ConfigProvider> </AntdRegistry></StoreProvider>
        </body>
        </html>
    );
}
