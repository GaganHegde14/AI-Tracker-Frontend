import React from "react";
import { CheckCircle, Circle, AlertCircle, Shield, Lock } from "lucide-react";

const PasswordStrengthIndicator = ({ password, className = "" }) => {
  const calculateStrength = (pwd) => {
    let strength = 0;
    const checks = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
    };

    const passed = Object.values(checks).filter(Boolean).length;

    if (passed >= 5) strength = 4; // Very Strong
    else if (passed >= 4) strength = 3; // Strong
    else if (passed >= 3) strength = 2; // Good
    else if (passed >= 2) strength = 1; // Weak
    else strength = 0; // Very Weak

    return { strength, checks, passed };
  };

  const { strength, checks, passed } = calculateStrength(password);

  const strengthLabels = ["Very Weak", "Weak", "Good", "Strong", "Very Strong"];
  const strengthColors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-blue-500",
    "text-green-500",
  ];

  const barColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className={`mt-3 space-y-3 ${className}`}>
      {/* Strength Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Password Strength</span>
          <span className={`text-sm font-medium ${strengthColors[strength]}`}>
            {strengthLabels[strength]}
          </span>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                i < strength + 1 ? barColors[strength] : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        {[
          { key: "length", label: "At least 8 characters", icon: Lock },
          { key: "lowercase", label: "Lowercase letter", icon: Circle },
          { key: "uppercase", label: "Uppercase letter", icon: Circle },
          { key: "number", label: "Number", icon: AlertCircle },
          { key: "special", label: "Special character", icon: Shield },
        ].map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className={`flex items-center gap-2 transition-colors duration-300 ${
              checks[key] ? "text-green-400" : "text-gray-500"
            }`}
          >
            {checks[key] ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span className="text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
