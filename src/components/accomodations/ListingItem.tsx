import Link from "next/link";


export default function ListingItem({stay, id}: { stay: any, id?: string }) {

    return <Link id={id} href={`/accommodations/${stay.id}`} className={'block text-dark rounded-lg '}>
        <img alt={stay.name} src={stay.poster} className={'aspect-video object-cover rounded-lg w-full mb-2'} />
        <h3 className={'font-semibold mb-0'}>{stay.name}</h3>
        <h4 className={'font-medium text-gray-500'}>{stay.location.district}, {stay.location.country}</h4>
        <p className={'line-clamp-2 text-sm'}> {stay.description}</p>

    </Link>
}
