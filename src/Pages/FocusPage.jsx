import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import { useFocus } from "../context/FocusContext";
import { usePremium } from "../context/PremiumContext";
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Target,
  Coffee,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Bell,
  Music,
  Headphones,
  Maximize,
  Minimize,
  BarChart3,
  Clock,
  Calendar,
  Lock,
  X,
  FileText,
  Save,
} from "lucide-react";

const FocusPage = () => {
  const navigate = useNavigate();
  const {
    isTimerActive,
    setIsTimerActive,
    timerData,
    updateTimerData,
    startFocus,
    stopFocus,
    resetTimer,
    handleTimerComplete,
  } = useFocus();

  const { isPremium } = usePremium();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [currentMotivation, setCurrentMotivation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSessionDetails, setShowSessionDetails] = useState(false);
  const [sessionNote, setSessionNote] = useState("");

  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const bellSoundRef = useRef(null);
  const chimeSoundRef = useRef(null);
  const softSoundRef = useRef(null);

  // Motivation messages that change based on progress
  const motivationMessages = [
    "🚀 Let's start this productive session!",
    "💪 You're building momentum!",
    "⚡ Great focus! Keep going!",
    "🔥 You're in the zone now!",
    "🎯 Almost there! Stay focused!",
    "✨ Final push! You've got this!",
  ];

  // Update motivation message based on progress
  useEffect(() => {
    const progress = 1 - timerData.timeLeft / (timerData.customTime * 60);
    const messageIndex = Math.floor(progress * (motivationMessages.length - 1));
    setCurrentMotivation(messageIndex);
  }, [timerData.timeLeft]);

  // Timer countdown logic
  useEffect(() => {
    if (timerData.isRunning && timerData.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        updateTimerData({ timeLeft: timerData.timeLeft - 1 });
      }, 1000);
    } else if (timerData.timeLeft === 0 && timerData.isRunning) {
      handleCompleteTimer();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [timerData.isRunning, timerData.timeLeft]);

  const handleCompleteTimer = () => {
    // Play completion sound
    playNotificationSound();

    // Save completed session to history with note (only for focus sessions)
    const sessionDuration = timerData.isBreak
      ? timerData.breakTime * 60
      : timerData.customTime * 60;
    const sessionType = timerData.isBreak ? "break" : "focus";
    const noteToSave = sessionType === "focus" ? sessionNote : "";
    saveSessionToHistory(sessionDuration, sessionType, noteToSave);

    // Clear session note after saving
    if (sessionType === "focus") {
      setSessionNote("");
    }

    if (!timerData.isBreak) {
      // Completed a focus session
      setShowReward(true);
      setTimeout(() => setShowReward(false), 3000);
    }

    handleTimerComplete();
  };

  const playNotificationSound = () => {
    if (!timerData.soundEnabled) return;

    let soundRef;
    switch (timerData.notificationSound) {
      case "chime":
        soundRef = chimeSoundRef.current;
        break;
      case "soft":
        soundRef = softSoundRef.current;
        break;
      default:
        soundRef = bellSoundRef.current;
    }

    if (soundRef) {
      soundRef.play().catch((e) => console.log("Audio play failed:", e));
    }
  };

  // Session tracking functions
  const saveSessionToHistory = (duration, type, note = "") => {
    const session = {
      id: Date.now(),
      date: new Date().toISOString(),
      duration: duration,
      type: type, // 'focus' or 'break'
      completed: true,
      note: note.trim(),
    };

    const existingHistory = JSON.parse(
      localStorage.getItem("focusSessionHistory") || "[]"
    );
    const updatedHistory = [session, ...existingHistory];

    // For non-premium users, keep only last 3 days
    if (!isPremium) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const filteredHistory = updatedHistory.filter(
        (s) => new Date(s.date) >= threeDaysAgo
      );
      localStorage.setItem(
        "focusSessionHistory",
        JSON.stringify(filteredHistory)
      );
    } else {
      localStorage.setItem(
        "focusSessionHistory",
        JSON.stringify(updatedHistory)
      );
    }
  };

  const getSessionHistory = () => {
    const history = JSON.parse(
      localStorage.getItem("focusSessionHistory") || "[]"
    );

    if (!isPremium) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return history.filter((s) => new Date(s.date) >= threeDaysAgo);
    }

    return history;
  };

  const getSessionStats = () => {
    const history = getSessionHistory();
    const today = new Date().toDateString();
    const todaySessions = history.filter(
      (s) => new Date(s.date).toDateString() === today
    );

    return {
      totalSessions: history.length,
      todaySessions: todaySessions.length,
      totalFocusTime: history.reduce(
        (sum, s) => (s.type === "focus" ? sum + s.duration : sum),
        0
      ),
      averageSessionLength: history.length
        ? Math.round(
            history.reduce((sum, s) => sum + s.duration, 0) / history.length
          )
        : 0,
    };
  };

  const toggleTimer = () => {
    if (!timerData.isRunning && !isSettingsOpen) {
      setIsSettingsOpen(false);
    }

    const newRunningState = !timerData.isRunning;
    updateTimerData({
      isRunning: newRunningState,
      startTime: newRunningState ? Date.now() : null,
    });

    // Update context timer state
    if (newRunningState) {
      startFocus();
      setIsTimerActive(true);
    } else {
      stopFocus();
      setIsTimerActive(false);
    }
  };

  const handleResetTimer = () => {
    resetTimer();
  };

  const handleUpgradeToPremium = () => {
    navigate("/premium");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const updateCustomTime = (minutes) => {
    if (minutes >= 10 && minutes <= 60) {
      updateTimerData({
        customTime: minutes,
        timeLeft:
          !timerData.isRunning && !timerData.isBreak
            ? minutes * 60
            : timerData.timeLeft,
      });
    }
  };

  const updateBreakTime = (minutes) => {
    if (minutes >= 1 && minutes <= 15) {
      updateTimerData({
        breakTime: minutes,
        timeLeft:
          !timerData.isRunning && timerData.isBreak
            ? minutes * 60
            : timerData.timeLeft,
      });
    }
  };

  const progress = timerData.isBreak
    ? ((timerData.breakTime * 60 - timerData.timeLeft) /
        (timerData.breakTime * 60)) *
      100
    : ((timerData.customTime * 60 - timerData.timeLeft) /
        (timerData.customTime * 60)) *
      100;

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Request fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  const getMotivationalMessage = () => {
    const percentage = progress;
    if (percentage < 25) return "You've got this! Stay focused 🎯";
    if (percentage < 50) return "Great progress! Keep going 💪";
    if (percentage < 75) return "You're in the zone! Almost there 🔥";
    return "Final stretch! You're amazing 🚀";
  };

  const getAnimationIntensity = () => {
    const percentage = progress;
    if (percentage < 25) return "animate-pulse";
    if (percentage < 50) return "animate-bounce";
    if (percentage < 75) return "animate-pulse";
    return "animate-bounce";
  };

  // Session Details Modal Component
  const SessionDetailsModal = () => {
    const sessionHistory = getSessionHistory();
    const stats = getSessionStats();

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">
                Focus Session History
              </h2>
            </div>
            <button
              onClick={() => setShowSessionDetails(false)}
              className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {stats.totalSessions}
              </div>
              <div className="text-sm text-gray-300">Total Sessions</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {stats.todaySessions}
              </div>
              <div className="text-sm text-gray-300">Today</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(stats.totalFocusTime / 60)}m
              </div>
              <div className="text-sm text-gray-300">Total Focus</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">
                {Math.round(stats.averageSessionLength / 60)}m
              </div>
              <div className="text-sm text-gray-300">Average</div>
            </div>
          </div>

          {/* Premium Notice for Non-Premium Users */}
          {!isPremium && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-400" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-400">
                    Limited History - Upgrade to Premium
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Free users can view sessions from the last 3 days only.
                    Upgrade to Premium to access unlimited session history and
                    detailed analytics.
                  </p>
                  <button
                    onClick={handleUpgradeToPremium}
                    className="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Session History */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Sessions {!isPremium && "(Last 3 Days)"}
            </h3>

            {sessionHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No focus sessions recorded yet.</p>
                <p className="text-sm">
                  Start a timer to track your productivity!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessionHistory.slice(0, 10).map((session) => (
                  <div
                    key={session.id}
                    className="bg-gray-700/30 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            session.type === "focus"
                              ? "bg-blue-400"
                              : "bg-green-400"
                          }`}
                        ></div>
                        <div>
                          <div className="text-white font-medium">
                            {session.type === "focus"
                              ? "Focus Session"
                              : "Break Session"}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(session.date).toLocaleDateString()} at{" "}
                            {new Date(session.date).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {Math.round(session.duration / 60)}m
                        </div>
                        <div className="text-gray-400 text-sm">Duration</div>
                      </div>
                    </div>
                    {session.note && session.type === "focus" && (
                      <div className="mt-2 pt-2 border-t border-gray-600/50">
                        <div className="flex items-start gap-2">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-gray-300 text-sm italic">
                            "{session.note}"
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Fullscreen Timer Component
  const FullscreenTimer = () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full animate-pulse duration-[8s]"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-purple-500/5 rounded-full animate-pulse duration-[6s] delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-teal-500/3 rounded-full animate-pulse duration-[10s] delay-2000"></div>
      </div>

      {/* Exit Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-8 right-8 z-50 w-12 h-12 rounded-full bg-gray-800/80 hover:bg-gray-700/80 flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200"
      >
        <Minimize className="w-6 h-6" />
      </button>

      {/* Main Timer */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Progress Ring */}
        <div className="relative w-80 h-80 mb-8">
          <svg className="transform -rotate-90 w-full h-full">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#374151"
              strokeWidth="12"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke={timerData.isBreak ? "#10b981" : "#3b82f6"}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={2 * Math.PI * 45 * (1 - progress / 100)}
              className="transition-all duration-1000 ease-out drop-shadow-lg"
              style={{
                filter: timerData.isRunning
                  ? `drop-shadow(0 0 20px ${
                      timerData.isBreak ? "#10b981" : "#3b82f6"
                    })`
                  : "none",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-7xl font-mono font-bold text-white mb-4 drop-shadow-lg">
              {formatTime(timerData.timeLeft)}
            </div>
            <div className="text-2xl text-gray-300 font-medium">
              {timerData.isBreak ? "Break Time" : "Focus Time"}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {timerData.isRunning && (
          <div className="text-center mb-8">
            <p className="text-2xl font-medium text-gray-300 animate-pulse">
              {motivationMessages[currentMotivation]}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={toggleTimer}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 shadow-2xl hover:scale-110 ${
              timerData.isRunning
                ? "bg-red-500 hover:bg-red-600"
                : timerData.isBreak
                ? "bg-green-500 hover:bg-green-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            style={{
              boxShadow: timerData.isRunning
                ? `0 0 30px ${
                    timerData.isBreak
                      ? "#ef4444"
                      : timerData.isBreak
                      ? "#10b981"
                      : "#3b82f6"
                  }`
                : "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            {timerData.isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Reward Animation */}
      {showReward && (
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl animate-in zoom-in-50 duration-500 border border-gray-700">
            <div className="text-center">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-bounce" />
              <h3 className="text-3xl font-bold text-white mb-2">
                Amazing Work! 🎉
              </h3>
              <p className="text-gray-300 text-lg">
                You completed a focus session!
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="font-semibold text-white text-xl">
                  Sessions: {timerData.completedSessions}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audio Elements */}
      <audio ref={bellSoundRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy152QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
          type="audio/wav"
        />
      </audio>
      <audio ref={chimeSoundRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy152QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
          type="audio/wav"
        />
      </audio>
      <audio ref={softSoundRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy152QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
          type="audio/wav"
        />
      </audio>
    </div>
  );

  // If in fullscreen mode, show fullscreen timer
  if (isFullscreen) {
    return <FullscreenTimer />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full opacity-30 animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Progress Ring Animation */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-96 h-96 rounded-full border-2 border-blue-500/20 ${
              progress > 0 ? "animate-spin" : ""
            } duration-[60s] linear`}
          ></div>
        </div>

        {/* Sound Elements */}
        <audio ref={bellSoundRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy252QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
            type="audio/wav"
          />
        </audio>
        <audio ref={chimeSoundRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy152QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
            type="audio/wav"
          />
        </audio>
        <audio ref={softSoundRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMaAiuR3/PNeywGIXPE8+GYSAoRWK7h7bhWFAg8muDrwF4eAB+C3fPYgzwIGmTR7uOqXxcLQKPa7cSNMQgZWKrg6qlWEgpFnuDtu2cdAiqJ3fLGdCYDHmbO8N6dTwwKUKjj7bNiGAM4k9Xy13MkBSBvwvPPfzAHHWfG8OKaTQsKUqDb7cNwIgQcZdPy152QQAoUXK3g7bVWEwk8m+DnvGMAGCqO4/PGdiMBGl3M8uKdUAoJT6Dj7btWEgpFnOLpvGYcAy2O2/LNeSsEIHHH8+GXSAUG7uWWJGAABCSa09aAaQ=="
            type="audio/wav"
          />
        </audio>

        {/* Reward Animation */}
        {showReward && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl animate-in zoom-in-50 duration-500 border border-gray-700">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Fantastic Work! 🎉
                </h3>
                <p className="text-gray-300">You completed a focus session!</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-white">
                    Sessions: {timerData.completedSessions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl font-bold text-white">Focus Timer</h1>
            </div>
          </div>

          {/* Main Timer Card */}
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-gray-700/50">
            {/* Progress Ring */}
            <div className="relative w-64 h-64 mx-auto mb-8">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="#374151"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke={timerData.isBreak ? "#10b981" : "#3b82f6"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * (128 * 0.45)}`}
                  strokeDashoffset={`${
                    2 * Math.PI * (128 * 0.45) * (1 - progress / 100)
                  }`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-mono font-bold text-white mb-2">
                  {formatTime(timerData.timeLeft)}
                </div>
                <div className="text-lg text-gray-300 font-medium">
                  {timerData.isBreak ? "Break Time" : "Focus Time"}
                </div>
              </div>
            </div>

            {/* Motivational Message */}
            {timerData.isRunning && (
              <div className="text-center mb-6">
                <p className="text-lg font-medium text-gray-300 animate-pulse">
                  {motivationMessages[currentMotivation]}
                </p>
              </div>
            )}

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl ${
                  timerData.isRunning
                    ? "bg-red-500 hover:bg-red-600"
                    : timerData.isBreak
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
                disabled={isSettingsOpen}
              >
                {timerData.isRunning ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6 ml-1" />
                )}
              </button>

              <button
                onClick={handleResetTimer}
                className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                disabled={isSettingsOpen}
              >
                <RotateCcw className="w-5 h-5 text-gray-300" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                title="Enter Fullscreen Mode"
              >
                <Maximize className="w-5 h-5 text-gray-300" />
              </button>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-14 h-14 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                disabled={timerData.isRunning}
              >
                <Settings className="w-5 h-5 text-gray-300" />
              </button>
            </div>

            {/* Settings Panel */}
            {isSettingsOpen && !timerData.isRunning && (
              <div className="border-t border-gray-600 pt-6 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Focus Time (10-60 minutes)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateCustomTime(timerData.customTime - 5)
                        }
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold text-white min-w-12 text-center">
                        {timerData.customTime}m
                      </span>
                      <button
                        onClick={() =>
                          updateCustomTime(timerData.customTime + 5)
                        }
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Break Time (1-15 minutes)
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateBreakTime(timerData.breakTime - 1)}
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold text-white min-w-12 text-center">
                        {timerData.breakTime}m
                      </span>
                      <button
                        onClick={() => updateBreakTime(timerData.breakTime + 1)}
                        className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sound Settings */}
                <div className="mt-6 pt-6 border-t border-gray-600">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    Sound Settings
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={timerData.soundEnabled}
                          onChange={(e) =>
                            updateTimerData({ soundEnabled: e.target.checked })
                          }
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-gray-300">Enable Sound</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Notification Sound
                      </label>
                      <select
                        value={timerData.notificationSound}
                        onChange={(e) =>
                          updateTimerData({ notificationSound: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500"
                        disabled={!timerData.soundEnabled}
                      >
                        <option value="bell">🔔 Bell</option>
                        <option value="chime">🎵 Chime</option>
                        <option value="soft">🔊 Soft Tone</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="text-center pt-4 border-t border-gray-600">
              <div className="flex items-center justify-center gap-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    {timerData.completedSessions}
                  </div>
                  <div className="text-sm text-gray-300">Sessions</div>
                </div>

                <div className="flex-1 max-w-xs mx-4">
                  <textarea
                    value={sessionNote}
                    onChange={(e) => setSessionNote(e.target.value)}
                    placeholder="What did you accomplish?"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    maxLength={80}
                    disabled={timerData.isBreak}
                  />
                  <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                    <span>{sessionNote.length}/80</span>
                    {sessionNote.trim() && <FileText className="w-3 h-3" />}
                  </div>
                </div>

                <button
                  onClick={() => setShowSessionDetails(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  <BarChart3 className="w-4 h-4" />
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {!timerData.isRunning && !isSettingsOpen && (
            <div className="text-center mt-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 flex-wrap">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4" />
                  <span>Auto breaks included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>Earn rewards</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Sound notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4" />
                  <span>Fullscreen mode</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden audio for notifications */}
        <audio ref={audioRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NIGq78N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NIGq78N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N2QQAoVXrTp66hVFApGn+DtuGUiBzKO2/3SgT0NI2+98N+STAoUXbPm7qxYFAlCo+Dxu2AaBDWS2vzOdi8FJnPA8N"
            type="audio/wav"
          />
        </audio>

        {/* Session Details Modal */}
        {showSessionDetails && <SessionDetailsModal />}
      </div>
    </Layout>
  );
};

export default FocusPage;
