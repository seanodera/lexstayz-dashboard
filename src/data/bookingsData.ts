import axios from "axios";
import {handler_url} from "@/lib/utils";

export const statuses = ['Pending', 'Confirmed', 'Canceled', 'Rejected']



export async function refundBooking(booking: any, amount?: number) {
    let response;
    const method = booking.paymentMethod
   if (amount){
       response = await axios.post(`${handler_url}/api/payments/createRefund`, {reference: booking.paymentData.reference, amount: amount,method})
   } else {
     response = await axios.post(`${handler_url}/api/payments/createRefund`, {reference: booking.paymentData.reference,method})
   }
    return response.data;
}
