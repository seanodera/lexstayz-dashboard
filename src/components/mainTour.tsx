import React, {useEffect, useState} from 'react';
import {Tour, Button, TourStepProps} from 'antd';
import {usePathname} from "next/navigation";
import {useTour} from "@/context/tourContext";


const tourSteps = [
    {
        title: 'Dashboard',
        description: 'This is your Dashboard where you can overview your activities.',
        target: 'tour-dashboard', // Ensure the target IDs match your HTML IDs
    },
    {
        title: 'Accommodations',
        description: 'Click here to view and manage your accommodations.',
        target: 'tour-accommodations',
    },
    {
        title: 'Create Stay',
        description: 'Click this button to start creating a new accommodation.',
        target: 'tour-create-stay',
    },
    {
        title: 'Property Name',
        description: 'Enter the name of the accommodation here.',
        target: 'tour-accommodation-name',
    },
    {
        title: 'Property Type',
        description: 'Select the type of accommodation here.',
        target: 'tour-accommodation-type',
    },
    {
        title: 'Property Details',
        description: 'Proceed with the details of the accommodation. I will meet you at the end!',
        target: ''
    }
];

const MainTour = () => {
    const { openMainTour, isMainOpen, closeMainTour } = useTour();
    const [processed, setProcessed] = useState<TourStepProps[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const pathname = usePathname()
    useEffect(() => {
        const processedSteps = tourSteps.map((step) => ({
            ...step,
            target: document.getElementById(step.target) ? () => document.getElementById(step.target)! : undefined,
        }));

        if (!processedSteps[currentStep].target && currentStep !== 0) {
            const prevStepTarget = processedSteps[currentStep - 1].target;

            if (prevStepTarget) {
                const prevElement = prevStepTarget();

                if (prevElement) {
                    prevElement.click();
                }
            }
        }
        console.log('processed steps', processedSteps);
        setProcessed(processedSteps);
    }, [currentStep, pathname]);
    return (
        <>
            <Button type="primary" onClick={() => {
                openMainTour();
                setCurrentStep(0)
            }}>
                Start Tour
            </Button>
            <Tour  open={isMainOpen} placement={'bottomLeft'} current={currentStep}
                  onChange={(current) => setCurrentStep(current)} steps={processed} onClose={closeMainTour}
                  indicatorsRender={(current, total) => {

                      return (
                          <span>
                {current + 1} / {total}
              </span>
                      );
                  }}/>
        </>
    );
};

export default MainTour;
