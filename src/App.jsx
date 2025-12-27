import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import SplashScreen from "./Components/SplashScreen";
import DashBoard from "./Pages/DashBoard";
import AddTaskPage from "./Pages/AddTaskPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import TasksPage from "./Pages/TasksPage";
import EditTaskPage from "./Pages/EditTaskPage";
import ProfilePage from "./Pages/ProfilePage";
import AnalyticsPage from "./Pages/AnalyticsPage";
import AiInsightsPage from "./Pages/AiInsightsPage";
import InsightsPage from "./Pages/InsightsPage";
import PremiumPage from "./Pages/PremiumPage";
import FocusPage from "./Pages/FocusPage";
import LeaderboardPage from "./Pages/LeaderboardPage";
import SupportPage from "./Pages/SupportPage";
import NotFoundPage from "./Pages/NotFoundPage";
import LandingPage from "./Pages/LandingPage";

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem("hasVisited");
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount and when storage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    // Check initially
    checkAuth();

    // Listen for storage changes (when token is added/removed)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for same-window localStorage changes
    window.addEventListener("authChange", checkAuth);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasVisited", "true");
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <div>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {isAuthenticated && (
          <>
            <Route path="/home" element={<DashBoard />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/add-task" element={<AddTaskPage />} />
            <Route path="/edit-task" element={<EditTaskPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<InsightsPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/ai-insights" element={<AiInsightsPage />} />
          </>
        )}
      </Routes>
    </div>
  );
};

export default App;
