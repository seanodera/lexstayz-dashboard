import {Suspense} from "react";
import CheckOutPage from "@/components/checkout/checkoutPage";


export default function CheckOutPageWrapper(){

    return <Suspense fallback={null}><CheckOutPage/></Suspense>
}
