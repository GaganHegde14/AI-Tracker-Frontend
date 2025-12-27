import React, { createContext, useContext, useState, useEffect } from "react";

const PremiumContext = createContext();

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error("usePremium must be used within a PremiumProvider");
  }
  return context;
};

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false); // For demo, this is false
  const [dailyUsage, setDailyUsage] = useState(() => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem("dailyUsage");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.date === today) {
        return parsed;
      }
    }
    return {
      date: today,
      aiTasksCreated: 0,
      aiTaskEnhanced: 0,
      aiChatPrompts: 0,
    };
  });

  const limits = {
    aiTasksCreated: isPremium ? Infinity : 2,
    aiTaskEnhanced: isPremium ? Infinity : 2,
    aiChatPrompts: isPremium ? Infinity : 5,
  };

  // Save usage to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("dailyUsage", JSON.stringify(dailyUsage));
  }, [dailyUsage]);

  // Reset usage at midnight
  useEffect(() => {
    const checkMidnight = () => {
      const today = new Date().toDateString();
      if (dailyUsage.date !== today) {
        setDailyUsage({
          date: today,
          aiTasksCreated: 0,
          aiTaskEnhanced: 0,
          aiChatPrompts: 0,
        });
      }
    };

    const interval = setInterval(checkMidnight, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [dailyUsage.date]);

  const canUseFeature = (feature) => {
    if (isPremium) return true;
    return dailyUsage[feature] < limits[feature];
  };

  const getRemainingUsage = (feature) => {
    if (isPremium) return Infinity;
    return Math.max(0, limits[feature] - dailyUsage[feature]);
  };

  const incrementUsage = (feature) => {
    if (isPremium) return true;

    if (dailyUsage[feature] < limits[feature]) {
      setDailyUsage((prev) => ({
        ...prev,
        [feature]: prev[feature] + 1,
      }));
      return true;
    }
    return false;
  };

  const value = {
    isPremium,
    setIsPremium,
    dailyUsage,
    limits,
    canUseFeature,
    getRemainingUsage,
    incrementUsage,
  };

  return (
    <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>
  );
};

export default PremiumContext;
