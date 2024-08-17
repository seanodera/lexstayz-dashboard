'use client'

import {Card} from "antd";
import LocationForm from "@/components/accomodations/create/location/locationForm";
import MapWithMarker from "@/components/accomodations/create/location/mapWithMarker";
import LocationSearchBox from "@/components/accomodations/create/location/locationSearchBox";

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