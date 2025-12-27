import React, { useState, useEffect } from "react";
import Layout from "../Components/Layout";
import {
  Camera,
  User,
  Mail,
  Lock,
  Shield,
  Trash2,
  Save,
  LogOut,
  Plus,
  Edit3,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
  Quote,
  Info,
  Trophy,
  Star,
  Crown,
  Flame,
  X,
} from "lucide-react";
import ConfirmationModal from "../Components/ConfirmationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTask } from "../context/TaskContext";

// Base URL for API calls
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";
import { useNotification } from "../context/NotificationContext";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const { info, setInfo, status } = useTask();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [showLeagueModal, setShowLeagueModal] = useState(false);
  const [userLevel, setUserLevel] = useState(null);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  // Level system configuration
  const levels = [
    {
      level: 1,
      name: "Rookie",
      icon: Target,
      minTasks: 100,
      maxTasks: 199,
      color: "text-gray-400",
      bgColor: "bg-gray-500/20",
    },
    {
      level: 2,
      name: "Starter",
      icon: Zap,
      minTasks: 200,
      maxTasks: 299,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      level: 3,
      name: "Rising",
      icon: TrendingUp,
      minTasks: 300,
      maxTasks: 499,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      level: 4,
      name: "Skilled",
      icon: Star,
      minTasks: 500,
      maxTasks: 749,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      level: 5,
      name: "Expert",
      icon: Trophy,
      minTasks: 750,
      maxTasks: 999,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    {
      level: 6,
      name: "Master",
      icon: Crown,
      minTasks: 1000,
      maxTasks: 1499,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    {
      level: 7,
      name: "Elite",
      icon: Flame,
      minTasks: 1500,
      maxTasks: 2499,
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
    },
    {
      level: 8,
      name: "Champion",
      icon: Crown,
      minTasks: 2500,
      maxTasks: 4999,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    {
      level: 9,
      name: "Legend",
      icon: Sparkles,
      minTasks: 5000,
      maxTasks: 9999,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
    },
    {
      level: 10,
      name: "Mythic",
      icon: Crown,
      minTasks: 10000,
      maxTasks: Infinity,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
    },
  ];

  // Calculate current level based on tasks completed
  const getCurrentLevel = (tasks) => {
    if (tasks < 100) {
      return {
        level: 0,
        name: "Beginner",
        icon: Target,
        minTasks: 0,
        maxTasks: 99,
        color: "text-slate-400",
        bgColor: "bg-slate-500/20",
      };
    }
    return (
      levels.find(
        (level) => tasks >= level.minTasks && tasks <= level.maxTasks
      ) || levels[0]
    );
  };

  // Get progress to next level
  const getLevelProgress = (tasks, currentLevel) => {
    if (currentLevel.level === 10) return { progress: 100, tasksToNext: 0 };

    const tasksInCurrentLevel = tasks - currentLevel.minTasks;
    const tasksNeededForLevel =
      currentLevel.maxTasks - currentLevel.minTasks + 1;
    const progress = Math.min(
      (tasksInCurrentLevel / tasksNeededForLevel) * 100,
      100
    );
    const tasksToNext = currentLevel.maxTasks + 1 - tasks;

    return { progress, tasksToNext: Math.max(tasksToNext, 0) };
  };

  useEffect(() => {
    // Load user level data from API on component mount
    fetchUserLevel();
  }, []);

  useEffect(() => {
    // Update level when completed tasks change from TaskContext
    if (status?.completeTask !== undefined) {
      const completedFromContext = status.completeTask;
      if (completedFromContext !== tasksCompleted) {
        updateTasksCompleted(completedFromContext);
      }
    }
  }, [status?.completeTask]);

  useEffect(() => {
    // Update user level when tasks completed changes
    if (tasksCompleted !== undefined) {
      const level = getCurrentLevel(tasksCompleted);
      setUserLevel(level);
    }
  }, [tasksCompleted]);

  // Fetch user level data
  const fetchUserLevel = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/level`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setTasksCompleted(response.data.data.tasksCompleted);
        setUserLevel(getCurrentLevel(response.data.data.tasksCompleted));
      }
    } catch (error) {
      console.error("Error fetching user level:", error);
      // Set default values if API call fails
      setTasksCompleted(0);
      setUserLevel(levels[0]);
    }
  };

  // Update tasks completed count and save to database
  const updateTasksCompleted = async (newCount) => {
    try {
      const level = getCurrentLevel(newCount);
      const token = localStorage.getItem("token");

      await axios.put(
        `${API_BASE_URL}/level`,
        {
          level: level.level,
          tasksCompleted: newCount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTasksCompleted(newCount);
      setUserLevel(level);
    } catch (error) {
      console.error("Error updating user level:", error);
      showNotification("Failed to update level data", "error");
    }
  };
  const [motivationalQuote, setMotivationalQuote] = useState(
    () =>
      localStorage.getItem("userMotivationalQuote") ||
      "Every small step brings you closer to your goals. Keep moving forward! 🚀"
  );
  const [tempQuote, setTempQuote] = useState(motivationalQuote);
  const fileInputRef = React.useRef(null);

  // Predefined inspirational quotes for random generation
  const inspirationalQuotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts. 💪",
    "The future belongs to those who believe in the beauty of their dreams. ✨",
    "Progress, not perfection. Every step forward matters. 🎯",
    "Your only limit is your mind. Think bigger, achieve more. 🧠",
    "Great things never come from comfort zones. Push your boundaries! 🚀",
    "The best time to plant a tree was 20 years ago. The second best time is now. 🌱",
    "Don't watch the clock; do what it does. Keep going. ⏰",
    "Success is the sum of small efforts repeated day in and day out. 📈",
    "Believe you can and you're halfway there. The journey begins with belief. 🌟",
    "Excellence is never an accident. It's the result of focus and determination. 🎖️",
  ];

  // Save quote to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userMotivationalQuote", motivationalQuote);
  }, [motivationalQuote]);

  const generateRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    const newQuote = inspirationalQuotes[randomIndex];
    setMotivationalQuote(newQuote);
    setTempQuote(newQuote);
  };

  const saveQuote = () => {
    setMotivationalQuote(tempQuote);
    setIsEditingQuote(false);
    showNotification("Motivational quote updated! 🎉", "success");
  };

  const cancelEditQuote = () => {
    setTempQuote(motivationalQuote);
    setIsEditingQuote(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleProfilePicUpdate(file);
    }
  };

  const handleProfilePicUpdate = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/profilePic`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200) {
        showNotification("Profile picture updated successfully", "success");
        if (setInfo && res.data.data) {
          setInfo((prev) => ({ ...prev, profilePic: res.data.data }));
        }
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile picture";
      showNotification(errorMessage, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const [users, setUsers] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsers((prev) => ({ ...prev, [name]: value }));
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .put(
          `${import.meta.env.VITE_BACKEND_URL.replace(
            /\/$/,
            ""
          )}/updatePassword`,
          users,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => {
          if (res.status === 200) {
            showNotification("Password Updated Successfully", "success");
            setTimeout(() => {
              navigate("/login");
            }, 1000);
          }
        })
        .catch((err) => {
          const error = err.response.data.message || "Password Updated Failed";
          showNotification(error, "error");
        });
    } catch (err) {
      const error = err.response.data.message || "Password Updated Failed";
      showNotification(error, "error");
    }
  };

  const handleLogout = () => {
    showNotification("Logout Successfully", "success");
    setTimeout(() => {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("authChange")); // Notify App component
      navigate("/login");
    }, 1000);
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "")}/deleteAccount`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        showNotification("Account Deleted Successfully", "success");
        setTimeout(() => {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("authChange")); // Notify App component
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      const error = err.response.data.message || "Account Deleted Failed";
      showNotification(error, "error");
    }
  };

  return (
    <Layout>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="min-h-screen bg-gray-900 text-white relative">
        {/* Simple Background */}
        <div className="fixed inset-0 bg-gray-900" />

        <div className="relative z-10 w-full px-4 py-6">
          {/* Header */}
          <div className="text-center space-y-3 pt-6 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Account Configuration
            </h1>
            <p className="text-gray-400 text-sm">
              Configure your account details and personalize your workspace.
            </p>
          </div>

          {/* Single Full-Width Card */}
          <div className="glass-card rounded-2xl p-8 mx-4">
            {/* Profile Header Section */}
            <div className="space-y-4">
              {/* Profile Avatar Card */}
              <div className="glass-card rounded-2xl p-6 text-center space-y-4 relative">
                {/* Simplified card without hover effects */}

                <div className="relative">
                  <div className="relative cursor-pointer mx-auto w-fit">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-800 relative">
                      <img
                        src={
                          info?.profilePic ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${
                            info?.name || "User"
                          }`
                        }
                        alt="Profile"
                        className={`w-full h-full object-cover ${
                          isUploading ? "opacity-50" : ""
                        }`}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>

                    {/* Simple Upload Button */}
                    <button
                      className="absolute -bottom-1 -right-1 p-2 bg-gray-700 rounded-full border-2 border-gray-600 hover:bg-gray-600 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  <div className="space-y-2 mt-6">
                    <h2 className="text-2xl font-bold text-white">
                      {info?.name || "Progress User"}
                    </h2>
                    <p className="text-purple-400 font-medium">
                      {info?.email || "user@progressai.com"}
                    </p>

                    {/* Level Badge */}
                    {userLevel && (
                      <div
                        className={`inline-flex items-center space-x-2 px-3 py-1 ${userLevel.bgColor} border border-current/30 rounded-full text-sm cursor-pointer hover:scale-105 transition-transform`}
                        onClick={() => setShowLeagueModal(true)}
                      >
                        <userLevel.icon
                          className={`w-3 h-3 ${userLevel.color}`}
                        />
                        <span className={`${userLevel.color} font-medium`}>
                          Level {userLevel.level} - {userLevel.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white">
                        {tasksCompleted}
                      </div>
                      <div className="text-xs text-gray-400">
                        Tasks Completed
                      </div>
                    </div>
                    <div className="text-center relative">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xl font-bold text-purple-400">
                          {userLevel ? `Level ${userLevel.level}` : "Level 1"}
                        </span>
                        <button
                          onClick={() => setShowLeagueModal(true)}
                          className="p-1 hover:bg-white/10 rounded-full transition-colors"
                          title="View League System"
                        >
                          <Info className="w-3 h-3 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">Current Level</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational Quote Card */}
              <div className="glass-card rounded-3xl p-6 relative">
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Quote className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-semibold text-white">
                        Daily Motivation
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={generateRandomQuote}
                        className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 border border-white/10 hover:border-cyan-500/30 transition-all group"
                        title="Generate new quote"
                      >
                        <RefreshCw className="w-4 h-4 text-cyan-400 group-hover:rotate-180 transition-transform duration-500" />
                      </button>
                      <button
                        onClick={() => setIsEditingQuote(true)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 transition-all"
                        title="Edit quote"
                      >
                        <Edit3 className="w-4 h-4 text-purple-400" />
                      </button>
                    </div>
                  </div>

                  {isEditingQuote ? (
                    <div className="space-y-4">
                      <textarea
                        value={tempQuote}
                        onChange={(e) => setTempQuote(e.target.value)}
                        className="w-full bg-black/20 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 resize-none h-24 text-sm"
                        placeholder="Enter your motivational quote..."
                        maxLength={200}
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">
                          {tempQuote.length}/200
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={cancelEditQuote}
                            className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={saveQuote}
                            className="px-4 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition-colors"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <p className="text-gray-300 leading-relaxed italic text-center">
                        "{motivationalQuote}"
                      </p>
                      <div className="absolute -top-2 -left-2 text-cyan-400/30 text-4xl font-serif">
                        "
                      </div>
                      <div className="absolute -bottom-2 -right-2 text-purple-400/30 text-4xl font-serif rotate-180">
                        "
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Settings */}
            <div className="space-y-4">
              {/* User Details Card */}
              <div className="glass-card rounded-2xl p-6 space-y-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                    <User className="w-4 h-4 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    User Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Display Name
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={info?.name || ""}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Contact Email
                    </label>
                    <div className="relative">
                      <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={info?.email || ""}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none cursor-not-allowed opacity-60"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>
                      Your contact email cannot be modified for security reasons
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy & Access Card */}
              <div className="glass-card rounded-2xl p-6 space-y-4 mt-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30">
                    <Lock className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Privacy & Access
                  </h3>
                </div>

                <form onSubmit={handelSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      Existing Password
                    </label>
                    <div className="relative">
                      <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        name="currentPassword"
                        value={users.currentPassword}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                        placeholder="Enter existing password"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Updated Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          name="newPassword"
                          value={users.newPassword}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                          placeholder="Enter updated password"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={users.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                          placeholder="Confirm updated password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 rounded-lg transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full p-4 rounded-2xl glass-card border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center space-x-2 text-red-400 hover:text-red-300 group"
              >
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <span className="font-medium">Exit Account</span>
              </button>

              {/* Account Settings - Hidden Danger Zone */}
              <div className="mt-8">
                <button
                  onClick={() => setShowDangerZone(!showDangerZone)}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors underline"
                >
                  Advanced Options
                </button>

                {showDangerZone && (
                  <div className="mt-4 p-4 bg-black/20 border border-gray-800 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                          Account Deletion
                        </h4>
                        <p className="text-xs text-gray-500 mb-3">
                          This will permanently delete your account and all
                          data.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Type 'DELETE' to confirm"
                          value={confirmText}
                          onChange={(e) => setConfirmText(e.target.value)}
                          className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-red-500/50"
                        />
                        <button
                          onClick={() =>
                            confirmText === "DELETE" &&
                            setIsDeleteModalOpen(true)
                          }
                          disabled={confirmText !== "DELETE"}
                          className="text-xs px-3 py-1 text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        >
                          Remove Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onConfirm={handleDeleteAccount}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Remove Account"
          message="Are you certain you want to remove this account? This action is irreversible and all your information will be permanently erased."
        />

        {/* League System Modal */}
        {showLeagueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">
                    League System
                  </h2>
                </div>
                <button
                  onClick={() => setShowLeagueModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="text-center mb-6">
                  <p className="text-gray-300 text-sm">
                    Complete tasks to level up and unlock new ranks!
                  </p>
                  {userLevel && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <userLevel.icon
                          className={`w-5 h-5 ${userLevel.color}`}
                        />
                        <span
                          className={`text-lg font-bold ${userLevel.color}`}
                        >
                          Level {userLevel.level} - {userLevel.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">
                        Tasks Completed: {tasksCompleted}
                      </p>
                      {userLevel.level < 10 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progress to Level {userLevel.level + 1}</span>
                            <span>
                              {
                                getLevelProgress(tasksCompleted, userLevel)
                                  .tasksToNext
                              }{" "}
                              tasks to go
                            </span>
                          </div>
                          <div className="w-full bg-gray-800 rounded-full h-2">
                            <div
                              className="bg-linear-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000"
                              style={{
                                width: `${
                                  getLevelProgress(tasksCompleted, userLevel)
                                    .progress
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {levels.map((level, index) => {
                    const isCurrentLevel = userLevel?.level === level.level;
                    const isUnlocked = tasksCompleted >= level.minTasks;

                    return (
                      <div
                        key={level.level}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isCurrentLevel
                            ? "bg-white/10 border-white/30"
                            : isUnlocked
                            ? "bg-white/5 border-white/10 hover:bg-white/10"
                            : "bg-gray-800/50 border-gray-700/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-lg ${level.bgColor} border border-current/30`}
                          >
                            <level.icon className={`w-5 h-5 ${level.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`font-semibold ${
                                  isUnlocked ? "text-white" : "text-gray-500"
                                }`}
                              >
                                Level {level.level} - {level.name}
                              </h3>
                              {isCurrentLevel && (
                                <span className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-200">
                                  Current
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm ${
                                isUnlocked ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {level.maxTasks === Infinity
                                ? `${level.minTasks}+ tasks`
                                : `${level.minTasks} - ${level.maxTasks} tasks`}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {isUnlocked ? (
                            <div className="flex items-center space-x-1">
                              <Sparkles className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-green-400 font-medium">
                                Unlocked
                              </span>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500">
                              {level.minTasks - tasksCompleted} tasks needed
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                  <h4 className="font-semibold text-white mb-2">
                    How it works:
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>
                      • Complete tasks to earn progress toward the next level
                    </li>
                    <li>• Each level requires more tasks to unlock</li>
                    <li>
                      • Higher levels come with prestigious titles and badges
                    </li>
                    <li>• Your progress is automatically saved</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
