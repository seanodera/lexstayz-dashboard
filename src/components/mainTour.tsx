import React, { useState } from 'react';
import { Tour, Button, Menu } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
    }
];

const MainTour = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button type="primary" onClick={() => setOpen(true)}>
                Start Tour
            </Button>
            <Tour open={open} steps={tourSteps.map((step) => ({
                ...step,
                target: document.getElementById(step.target)
            }))} onClose={() => setOpen(false)} indicatorsRender={(current, total) => (
                <span>
            {current + 1} / {total}
          </span>
            )} />
        </>
    );
};

export default MainTour;
