import React from "react";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-zinc-900/50">
      <div className="flex  items-center justify-center gap-2 text-center">
        <p className="text-xs text-zinc-400">
          &copy; {new Date().getFullYear()} Progress AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
