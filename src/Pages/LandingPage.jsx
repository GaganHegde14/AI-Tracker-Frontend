import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Brain,
  Target,
  CheckCircle,
  Star,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  Clock,
  Workflow,
} from "lucide-react";
import Logo from "../Components/Logo";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI-Powered Task Creation",
      description:
        "Transform your thoughts into structured, actionable tasks with our advanced AI engine.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Prioritization",
      description:
        "Our AI analyzes your goals and automatically prioritizes tasks for maximum productivity.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Progress Analytics",
      description:
        "Gain insights into your productivity patterns with detailed analytics and progress tracking.",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: "Intelligent Assistant",
      description:
        "Chat with your AI assistant for task recommendations and productivity insights.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Tasks Completed",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      number: "2.5K+",
      label: "Active Users",
      icon: <Users className="w-5 h-5" />,
    },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-5 h-5" /> },
    {
      number: "3.2x",
      label: "Productivity Boost",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const benefits = [
    "AI-driven task generation and optimization",
    "Intelligent priority management",
    "Real-time progress tracking",
    "Seamless workflow integration",
    "Advanced analytics and insights",
    "24/7 AI assistant support",
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
      <div className="fixed inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6 flex items-center justify-between">
        <Logo size="w-10 h-10" textSize="text-2xl" />
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-32 text-center">
          <div
            className={`max-w-5xl mx-auto transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* Hero Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">
                The Future of Task Management
              </span>
            </div>

            {/* Hero Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                Productivity
              </span>
              <span className="block text-white">with AI</span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence to revolutionize how
              you manage tasks, set priorities, and achieve your goals with
              unprecedented efficiency.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105"
              >
                Explore Features
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 delay-${
                    index * 200
                  } ${
                    isVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-10 opacity-0"
                  }`}
                >
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex items-center justify-center mb-2 text-purple-400">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-1">{stat.number}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Intelligent Features
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Experience the next generation of task management with
                AI-powered features designed to supercharge your productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 cursor-pointer ${
                    activeFeature === index
                      ? `${feature.bgColor} ${feature.borderColor} border-2 shadow-2xl`
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-6 bg-gradient-to-r ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-6 py-32">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8">
                  Why Choose
                  <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {" "}
                    Progress AI
                  </span>
                  ?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join thousands of professionals who have transformed their
                  productivity with our intelligent task management system.
                </p>

                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-3xl" />
                <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
                      <Zap className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">
                      Ready to Get Started?
                    </h3>
                    <p className="text-gray-300 mb-6">
                      Experience the future of productivity today with our
                      AI-powered platform.
                    </p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                    >
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the AI revolution in productivity. Start managing your
                tasks smarter, not harder, with Progress AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                >
                  Get Started for Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 rounded-full font-semibold text-lg transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <Logo size="w-8 h-8" className="justify-center mb-4" />
            <p className="text-gray-400">
              &copy; 2025 Progress AI. Revolutionizing productivity with
              artificial intelligence.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
