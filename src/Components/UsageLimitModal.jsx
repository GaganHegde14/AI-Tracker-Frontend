import React from "react";
import { Lock, Crown, ArrowRight, X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UsageLimitModal = ({
  isOpen,
  onClose,
  featureType,
  remainingUsage,
  limit,
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/premium");
    onClose();
  };

  if (!isOpen) return null;

  const getFeatureInfo = (type) => {
    switch (type) {
      case "aiTasksCreated":
        return {
          title: "AI Task Creation Limit Reached",
          description:
            "You've reached your daily limit of 2 AI-generated tasks",
          icon: "🎯",
        };
      case "aiTaskEnhanced":
        return {
          title: "AI Task Enhancement Limit Reached",
          description: "You've used both of your daily AI task enhancements",
          icon: "✨",
        };
      case "aiChatPrompts":
        return {
          title: "AI Chat Limit Reached",
          description: "You've used all 5 of your daily AI chat prompts",
          icon: "💬",
        };
      default:
        return {
          title: "Usage Limit Reached",
          description: "You've reached your daily usage limit for this feature",
          icon: "🚫",
        };
    }
  };

  const featureInfo = getFeatureInfo(featureType);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-2xl max-w-3xl w-full backdrop-blur-xl shadow-2xl animate-in fade-in-50 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Limit Info */}
          <div className="p-8 lg:pr-4">
            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-500/20">
                <AlertTriangle className="w-7 h-7 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {featureInfo.title}
                </h2>
                <p className="text-zinc-400 text-sm">
                  Daily usage limit reached
                </p>
              </div>
            </div>

            {/* Feature Description */}
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{featureInfo.icon}</div>
                <div>
                  <p className="text-red-300 font-medium text-sm">
                    Limit Reached
                  </p>
                  <p className="text-zinc-300 text-sm">
                    {featureInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Reset Info */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-300 font-medium text-sm">
                  Reset Information
                </span>
              </div>
              <p className="text-zinc-300 text-sm">
                Your limits reset daily at midnight.
                {remainingUsage > 0 &&
                  ` You have ${remainingUsage} uses remaining today.`}
              </p>
            </div>
          </div>

          {/* Right Side - Premium Upgrade */}
          <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-l border-zinc-700/30 p-8 lg:pl-4">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-zinc-400 text-sm">
                Remove all limits and unlock unlimited access
              </p>
            </div>

            {/* Premium Benefits */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span className="text-zinc-300">
                  Unlimited AI task creation
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span className="text-zinc-300">
                  Unlimited AI task enhancement
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span className="text-zinc-300">Unlimited AI chat prompts</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></span>
                <span className="text-zinc-300">
                  Advanced analytics & insights
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>Get Premium Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 font-medium px-6 py-2.5 rounded-xl transition-all duration-200 border border-zinc-700/50"
              >
                Continue with Free Plan
              </button>
            </div>

            <p className="text-zinc-500 text-xs text-center mt-4">
              🔄 Limits reset at midnight • 💳 Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageLimitModal;
