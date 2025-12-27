import React, { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const SuccessAnimation = ({ show, message, onComplete }) => {
  const [stage, setStage] = useState(0); // 0: hidden, 1: entering, 2: showing, 3: exiting

  useEffect(() => {
    if (show) {
      setStage(1);
      const timer1 = setTimeout(() => setStage(2), 100);
      const timer2 = setTimeout(() => setStage(3), 2000);
      const timer3 = setTimeout(() => {
        setStage(0);
        onComplete?.();
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [show, onComplete]);

  if (stage === 0) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-500 ${
        stage === 1 || stage === 2 ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative transform transition-all duration-500 ${
          stage === 1
            ? "opacity-0 scale-95"
            : stage === 2
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Main container */}
        <div className="relative bg-gradient-to-r from-gray-900/95 to-black/95 backdrop-blur-xl border border-green-500/30 rounded-2xl p-8 text-center space-y-4 min-w-[300px]">
          {/* Simple check circle */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          {/* Success message */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Success!</h2>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>

          {/* Simple progress indicator */}
          <div className="w-full bg-gray-700 rounded-full h-1">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-1 rounded-full transition-all duration-2000"
              style={{ width: stage === 2 ? "100%" : "0%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
