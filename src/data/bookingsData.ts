import axios from "axios";

export const statuses = ['Pending', 'Confirmed', 'Canceled', 'Rejected']



export async function refundBooking(booking: any, amount?: number) {
    let response;
   if (amount){
       response = await axios.post('/api/createRefund', {reference: booking.id, amount: amount})
   } else {
     response = await axios.post('/api/createRefund', {reference: booking.id})
   }
    return response.data;
}