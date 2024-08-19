'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import axios from 'axios';
import { useAppDispatch } from '@/hooks/hooks';
import { updateLocation } from '@/slices/createStaySlice';
import { debounce } from 'lodash';
import { getCountry } from '@/lib/utils';

interface Location {
    place_id: string;
    display_name: string;
    lat: string;
    lon: string;
}

interface SelectedLocation {
    display_name: string;
    lat?: string;
    lon?: string;
    street?: string;
    city?: string;
    district?: string;
    country?: string;
}

export default function LocationSearchBox() {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<Location[]>([]);
    const [currentCountry, setCurrentCountry] = useState('');
    const [selected, setSelected] = useState<SelectedLocation>({ display_name: '' });

    useEffect(() => {
        const fetchCountry = async () => {
            const country = await getCountry();
            if (country) {
                setCurrentCountry(country.name);
            }
        };
        fetchCountry();
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length <= 2) {
            setSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${query}`);
            const sortedResults = response.data.sort((a: Location, b: Location) => {
                const aMatches = a.display_name.includes(currentCountry);
                const bMatches = b.display_name.includes(currentCountry);
                return aMatches === bMatches ? 0 : aMatches ? -1 : 1;
            });
            setSuggestions(sortedResults);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    // Use `useMemo` to memoize the debounced function
    const debouncedFetchSuggestions = useMemo(
        () => debounce(fetchSuggestions, 300),
        [currentCountry]
    );

    useEffect(() => {
        debouncedFetchSuggestions(query);
    }, [query, debouncedFetchSuggestions]);

    const handleSelect = (location: any) => {
        const { lat, lon, display_name } = location;
        console.log(location);
        if (display_name === 'none') {
            handleCannotFindAddress();
        } else {

            let address = location.address;
            const locationData = {
                street: address.road || '',
                city: address.city || '',
                district: address.town || address.village || '',
                country: address.country || currentCountry,
                zipCode: address.postcode || '',
                street2: address.suburb || '',
                latitude: lat ? parseFloat(lat) : 0,
                longitude: lon ? parseFloat(lon) : 0,
                fullAddress: location.display_name,
            };
            setSelected(location);
            dispatch(updateLocation(locationData));
            setQuery(display_name); // Update the input with the selected location
        }
    };

    const handleCannotFindAddress = () => {
        dispatch(updateLocation({
            street: query,
            city: '',
            district: '',
            country: currentCountry,
            latitude: null,
            longitude: null,
        }));
    };

    return (
        <Combobox value={selected} onChange={handleSelect}>
            <ComboboxInput
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Search for a location"
                displayValue={(item: SelectedLocation) => item?.display_name}
                onChange={(e) => setQuery(e.target.value)}
            />
            <ComboboxOptions className="border-0 shadow-md empty:invisible bg-white rounded-lg py-2 text-nowrap gap-2 text-dark z-30 max-w-md">
                {suggestions.map((location) => (
                    <ComboboxOption
                        key={location.place_id}
                        value={location}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                        {location.display_name}
                    </ComboboxOption>
                ))}
                <ComboboxOption
                    value={{ display_name: 'none' }}
                    onClick={handleCannotFindAddress}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                    Can&apos;t find the address
                </ComboboxOption>
            </ComboboxOptions>
        </Combobox>
    );
}
