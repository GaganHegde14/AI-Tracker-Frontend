import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Trophy,
  Medal,
  Users,
  Star,
  UserPlus,
  Mail,
  Search,
  Crown,
  Target,
  Clock,
  Lock,
} from "lucide-react";
import Layout from "../Components/Layout";
import { usePremium } from "../context/PremiumContext";
import { useTask } from "../context/TaskContext";

const LeaderboardPage = () => {
  const [leaderboardType, setLeaderboardType] = useState("tasks");
  const [friendEmail, setFriendEmail] = useState("");
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    tasksCompleted: 0,
    focusHours: 0,
    globalRank: 0,
  });

  const { isPremium } = usePremium();
  const { info } = useTask();
  const token = localStorage.getItem("token");

  // Fetch global leaderboard data
  const fetchGlobalLeaderboard = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL.replace(
          /\/$/,
          ""
        )}/leaderboard/global`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setGlobalLeaderboard(response.data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching global leaderboard:", error);
      // Fallback to empty array if API fails
      setGlobalLeaderboard([]);
    }
  };

  // Fetch friends leaderboard data
  const fetchFriendsLeaderboard = async () => {
    if (!isPremium) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL.replace(
          /\/$/,
          ""
        )}/leaderboard/friends`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setFriendsLeaderboard(response.data.leaderboard);
        setFriends(response.data.friends || []);
      }
    } catch (error) {
      console.error("Error fetching friends leaderboard:", error);
      setFriendsLeaderboard([]);
    }
  };

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL.replace(
          /\/$/,
          ""
        )}/leaderboard/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUserStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Use fallback stats from context or default values
      setUserStats({
        tasksCompleted: 0,
        focusHours: 0,
        globalRank: 0,
      });
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        setLoading(true);
        await Promise.all([
          fetchGlobalLeaderboard(),
          fetchUserStats(),
          isPremium && fetchFriendsLeaderboard(),
        ]);
        setLoading(false);
      };

      fetchData();
    }
  }, [token, isPremium]);

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-400">
            #{rank}
          </span>
        );
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (friendEmail.trim()) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL.replace(
            /\/$/,
            ""
          )}/leaderboard/addFriend`,
          { email: friendEmail },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          // Refresh friends leaderboard
          await fetchFriendsLeaderboard();
          setFriendEmail("");
          setShowAddFriend(false);
        } else {
          console.error("Failed to add friend:", response.data.message);
        }
      } catch (error) {
        console.error("Error adding friend:", error);
      }
    }
  };

  // Helper function to get user avatar initials
  const getAvatarInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper function to check if user is current user
  const isCurrentUser = (userId) => {
    return userId === info?._id;
  };
  const LeaderboardCard = ({ user, isCompact = true }) => (
    <div
      className={`bg-gray-800/30 backdrop-blur-sm rounded-lg p-3 border border-gray-700/30 transition-all duration-200 hover:bg-gray-800/50 ${
        isCurrentUser(user._id) ? "ring-1 ring-blue-500/50" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {user.rank <= 3 ? (
              getRankIcon(user.rank)
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-400">
                #{user.rank}
              </span>
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                isCurrentUser(user._id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-200"
              }`}
            >
              {getAvatarInitials(user.name)}
            </div>
          </div>
          <div>
            <h3
              className={`font-medium text-sm ${
                isCurrentUser(user._id) ? "text-blue-400" : "text-white"
              }`}
            >
              {isCurrentUser(user._id) ? "You" : user.name}
            </h3>
          </div>
        </div>

        <div className="text-right">
          {leaderboardType === "tasks" ? (
            <div>
              <div className="text-lg font-bold text-white">
                {user.tasksCompleted || 0}
              </div>
              <div className="text-xs text-gray-400">Tasks</div>
            </div>
          ) : (
            <div>
              <div className="text-lg font-bold text-white">
                {user.focusHours || 0}h
              </div>
              <div className="text-xs text-gray-400">Hours</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 mb-2">
                <Trophy className="w-7 h-7 text-yellow-400" />
                <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
              </div>
              <p className="text-gray-400 text-sm">
                Compete with users worldwide and compare with friends!
              </p>
            </div>

            {/* Leaderboard Type Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1 border border-gray-700/50">
                <button
                  onClick={() => setLeaderboardType("tasks")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    leaderboardType === "tasks"
                      ? "bg-green-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Target className="w-4 h-4 inline mr-1" />
                  Tasks
                </button>
                <button
                  onClick={() => setLeaderboardType("focus")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    leaderboardType === "focus"
                      ? "bg-purple-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Clock className="w-4 h-4 inline mr-1" />
                  Focus Hours
                </button>
              </div>
            </div>

            {/* Leaderboards Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Global Leaderboard */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Global Rankings
                  </h2>
                  <div className="space-y-2">
                    {globalLeaderboard.length > 0 ? (
                      globalLeaderboard
                        .sort((a, b) => {
                          if (leaderboardType === "tasks") {
                            return (
                              (b.tasksCompleted || 0) - (a.tasksCompleted || 0)
                            );
                          } else {
                            return (b.focusHours || 0) - (a.focusHours || 0);
                          }
                        })
                        .slice(0, 8)
                        .map((user, index) => (
                          <LeaderboardCard
                            key={user._id}
                            user={{ ...user, rank: index + 1 }}
                          />
                        ))
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-400">
                          No leaderboard data available
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Friends Leaderboard */}
                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 relative">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    Friends Rankings
                    {!isPremium && <Lock className="w-4 h-4 text-orange-400" />}
                  </h2>

                  {!isPremium ? (
                    <div className="text-center py-8">
                      <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4 mb-4">
                        <Lock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                        <h3 className="text-lg font-semibold text-orange-400 mb-2">
                          Premium Feature
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          Unlock friends leaderboard to add friends and compare
                          your progress!
                        </p>
                        <button
                          onClick={() => (window.location.href = "/premium")}
                          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm transition-colors"
                        >
                          Upgrade to Premium
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Add Friend Button */}
                      <div className="mb-4">
                        <button
                          onClick={() => setShowAddFriend(!showAddFriend)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Friend
                        </button>

                        {showAddFriend && (
                          <form onSubmit={handleAddFriend} className="mt-3">
                            <div className="flex gap-2">
                              <div className="flex-1 relative">
                                <input
                                  type="email"
                                  value={friendEmail}
                                  onChange={(e) =>
                                    setFriendEmail(e.target.value)
                                  }
                                  placeholder="friend@example.com"
                                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                              >
                                Add
                              </button>
                            </div>
                          </form>
                        )}
                      </div>

                      {/* Friends List */}
                      {friendsLeaderboard.length > 0 ? (
                        <div className="space-y-2">
                          {friendsLeaderboard
                            .sort((a, b) => {
                              if (leaderboardType === "tasks") {
                                return (
                                  (b.tasksCompleted || 0) -
                                  (a.tasksCompleted || 0)
                                );
                              } else {
                                return (
                                  (b.focusHours || 0) - (a.focusHours || 0)
                                );
                              }
                            })
                            .map((user, index) => (
                              <LeaderboardCard
                                key={user._id}
                                user={{ ...user, rank: index + 1 }}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Users className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                          <h3 className="text-lg font-semibold text-gray-300 mb-1">
                            No Friends Yet
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Add friends to compare progress!
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Personal Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 text-center">
                <Target className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">
                  {userStats.tasksCompleted}
                </div>
                <div className="text-xs text-gray-400">Total Tasks</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 text-center">
                <Clock className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">
                  {userStats.focusHours}h
                </div>
                <div className="text-xs text-gray-400">Focus Time</div>
              </div>
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 text-center">
                <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                <div className="text-xl font-bold text-white">
                  {userStats.globalRank > 0 ? `#${userStats.globalRank}` : "--"}
                </div>
                <div className="text-xs text-gray-400">Global Rank</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
