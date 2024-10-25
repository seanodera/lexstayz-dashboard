import {Tour, TourStepProps} from "antd"
import {useEffect, useState} from "react";


const tourSteps = [
    {
        title: 'Accommodations',
        description: 'This is where you manage your properties',
        target: '',
    },
    {
        title: 'Published accommodations',
        description: 'This are your published accommodations. Available to users on the website',
        target: 'tour-published-accommodations',
    },
    {
        title: 'Drafts Accommodations',
        description: 'Here you will find your unpublished and incomplete accommodations. They are note available for users',
        target: 'tour-draft-accommodations',
    },
    {
        title: 'Accommodation',
        description: 'Click on an accommodation to see the details',
        target: 'tour-accommodation-component',
    },
    {
        title: 'Accommodation',
        description: 'This are your accommodation details. The page might look different depending on the accommodation type',
        target: 'tour-accommodation-details',
    },
    {
        title: 'Actions',
        description: 'Here are the available accommodation actions',
        target: 'tour-accommodation-actions',
    }
]


export default function AccommodationsTour(){
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
