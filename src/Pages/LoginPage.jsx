import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Logo from "../Components/Logo";
import SuccessAnimation from "../Components/SuccessAnimation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckSquare,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  BarChart3,
  Users,
  Clock,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear login error when user starts typing
    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError(""); // Clear any previous login errors

    try {
      const res = await api.post("/login", formData);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);

        // Dispatch custom event to notify App component of auth change
        window.dispatchEvent(new Event("authChange"));

        setShowSuccess(true);
      }
    } catch (error) {
      console.log("Login error:", error);

      const errorData = error.response?.data;
      let errorMessage = "Login failed. Please check your credentials.";

      // Handle specific error types
      if (errorData?.type === "email_not_verified") {
        errorMessage = "Please verify your email address before logging in.";

        // Redirect to email verification if userId is provided
        if (errorData?.userId) {
          setTimeout(() => {
            navigate("/verify-email", {
              state: {
                userId: errorData.userId,
                email: formData.email,
                userName: "User", // We don't have the name from login
                fromLogin: true,
              },
            });
          }, 2000);
        }
      } else if (errorData?.type === "user_not_found") {
        errorMessage = "No account found with this email address.";
      } else if (errorData?.type === "invalid_password") {
        errorMessage = "Incorrect password. Please try again.";
      } else {
        errorMessage = errorData?.message || errorMessage;
      }

      setLoginError(errorMessage);

      // Don't clear form data - keep credentials intact
      console.log("Error set, form data preserved");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <SuccessAnimation
        show={showSuccess}
        message="Welcome back! Loading your dashboard..."
        onComplete={handleSuccessComplete}
      />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="fixed inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Floating Task Management Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${5 + (i % 3)}s`,
              }}
            >
              {i % 6 === 0 && (
                <CheckSquare className="w-4 h-4 text-purple-400" />
              )}
              {i % 6 === 1 && <Target className="w-5 h-5 text-blue-400" />}
              {i % 6 === 2 && <BarChart3 className="w-4 h-4 text-cyan-400" />}
              {i % 6 === 3 && <Clock className="w-4 h-4 text-pink-400" />}
              {i % 6 === 4 && <Users className="w-5 h-5 text-green-400" />}
              {i % 6 === 5 && <Sparkles className="w-4 h-4 text-yellow-400" />}
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
            <div
              className={`w-full max-w-md transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-8 lg:hidden">
                  <Logo size="w-10 h-10" className="justify-center mb-4" />
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                  <p className="text-gray-400">
                    Sign in to continue to Progress AI
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-red-400 text-sm animate-shake">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          formErrors.password
                            ? "border-red-500"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-red-400 text-sm animate-shake">
                        {formErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Remember me and Forgot password */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-gray-300">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Login Error Display */}
                  {loginError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-red-400 text-sm font-medium animate-shake">
                        {loginError}
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side - Stats & Features */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              <Logo size="w-12 h-12" textSize="text-3xl" />

              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Welcome Back to
                  <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Progress AI
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Continue your journey towards ultimate productivity. Your
                  AI-powered workspace is waiting.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: CheckSquare,
                    label: "Tasks Completed",
                    value: "2.5K+",
                  },
                  { icon: TrendingUp, label: "Productivity Up", value: "3.2x" },
                  { icon: Users, label: "Active Users", value: "10K+" },
                  { icon: Zap, label: "AI Insights", value: "∞" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center transition-all duration-700 delay-${
                      index * 200
                    } hover:border-purple-500/30 hover:scale-105 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-5 opacity-0"
                    }`}
                  >
                    <stat.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent achievements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Your Progress Today
                </h3>
                {[
                  { text: "AI generated 12 optimized tasks", progress: 85 },
                  { text: "Completed 8 priority items", progress: 92 },
                  { text: "Productivity increased by 15%", progress: 78 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-700 delay-${
                      (index + 4) * 200
                    } ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-5 opacity-0"
                    }`}
                  >
                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                      <span>{item.text}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? `${item.progress}%` : "0%",
                          transitionDelay: `${(index + 4) * 200 + 500}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            75% {
              transform: translateX(5px);
            }
          }
          .animate-float {
            animation: float 5s ease-in-out infinite;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default LoginPage;
