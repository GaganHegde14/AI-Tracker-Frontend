import React, { useState, useEffect } from "react";
import Layout from "../Components/Layout";
import ComingSoonModal from "../components/ComingSoonModal";
import {
  BarChart,
  PieChart,
  TrendingUp,
  Target,
  Calendar,
  Users,
} from "lucide-react";

const InsightsPage = () => {
  const [showModal, setShowModal] = useState(false);

  // Show modal immediately when page loads
  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>

        {/* Blur overlay when modal is open */}
        <div
          className={`transition-all duration-300 ${
            showModal ? "blur-sm" : ""
          }`}
        >
          {/* Hero Section */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
            <div className="text-center max-w-4xl mx-auto">
              {/* Icon Grid */}
              <div className="grid grid-cols-3 gap-8 mb-12 max-w-lg mx-auto">
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <BarChart className="w-8 h-8 text-purple-400 mx-auto" />
                </div>
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <PieChart className="w-8 h-8 text-blue-400 mx-auto" />
                </div>
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto" />
                </div>
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <Target className="w-8 h-8 text-red-400 mx-auto" />
                </div>
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <Calendar className="w-8 h-8 text-yellow-400 mx-auto" />
                </div>
                <div className="bg-zinc-800/30 border border-zinc-700/50 rounded-2xl p-6 backdrop-blur-sm">
                  <Users className="w-8 h-8 text-indigo-400 mx-auto" />
                </div>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Advanced
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Insights
                </span>
              </h1>

              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                Unlock powerful analytics, detailed reports, and productivity
                insights to supercharge your workflow and achieve your goals
                faster.
              </p>

              {/* Feature Preview Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-zinc-800/20 border border-zinc-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <BarChart className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Performance Analytics
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Track your productivity patterns and optimize your workflow
                  </p>
                </div>

                <div className="bg-zinc-800/20 border border-zinc-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Growth Tracking
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Monitor your progress and celebrate achievements
                  </p>
                </div>

                <div className="bg-zinc-800/20 border border-zinc-700/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Goal Insights
                  </h3>
                  <p className="text-zinc-400 text-sm">
                    Get personalized recommendations to reach your targets
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ComingSoonModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </Layout>
  );
};

export default InsightsPage;
