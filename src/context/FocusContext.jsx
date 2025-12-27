import React, { createContext, useContext, useState, useEffect } from "react";

const FocusContext = createContext();

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocus must be used within a FocusProvider");
  }
  return context;
};

export const FocusProvider = ({ children }) => {
  const [isTimerActive, setIsTimerActive] = useState(() => {
    const saved = localStorage.getItem("focus-timer-active");
    return saved === "true";
  });

  const [timerData, setTimerData] = useState(() => {
    const saved = localStorage.getItem("focus-timer-data");
    return saved
      ? JSON.parse(saved)
      : {
          timeLeft: 25 * 60,
          customTime: 25,
          breakTime: 5,
          isRunning: false,
          isBreak: false,
          completedSessions: 0,
          startTime: null,
          soundEnabled: true,
          notificationSound: "bell", // bell, chime, soft
        };
  });

  const [focusMode, setFocusMode] = useState(false);

  // Save timer data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("focus-timer-data", JSON.stringify(timerData));
    localStorage.setItem("focus-timer-active", isTimerActive.toString());
  }, [timerData, isTimerActive]);

  // Continue timer from where it left off
  useEffect(() => {
    if (timerData.isRunning && timerData.startTime) {
      const elapsed = Math.floor((Date.now() - timerData.startTime) / 1000);
      const newTimeLeft = Math.max(0, timerData.timeLeft - elapsed);

      if (newTimeLeft > 0) {
        setTimerData((prev) => ({ ...prev, timeLeft: newTimeLeft }));
      } else {
        // Timer should have completed while away
        handleTimerComplete();
      }
    }
  }, []);

  const handleTimerComplete = () => {
    setTimerData((prev) => ({
      ...prev,
      isRunning: false,
      completedSessions: prev.isBreak
        ? prev.completedSessions
        : prev.completedSessions + 1,
      isBreak: !prev.isBreak,
      timeLeft: prev.isBreak ? prev.customTime * 60 : prev.breakTime * 60,
      startTime: null,
    }));
    setIsTimerActive(false);
  };

  // Don't block navigation - let timer continue in background
  const startFocus = () => {
    setFocusMode(true);
    setTimerData((prev) => ({
      ...prev,
      isRunning: true,
      startTime: Date.now(),
    }));
  };

  const stopFocus = () => {
    setFocusMode(false);
    setTimerData((prev) => ({
      ...prev,
      isRunning: false,
      startTime: null,
    }));
  };

  const updateTimerData = (updates) => {
    setTimerData((prev) => ({ ...prev, ...updates }));
  };

  const resetTimer = () => {
    setTimerData((prev) => ({
      ...prev,
      isRunning: false,
      timeLeft: prev.isBreak ? prev.breakTime * 60 : prev.customTime * 60,
      startTime: null,
    }));
    setIsTimerActive(false);
  };

  const value = {
    isTimerActive,
    setIsTimerActive,
    timerData,
    updateTimerData,
    startFocus,
    stopFocus,
    resetTimer,
    handleTimerComplete,
    focusMode,
    setFocusMode,
  };

  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
};

export default FocusContext;
