import axios from "axios";
import {handler_url} from "@/lib/utils";

export const statuses = ['Pending', 'Confirmed', 'Canceled', 'Rejected']



export async function refundBooking(booking: any, amount?: number) {
    let response;
   if (amount){
       response = await axios.post(`${handler_url}/api/payments/createRefund`, {reference: booking.paymentData.reference, amount: amount})
   } else {
     response = await axios.post(`${handler_url}/api/payments/createRefund`, {reference: booking.paymentData.reference})
   }
    return response.data;
}
