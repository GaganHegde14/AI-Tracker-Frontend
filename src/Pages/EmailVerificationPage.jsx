import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import api from "../services/api";
import Logo from "../Components/Logo";
import {
  Mail,
  Shield,
  Clock,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

const EmailVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);

  // OTP input refs
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Get user data from navigation state
  const { userId, email, userName } = location.state || {};

  useEffect(() => {
    // Redirect if no user data
    if (!userId || !email) {
      navigate("/register", { replace: true });
      return;
    }

    setIsVisible(true);

    // Focus first input
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 6) {
      const newOtp = digits.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      showNotification("Please enter the complete 6-digit code", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/verify-otp", {
        userId,
        otp: otpString,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);

        // Dispatch custom event to notify App component of auth change
        window.dispatchEvent(new Event("authChange"));

        showNotification(
          "Email verified successfully! Welcome to AI Task Manager! 🎉",
          "success"
        );

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error("OTP verification error:", error);

      const errorData = error.response?.data;
      let errorMessage = "Verification failed. Please try again.";

      if (errorData?.type === "otp_expired") {
        errorMessage =
          "Verification code has expired. Please request a new one.";
        setCanResend(true);
        setTimeLeft(0);
      } else if (errorData?.type === "invalid_otp") {
        errorMessage = "Invalid verification code. Please check and try again.";
        // Clear the OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else if (errorData?.type === "already_verified") {
        errorMessage = "Email already verified. Redirecting to login...";
        setTimeout(() => navigate("/login"), 2000);
      }

      showNotification(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);

    try {
      const response = await api.post("/resend-otp", { userId });

      if (response.status === 200) {
        showNotification(
          "New verification code sent to your email! 📧",
          "success"
        );
        setTimeLeft(600); // Reset timer to 10 minutes
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();

        // Start new countdown
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send new code. Please try again.";
      showNotification(errorMessage, "error");
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    navigate("/register", { replace: true });
  };

  if (!userId || !email) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-red-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-bounce [animation-duration:3s]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-bounce [animation-duration:4s]" />
      </div>

      <div
        className={`relative z-10 w-full max-w-md transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Shield className="w-7 h-7 text-purple-400" />
              Verify Your Email
            </h1>

            <p className="text-gray-300 text-sm mb-4">
              We've sent a 6-digit verification code to
            </p>

            <div className="bg-white/5 rounded-lg p-3 mb-4">
              <p className="text-purple-300 font-medium break-all">{email}</p>
            </div>

            <p className="text-gray-400 text-xs">
              Enter the code below to complete your registration
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            {/* OTP Input Fields */}
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 backdrop-blur-sm"
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Timer */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
                <Clock className="w-4 h-4" />
                {timeLeft > 0 ? (
                  <span>Code expires in {formatTime(timeLeft)}</span>
                ) : (
                  <span className="text-red-400">Code expired</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.some((digit) => !digit)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify Email</span>
                </>
              )}
            </button>
          </div>

          {/* Resend Section */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-3">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isResending}
              className="text-purple-400 hover:text-purple-300 font-medium text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Send New Code</span>
                </>
              )}
            </button>
          </div>

          {/* Back to Register */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleGoBack}
              className="text-gray-400 hover:text-white text-sm transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Registration</span>
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm font-medium mb-1">
                Security Note
              </p>
              <p className="text-amber-300/80 text-xs">
                Never share this verification code with anyone. Our team will
                never ask for your verification code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
