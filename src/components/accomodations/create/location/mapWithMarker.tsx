import React, {useEffect, useState} from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngTuple } from "leaflet";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateLocation, selectPartialStay } from "@/slices/createStaySlice";
import axios from "axios";

// Fix default icon issues in Leaflet
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function MapWithMarker() {
    const dispatch = useAppDispatch();
    const stay = useAppSelector(selectPartialStay);
    const location = stay.location;
    const [selectedPosition, setSelectedPosition] = useState<LatLngTuple>([51.505, -0.09]);

    useEffect(() => {
        if (location) {
            setSelectedPosition([location.latitude || 51.505, location.longitude || -0.09]);
        }
    }, [location]);

    const DraggableMarker = () => {
        const map = useMap();

        useEffect(() => {
            map.setView(selectedPosition);
        }, [selectedPosition, map]);

        const eventHandlers = {
            dragend(event:any) {
                const marker = event.target;
                const newLatLng = marker.getLatLng();
                setSelectedPosition([newLatLng.lat, newLatLng.lng]);

                // Reverse geocode to get the new address
                axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLatLng.lat}&lon=${newLatLng.lng}`)
                    .then((response:any) => {
                        const address = response.data.address;
                        dispatch(updateLocation({
                            street: address.road || '',
                            city: address.city || '',
                            district: address.suburb || '',
                            country: address.country || '',
                            latitude: newLatLng.lat,
                            longitude: newLatLng.lng,
                        }));
                    });
            },
        };

        return (
            <Marker
                position={selectedPosition}
                draggable={true}
                eventHandlers={eventHandlers}
            />
        );
    };

    return (
        <MapContainer
            center={selectedPosition}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full rounded-lg z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DraggableMarker />
        </MapContainer>
    );
}
