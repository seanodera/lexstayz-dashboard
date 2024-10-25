import React, {useEffect, useState} from 'react';
import {Tour, Button, TourStepProps} from 'antd';


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
    const [open, setOpen] = useState(false);
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
    return (
        <>
            <Button type="primary" onClick={() => {
                setOpen(true);
                setCurrentStep(0)
            }}>
                Start Tour
            </Button>
            <Tour open={open} placement={'bottomLeft'} current={currentStep}
                  onChange={(current) => setCurrentStep(current)} steps={processed} onClose={() => setOpen(false)}
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
