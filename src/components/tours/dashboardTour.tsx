import {Tour, TourStepProps} from "antd";
import {useEffect, useState} from "react";


const tourSteps = [
    {
        title: "Dashboard",
        description: 'This your dashboard, Generally the first page you will see after logging in',
        target: 'tour-dashboard-show',
    },
    {
        title: 'Reservation count',
        description: 'This is reservation summary to help you keep track of your data',
        target: 'tour-dashboard-reservations',
    },
    {
        title: 'Occupancy',
        description: 'This is the total rooms you have. It also shows the number of currently occupied rooms',
        target: 'tour-dashboard-Occupancy',
    },
    {
        title: 'Revenue',
        description: 'This is the current amount of revenue you have. Money moves from pending balance into total balance automatically 2 days after the guest has checked out',
        target: 'tour-dashboard-revenue',
    },{
    title: 'Recent Bookings',
        description: 'This section shows your most recent bookings. Its a short version of the main reservation list',
        target: 'tour-dashboard-recent',
    },
    {
        title: 'Check Ins',
        description: 'This are today\'s check ins.',
        target: 'tour-dashboard-check-ins',
    }
]


export default function DashboardTour(){
    const [open, setOpen] = useState(true);
    const [processed, setProcessed] = useState<TourStepProps[]>([]);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const processedSteps = tourSteps.map((step) => ({
            ...step,
            target: document.getElementById(step.target) ? () => document.getElementById(step.target)! : undefined,
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
