"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

interface TourContextType {
  startTour: () => void;
  stopTour: () => void;
  setTourSteps: (steps: Step[]) => void;
  isTourRunning: boolean;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within TourProvider");
  }
  return context;
};

interface TourProviderProperties {
  children: ReactNode;
}

export const TourProvider = ({ children }: TourProviderProperties) => {
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [steps, setSteps] = useState<Step[]>([]);

  const startTour = useCallback(() => {
    setIsTourRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsTourRunning(false);
  }, []);

  const setTourSteps = useCallback((newSteps: Step[]) => {
    setSteps(newSteps);
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setIsTourRunning(false);
    }
  };

  return (
    <TourContext.Provider value={{ startTour, stopTour, setTourSteps, isTourRunning }}>
      {children}
      <Joyride
        steps={steps}
        run={isTourRunning}
        continuous
        // showProgress
        showSkipButton
        scrollToFirstStep
        scrollOffset={100}
        disableOverlayClose
        disableCloseOnEsc
        spotlightClicks
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: "var(--background)",
            textColor: "var(--background)",
            backgroundColor: "var(--primary)",
            arrowColor: "var(--primary)",
            beaconSize: 16,
          },
          beaconInner: {
            background: "var(--destructive)",
          },
          beaconOuter: {
            boxShadow: "0 0 0 2px var(--destructive)",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          spotlight: {
            borderRadius: 6,
            backgroundColor: "#FFFFFF80",
          },
          tooltip: {
            borderRadius: 6,
            padding: 20,
            boxShadow: "var(--shadow)",
          },
          tooltipContainer: {
            textAlign: "left",
          },
          tooltipTitle: {
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "10px",
          },
          tooltipContent: {
            fontSize: "14px",
            padding: "10px 0",
          },
          buttonNext: {
            backgroundColor: "var(--background)",
            borderRadius: 4,
            padding: "8px 16px",
            fontSize: "12px",
            color: "var(--primary)",
            fontWeight: "500",
          },
          buttonBack: {
            marginRight: 10,
            fontSize: "12px",
          },
          buttonSkip: {
            color: "var(--background)",
            fontSize: "12px",
          },
        }}
        locale={{
          back: "Back",
          close: "Close",
          last: "Finish",
          next: "Next",
          open: "Open",
          skip: "Skip Tour",
        }}
      />
    </TourContext.Provider>
  );
};
