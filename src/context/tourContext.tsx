import React, {createContext, ReactNode, useContext, useState} from 'react';
import DashboardTour from "@/components/tours/dashboardTour";
import MainTour from "@/components/mainTour";
import AccommodationsTour from "@/components/tours/accommodationsTour";
import ReservationsTour from "@/components/tours/reservationsTour";

// Define context
const TourContext = createContext({
    openReservationsTour: () => {},
    closeReservationsTour: () => {},
    openAccommodationsTour: () => {},
    closeAccommodationsTour: () => {},
    openMainTour: () => {},
    closeMainTour: () => {},
    openDashboardTour: () => {},
    closeDashboardTour: () => {},
    isReservationsOpen: false,
    isAccommodationsOpen: false,
    isMainOpen: false,
    isDashboardOpen: false
});

// Custom hook to use the TourContext
const useTour = () => useContext(TourContext);

const TourContextProvider = ({ children }: {children: ReactNode}) => {
    const [isReservationsOpen, setReservationsOpen] = useState(false);
    const [isAccommodationsOpen, setAccommodationsOpen] = useState(false);
    const [isMainOpen, setMainOpen] = useState(false);
    const [isDashboardOpen, setDashboardOpen] = useState(false);

    const openReservationsTour = () => setReservationsOpen(true);
    const closeReservationsTour = () => setReservationsOpen(false);

    const openAccommodationsTour = () => setAccommodationsOpen(true);
    const closeAccommodationsTour = () => setAccommodationsOpen(false);

    const openMainTour = () => setMainOpen(true);
    const closeMainTour = () => setMainOpen(false);

    const openDashboardTour = () => setDashboardOpen(true);
    const closeDashboardTour = () => setDashboardOpen(false);

    return (
        <TourContext.Provider value={{
            openReservationsTour,
            closeReservationsTour,
            openAccommodationsTour,
            closeAccommodationsTour,
            openMainTour,
            closeMainTour,
            openDashboardTour,
            closeDashboardTour,
            isReservationsOpen,
            isAccommodationsOpen,
            isMainOpen,
            isDashboardOpen
        }}>
            {children}
            <DashboardTour/>
            <AccommodationsTour/>
            <ReservationsTour/>
        </TourContext.Provider>
    );
};

export { TourContextProvider, useTour };
