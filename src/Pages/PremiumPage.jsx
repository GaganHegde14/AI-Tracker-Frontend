import React, { useState } from "react";
import Layout from "../Components/Layout";
import {
  Crown,
  Sparkles,
  Zap,
  CheckCircle,
  ArrowRight,
  Lock,
  Infinity,
  BarChart3,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Infinity,
      title: "Unlimited AI Task Creation",
      description:
        "Create unlimited tasks using AI assistance without daily limits",
    },
    {
      icon: Sparkles,
      title: "Unlimited AI Chat",
      description:
        "Chat with AI assistant without the 5 prompts per day restriction",
    },
    {
      icon: Zap,
      title: "Advanced AI Task Enhancer",
      description:
        "Use AI task enhancer unlimited times per day instead of just 2",
    },
    {
      icon: Users,
      title: "Friends Leaderboard & Social Features",
      description:
        "Add friends, compare progress, and compete on private leaderboards with detailed friend analytics",
    },
    {
      icon: BarChart3,
      title: "Unlimited Focus Session History",
      description:
        "Track all your focus sessions with unlimited history and detailed analytics",
    },
    {
      icon: Clock,
      title: "Advanced Focus Analytics",
      description:
        "Get detailed insights on your productivity patterns and focus trends over time",
    },
    {
      icon: CheckCircle,
      title: "Priority Support",
      description: "Get priority customer support and faster response times",
    },
    {
      icon: Crown,
      title: "Advanced Analytics",
      description: "Access detailed insights and productivity analytics",
    },
    {
      icon: Lock,
      title: "Enhanced Security",
      description: "Advanced security features and data protection",
    },
  ];

  const plans = [
    {
      id: "monthly",
      name: "Monthly Premium",
      price: "₹799",
      period: "/month",
      description: "Perfect for getting started with premium features",
      popular: false,
    },
    {
      id: "yearly",
      name: "Yearly Premium",
      price: "₹7,999",
      period: "/year",
      description: "Best value - Save 17% with annual billing",
      popular: true,
      savings: "Save ₹1,589",
    },
  ];

  const faqs = [
    {
      question: "What's included in the Friends Leaderboard feature?",
      answer:
        "With the Friends Leaderboard, you can add friends by email, compare your task completion and focus hours, compete on private leaderboards, and track detailed friend analytics. This feature is exclusive to Premium users.",
    },
    {
      question: "How does the unlimited AI assistance work?",
      answer:
        "Premium users get unlimited access to AI task creation, AI chat assistance, and the AI task enhancer without any daily limits. Free users are limited to 5 AI prompts per day and 2 task enhancer uses.",
    },
    {
      question: "Can I access my focus session history from previous months?",
      answer:
        "Yes! Premium users get unlimited focus session history with detailed analytics. Free users can only view sessions from the last 3 days.",
    },
    {
      question: "What happens if I cancel my subscription?",
      answer:
        "You can cancel anytime and will retain Premium features until the end of your billing period. After that, your account will revert to the free tier with all the standard limitations.",
    },
    {
      question: "Is there a money-back guarantee?",
      answer:
        "Yes, we offer a 30-day money-back guarantee for all Premium subscriptions. If you're not satisfied, contact our support team for a full refund.",
    },
    {
      question: "How does the friend comparison feature work?",
      answer:
        "Once you add friends by their email, you'll see a private leaderboard showing how your productivity compares. You can track both task completion and focus hours, creating healthy competition and motivation.",
    },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-zinc-900 to-blue-900/20">
        <div className="max-w-4xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-purple-300">
                Upgrade to Premium
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Unlock Your Full
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Potential
              </span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Supercharge your productivity with unlimited AI features and
              advanced tools designed for power users.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 hover:border-purple-500/30 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Current Limitations */}
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-300 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Current Free Plan Limitations
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-red-300">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                Only 2 AI task creations per day
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                Limited to 5 AI chat prompts daily
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                Only 2 AI task enhancements per day
              </div>
              <div className="flex items-center gap-2 text-red-300">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                No access to advanced analytics
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-zinc-900/50 border rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? "border-purple-500 ring-1 ring-purple-500/20"
                    : "border-zinc-800 hover:border-zinc-700"
                } ${plan.popular ? "ring-1 ring-purple-500/30" : ""}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                {plan.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500/10 text-green-400 text-xs font-medium px-2 py-1 rounded border border-green-500/20">
                      {plan.savings}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      selectedPlan === plan.id
                        ? "border-purple-500 bg-purple-500"
                        : "border-zinc-600"
                    }`}
                  >
                    {selectedPlan === plan.id && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                </div>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-zinc-400">{plan.period}</span>
                </div>
                <p className="text-zinc-400 text-sm">{plan.description}</p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button className="group bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 mx-auto">
              <Crown className="w-5 h-5" />
              <span>Upgrade to Premium Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-zinc-500 text-sm mt-4">
              30-day money back guarantee • Cancel anytime • Secure payment
            </p>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-700/30 transition-colors"
                  >
                    <span className="font-semibold text-white pr-4">
                      {faq.question}
                    </span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-zinc-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <div className="flex items-center justify-center gap-8 text-zinc-500 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PremiumPage;
