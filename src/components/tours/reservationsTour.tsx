import {useEffect, useState} from "react";
import {Tour, TourStepProps} from "antd";
import {useTour} from "@/context/tourContext";
import {addOnboarded} from "@/data/usersData";
import {getUserDetailsAsync} from "@/slices/authenticationSlice";
import {useAppDispatch} from "@/hooks/hooks";


const tourSteps = [
    {
        title: 'Reservations',
        description: 'Here you will see your bookings. You can sort by your needs but by default it uses the booking date',
        target: ''
    },
    {
        title: 'Reservation',
        description: 'Click on a reservation to see more about it',
        target: 'tour-reservation-row',
    },
    {
        title: 'Reservation',
        description: 'This is the reservation details. The email and phone become visible after you accept the reservation',
        target: 'tour-reservation-details',
    },
    {
        title: 'Booking Summary',
        description: 'This is the receipt of the transactions done',
        target: 'tour-reservation-summary'
    },
    {
        title: 'Fees',
        description: 'This is the total fees for this booking paid to us',
        target: 'tour-reservation-fees',
    },
    {
        title: 'Total',
        description: 'This is the total amount including the lexstayz fees',
        target: 'tour-reservation-total',
    },
    {
        title: 'Converted Amount',
        description: 'This is the total amount converted to the users currency. Lexstayz shows the users the costs in their local currency',
        target: 'tour-reservation-converted',
    },
    {
        title: 'Actions',
        description: 'This are the available actions for this reservation. By confirming the reservation is then accountable to the defined cancellation policy',
        target: 'tour-reservation-actions',
    }
]


export default function ReservationsTour() {
    const {isReservationsOpen, closeReservationsTour} = useTour();
    const [processed, setProcessed] = useState<TourStepProps[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const dispatch = useAppDispatch()
    useEffect(() => {
        const processedSteps = tourSteps.map((step) => ({
            ...step,
            target: step.target && document.getElementById(step.target) ? () => document.getElementById(step.target)! : undefined,
        }));
        if (!processedSteps[ currentStep ].target && currentStep !== 0) {
            const prevStepTarget = processedSteps[ currentStep - 1 ].target;

            if (prevStepTarget) {
                const prevElement = prevStepTarget();

                if (prevElement) {
                    prevElement.click();
                }
            }
        }
        console.log('processed steps', processedSteps);
        setProcessed(processedSteps);
    }, [currentStep]);


    return <Tour open={isReservationsOpen}
                 placement={'bottomLeft'}
                 current={currentStep}
                 onChange={(current) => setCurrentStep(current)}
                 steps={processed}
                 onFinish={() => {
                     closeReservationsTour();
                     addOnboarded('reservations').then((user) => {
                         if (user) {
                             dispatch(getUserDetailsAsync(user.uid))
                         }
                     })
                 }}
                 onClose={closeReservationsTour}/>
}
