import {Tour, TourStepProps} from "antd"
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {useTour} from "@/context/tourContext";
import {addOnboarded} from "@/data/usersData";
import {getUserDetailsAsync} from "@/slices/authenticationSlice";
import {useAppDispatch} from "@/hooks/hooks";


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
    const { isAccommodationsOpen, closeAccommodationsTour } = useTour();
    const [processed, setProcessed] = useState<TourStepProps[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const pathname = usePathname()
    const dispatch = useAppDispatch()
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
    }, [currentStep,pathname]);


    return <Tour  open={isAccommodationsOpen}
                  placement={'bottomLeft'}
                  current={currentStep}
                  onChange={(current) => setCurrentStep(current)}
                  steps={processed}
                  onFinish={() => {
                      closeAccommodationsTour();
                      addOnboarded('accommodations').then((user) => {
                          if (user) {
                              dispatch(getUserDetailsAsync(user.uid))
                          }
                      })
                  }}
                  onClose={closeAccommodationsTour}  />
}
