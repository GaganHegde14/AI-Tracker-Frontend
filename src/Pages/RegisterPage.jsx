import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import api, { wakeUpServer } from "../services/api";
import Logo from "../Components/Logo";
import PasswordStrengthIndicator from "../Components/PasswordStrengthIndicator";
import SuccessAnimation from "../Components/SuccessAnimation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Target,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { confirmPassword, ...submitData } = formData;

      // First, try to wake up the server if it's sleeping (Render free tier)
      showNotification("Creating your account...", "info");

      let response;
      let retryCount = 0;
      const maxRetries = 2;

      while (retryCount <= maxRetries) {
        try {
          if (retryCount > 0) {
            showNotification(`Retrying... (attempt ${retryCount + 1})`, "info");
            // Wait a moment before retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }

          response = await api.post("/register", submitData);
          break; // Success, exit retry loop
        } catch (error) {
          retryCount++;

          if (error.code === "ECONNABORTED" && retryCount <= maxRetries) {
            showNotification("Server is starting up, retrying...", "info");
            // Try to wake up server on timeout
            await wakeUpServer();
            continue; // Retry
          } else {
            throw error; // Re-throw if it's not a timeout or we've exceeded retries
          }
        }
      }

      if (response.status === 200) {
        const { userId, email, type, token, user } = response.data;

        if (type === "otp_sent" && userId) {
          // Redirect to email verification page
          showNotification(
            "Registration successful! Check your email for verification code.",
            "success"
          );

          navigate("/verify-email", {
            state: {
              userId,
              email,
              userName: formData.name,
            },
          });
        } else if (type === "verification_success" && token) {
          // Direct login after OTP verification
          localStorage.setItem("token", token);
          window.dispatchEvent(new Event("authChange"));
          
          showNotification(
            "Email verified successfully! Welcome to AI Task Manager!",
            "success"
          );
          
          navigate("/dashboard");
        } else if (type === "registration_complete_with_login" && token) {
          // Automatic login after registration (no OTP)
          localStorage.setItem("token", token);
          window.dispatchEvent(new Event("authChange"));
          
          showNotification(
            "Registration successful! Welcome to AI Task Manager!",
            "success"
          );
          
          navigate("/dashboard");
        } else {
          // Fallback for old registration flow
          if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            window.dispatchEvent(new Event("authChange"));
            setShowSuccess(true);
          }
        }
      }
    } catch (error) {
      console.error("Registration error:", error);

      const errorData = error.response?.data;
      let errorMessage = "Registration failed. Please try again.";

      // Handle specific error types
      if (errorData?.type === "domain_not_allowed") {
        errorMessage =
          errorData.message ||
          "Please use a verified email from major providers (Gmail, Yahoo, Outlook, etc.). Temporary emails are not allowed.";
        setFormErrors({ email: "Invalid email domain" });
      } else if (errorData?.field) {
        errorMessage = errorData.message;
        setFormErrors({ [errorData.field]: errorData.message });
      } else {
        errorMessage = errorData?.message || errorMessage;
      }

      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessComplete = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  return (
    <>
      <SuccessAnimation
        show={showSuccess}
        message="Welcome to Progress AI! Redirecting to your dashboard..."
        onComplete={handleSuccessComplete}
      />

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Background Effects */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />
        <div className="fixed inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-2000" />
        </div>

        {/* Task Management Themed Background Elements */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                top: `${10 + i * 10}%`,
                left: `${5 + i * 12}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + (i % 3)}s`,
              }}
            >
              {i % 4 === 0 && <Target className="w-6 h-6 text-purple-400" />}
              {i % 4 === 1 && <CheckCircle className="w-5 h-5 text-blue-400" />}
              {i % 4 === 2 && <TrendingUp className="w-4 h-4 text-cyan-400" />}
              {i % 4 === 3 && <Sparkles className="w-5 h-5 text-pink-400" />}
            </div>
          ))}
        </div>

        <div className="relative z-10 min-h-screen flex">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
            <div
              className={`space-y-8 transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <Logo size="w-12 h-12" textSize="text-3xl" />

              <div className="space-y-6">
                <h1 className="text-5xl font-bold leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Productivity
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Join thousands of professionals who have revolutionized their
                  workflow with AI-powered task management.
                </p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                {[
                  { icon: Zap, text: "AI-Powered Task Generation" },
                  { icon: Target, text: "Smart Priority Management" },
                  { icon: TrendingUp, text: "Advanced Analytics" },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 transition-all duration-700 delay-${
                      index * 200
                    } ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-5 opacity-0"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-gray-300">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
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
                  <h2 className="text-3xl font-bold mb-2">Create Account</h2>
                  <p className="text-gray-400">Join Progress AI today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          formErrors.name
                            ? "border-red-500"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    {formErrors.name && (
                      <p className="text-red-400 text-sm animate-shake">
                        {formErrors.name}
                      </p>
                    )}
                  </div>

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
                        placeholder="Create a strong password"
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
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-12 py-3 bg-black/20 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                          formErrors.confirmPassword
                            ? "border-red-500"
                            : "border-white/10 hover:border-white/20"
                        }`}
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {formErrors.confirmPassword && (
                      <p className="text-red-400 text-sm animate-shake">
                        {formErrors.confirmPassword}
                      </p>
                    )}
                    {formData.confirmPassword &&
                      formData.password === formData.confirmPassword && (
                        <div className="flex items-center space-x-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Passwords match!</span>
                        </div>
                      )}
                  </div>

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
                        <span>Create Account</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {/* Sign In Link */}
                  <div className="text-center pt-4">
                    <p className="text-gray-400">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-purple-400 hover:text-purple-300 font-medium transition-colors hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </form>
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
              transform: translateY(-10px);
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
            animation: float 4s ease-in-out infinite;
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default RegisterPage;
