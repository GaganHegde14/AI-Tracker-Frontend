import React from "react";
import { Lock, Crown, ArrowRight, X, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoonModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/premium");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900/95 border border-zinc-700/50 rounded-2xl max-w-4xl w-full backdrop-blur-xl shadow-2xl animate-in fade-in-50 zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid lg:grid-cols-2 gap-0">
          {/* Left Side - Main Content */}
          <div className="p-8 lg:pr-4">
            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-purple-500/20">
                <Lock className="w-7 h-7 text-purple-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Premium Feature
                </h2>
                <p className="text-zinc-400 text-sm">
                  Advanced Insights Dashboard
                </p>
              </div>
            </div>

            {/* Development Status */}
            <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-300 font-medium text-sm">
                  Under Development
                </span>
              </div>
              <p className="text-zinc-300 text-sm">
                This premium analytics dashboard is being crafted with advanced
                features and will be available soon for Premium subscribers.
              </p>
            </div>

            {/* Free Plan Limits */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
              <h4 className="text-red-300 font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                Current Free Plan Limitations
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-red-300">• 2 AI task creations daily</div>
                <div className="text-red-300">• 5 AI chat prompts daily</div>
                <div className="text-red-300">• 2 AI enhancements daily</div>
                <div className="text-red-300">• No advanced analytics</div>
              </div>
            </div>
          </div>

          {/* Right Side - Premium Features */}
          <div className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-l border-zinc-700/30 p-8 lg:pl-4">
            <div className="text-center mb-6">
              <Crown className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                Upgrade to Premium
              </h3>
              <p className="text-zinc-400 text-sm">
                Unlock unlimited AI features and advanced analytics
              </p>
            </div>

            {/* Premium Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-zinc-300">
                  Unlimited AI task creation & enhancement
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="text-zinc-300">
                  Unlimited AI chat conversations
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-zinc-300">
                  Advanced productivity analytics
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-zinc-300">
                  Custom reporting dashboards
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <span className="text-zinc-300">
                  Priority support & early access
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
              🔄 Limits reset daily • 💳 Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
