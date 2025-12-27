import React from "react";
import progressAiLogo from "../assets/progress-ai-logo.svg";

const Logo = ({
  size = "w-8 h-8",
  className = "",
  showText = true,
  textSize = "text-xl",
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img
        src={progressAiLogo}
        alt="Progress AI Logo"
        className={`${size} filter drop-shadow-lg`}
      />
      {showText && (
        <span
          className={`font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent ${textSize}`}
        >
          Progress AI
        </span>
      )}
    </div>
  );
};

export default Logo;
