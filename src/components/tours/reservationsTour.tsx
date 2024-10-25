import {useEffect, useState} from "react";
import {Tour, TourStepProps} from "antd";


const tourSteps = [
    {
        title: 'Reservations',
        description: 'Here you will see your bookings. You can sort by your needs but by default it uses the booking date',
        target: ''
    },
    {
        title: 'Reservation',
        description: 'Click on a reservation to see more about it',
        target: undefined
    },
    {
        title: 'Reservation',
        description: 'This is the reservation details. The email and phone become visible after you accept the reservation',
        target: undefined,
    },
    {
        title: 'Booking Summary',
        description: 'This is the receipt of the transactions done',
        target: undefined
    },
    {
        title: 'Fees',
        description: 'This is the total fees for this booking paid to us',
        target: undefined,
    },
    {
        title: 'Total',
        description: 'This is the total amount including the lexstayz fees',
        target: undefined,
    },
    {
        title: 'Converted Amount',
        description: 'This is the total amount converted to the users currency. Lexstayz shows the users the costs in their local currency',
        target: undefined,
    },
    {
        title: 'Actions',
        description: 'This are the available actions for this reservation. By confirming the reservation is then accountable to the defined cancellation policy',
        target: undefined,
    }
]


export default function ReservationsTour(){
    const [open, setOpen] = useState(true);
    const [processed, setProcessed] = useState<TourStepProps[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const processedSteps = tourSteps.map((step) => ({
            ...step,
            target: step.target && document.getElementById(step.target) ? () => document.getElementById(step.target)! : undefined,
        }));
        console.log('processed steps', processedSteps);
        setProcessed(processedSteps);
    }, [currentStep]);


    return <Tour  open={open}
                  placement={'bottomLeft'}
                  current={currentStep}
                  onChange={(current) => setCurrentStep(current)}
                  steps={processed}
                  onFinish={() => setOpen(false)}
                  onClose={() => setOpen(false)}  />
}
