'use client'

import {Card} from "antd";
import LocationForm from "@/components/accomodations/create/location/locationForm";
import LocationSearchBox from "@/components/accomodations/create/location/locationSearchBox";
import dynamic from "next/dynamic";
const MapWithMarker= dynamic(() => import("@/components/accomodations/create/location/mapWithMarker"), { ssr:false });
export default function CreateStep1() {
    return (
        <Card className={'border-0'}>
            <h3 className={'font-semibold mb-1'}>Where is your hotel located</h3>
            <LocationSearchBox />
            <div className="mt-4 h-64 w-full">
                <MapWithMarker />
            </div>
            <LocationForm />
        </Card>
    );
}
