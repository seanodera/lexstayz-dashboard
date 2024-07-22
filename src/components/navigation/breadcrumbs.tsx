'use client'
import { Breadcrumb } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import {usePathname} from "next/navigation";

const Breadcrumbs: React.FC = () => {
    const pathname = usePathname();


    const pathSnippets = pathname.split('/').filter(i => i);

    const breadcrumbItems = pathSnippets.map((snippet, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return (
            <Breadcrumb.Item key={url}>
                <Link href={url}>{decodeURIComponent(snippet)}</Link>
            </Breadcrumb.Item>
        );
    });

    return (
        <Breadcrumb>
            <Breadcrumb.Item key="home">
                <Link href="/">Home</Link>
            </Breadcrumb.Item>
            {breadcrumbItems}
        </Breadcrumb>
    );
};

export default Breadcrumbs;
