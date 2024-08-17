import React, {useState, useEffect, useCallback} from "react";
import {Combobox, ComboboxInput, ComboboxOption, ComboboxOptions} from "@headlessui/react";
import axios from "axios";
import {useAppDispatch} from "@/hooks/hooks";
import {updateLocation} from "@/slices/createStaySlice";
import {debounce} from "lodash";
import {getCountry} from "@/lib/utils";


export default function LocationSearchBox() {
    const dispatch = useAppDispatch();
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [currentCountry, setCurrentCountry] = useState('');
    const [selected, setSelected] = useState({
        display_name: ''
    });

    useEffect(() => {
        async function fetchCountry() {
            const country = await getCountry();
            if (country) {
                setCurrentCountry(country.name);
            }
        }

        fetchCountry();
    }, []);

    const fetchSuggestions = async (query: string) => {
        if (query.length > 2) {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
            const sortedResults = response.data.sort((a: any, b: any) => {
                if (a.display_name.includes(currentCountry)) return -1;
                if (b.display_name.includes(currentCountry)) return 1;
                return 0;
            });
            setSuggestions(sortedResults);
        } else {
            setSuggestions([]);
        }
    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), [currentCountry]);

    useEffect(() => {
        debouncedFetchSuggestions(query);
    }, [query, debouncedFetchSuggestions]);

    const handleSelect = (location: any) => {
        console.log(location);

        if (location.display_name === 'none') {
            console.log(location);
            dispatch(updateLocation({
                street: query,
                city: '',
                district: '',
                country: currentCountry,
                latitude: null,
                longitude: null,
            }));
        } else {
            const {lat, lon, display_name} = location;
            const [street, city, district, country] = display_name.split(',').map((part: string) => part.trim());
            setSelected(location)
            dispatch(updateLocation({
                street,
                city,
                district,
                country,
                latitude: parseFloat(lat),
                longitude: parseFloat(lon),
            }));
            setQuery(display_name); // Update the query with the selected location
        }
    };

    const handleCannotFindAddress = () => {
        // Handle the "Can't find the address" scenario here
        dispatch(updateLocation({
            street: '',
            city: '',
            district: '',
            country: currentCountry,
            latitude: null,
            longitude: null,
        }));
    };

    return (
        <Combobox value={selected} onChange={(value) => handleSelect(value)}>
            <ComboboxInput
                className={'w-full border border-gray-300 rounded-md p-2'}
                placeholder="Search for a location"
                displayValue={(item: any) => item?.display_name}
                onChange={(e) => setQuery(e.target.value)}
            />
            <ComboboxOptions anchor="bottom"
                             className="border-0 shadow-md empty:invisible bg-white rounded-lg py-2 text-nowrap gap-2 text-dark z-30 max-w-md">
                {suggestions.map((location: any) => (
                    <ComboboxOption
                        key={location.place_id}
                        value={location}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                        {location.display_name}
                    </ComboboxOption>
                ))}
                <ComboboxOption
                    value={{
                        display_name: 'none'
                    }
                    }
                    onClick={handleCannotFindAddress}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                    Can&apos;t find the address
                </ComboboxOption>
            </ComboboxOptions>
        </Combobox>
    );
}
