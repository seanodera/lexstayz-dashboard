import {countries} from "country-data";



export function getRandomInt({max, min = 0}: { max: number, min?: number }) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getAbbreviation = ({num}: { num: number }) => {

    if (num === 1 || num === 21 || num === 31) {
        return num.toString() + 'st'
    } else {
        return num.toString() + 'th'
    }
}

export const monthString = ({num}: { num: number }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months[num];
}

export const monthStringShort = ({num}: { num: number }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return months[num];
}

export const monthInt = ({month}: { month: string }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let finalIndex = 0;
    for (let index = 0; index <= months.length; index++) {
        if (months[index].toLocaleLowerCase() === month.toLocaleLowerCase()) {
            finalIndex = index;
        }
    }
    return finalIndex;
}

export const timeFromDate = ({date, am_pm = true}: {date: Date, am_pm: boolean}) => {
    let _date = new Date(date);

    if (am_pm){
        let hours = _date.getHours();
        let minutes: string | number = _date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    } else {
        return `${_date.getHours()}:${_date.getMinutes()}`;
    }
}

export const dayStringShort = ({num}: { num: any }) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",]
    return days[num];
}

export const dateReader = ({date = Date.now(), month = true, years = true, weekDay = false} :{date?: Date | number, month?: boolean , years?: boolean , weekDay?: boolean}) => {

    let _date = new Date(date);
    let dateString = '';
    if (weekDay) {
        dateString = dateString.concat(dayStringShort({num: _date.getDay()}), ' ')
    }
    dateString = dateString.concat(_date.getDate().toString(), ' ')
    if (month) {
        dateString = dateString.concat(monthStringShort({num: _date.getMonth()}), ' ')
    }
    if (years) {
        dateString = dateString.concat(_date.getFullYear().toString())
    }

    return dateString;
}

export function getCountry() {
    let result = {
        country: ''
    }
     fetch('https://api.country.is').then((res) => {
        res.json().then((data) => {
            result = data;
        })
    });

    return countries[result.country].name;
}

export function serviceCountries() {
    let list = ['KE', 'GH', 'UK','CY']
    return list.map((e) => countries[e])
}

export async function createFile({url, name = 'image'}: { url: string, name?: string }) {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
        type: 'image/jpeg'
    };
    // ... do something with the file or return it
    return new File([data], `${name}.jpg`, metadata);
}

export function toMoneyFormat(amount: number, {fractionDigits = 2}: {fractionDigits?: number} ) {

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits,
    });
}

export const generatePastMonths = (numMonths: number) => {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < numMonths; i++) {
        // Calculate the year and month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth() is zero-based

        // Add the year and month to the array
        months.push({ year, month });

        // Move to the previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
};

function getRandomSubarray(arr: Array<any>, size: number) {
    let shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[ index ];
        shuffled[ index ] = shuffled[ i ];
        shuffled[ i ] = temp;
    }
    return shuffled.slice(0, size);
}