import React, { useEffect, useState } from "react";
import Logo from "./Logo";

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onFinish, 500); // Wait for fade out animation before unmounting
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-200 flex items-center justify-center bg-[#09090b] transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="relative animate-in zoom-in-50 duration-700 ease-out">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full animate-pulse"></div>

          {/* Logo Component */}
          <div className="relative z-10 drop-shadow-2xl">
            <Logo size="w-32 h-32 md:w-40 md:h-40" showText={false} />
          </div>
        </div>

        {/* Loading Bar / Brand Name */}
        <div className="mt-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold bg-linear-to-r from-white via-purple-200 to-white bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            PROGRESS AI
          </h1>

          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-linear-to-r from-purple-600 to-indigo-600 w-full animate-[progress_3s_ease-in-out_infinite] origin-left scale-x-0 fill-mode-forwards"
              style={{ animationIterationCount: 1 }}
            ></div>
          </div>
        </div>

        <style>{`
                    @keyframes progress {
                        0% { transform: scaleX(0); }
                        100% { transform: scaleX(1); }
                    }
                `}</style>
      </div>
    </div>
  );
};

export default SplashScreen;
