import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  PieChart,
  Plus,
  User,
  X,
  Code,
  Link,
  Crown,
  Target,
  Trophy,
  MessageCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useTask } from "../context/TaskContext";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

const Sidebar = ({ onCloseMobile }) => {
  const { info } = useTask();
  const navigate = useNavigate();

  const navItems = [
    { icon: Sparkles, label: "AI Assistant", path: "/ai-insights" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: CheckSquare, label: "Activities", path: "/tasks" },
    { icon: Target, label: "Focus", path: "/focus" },
    { icon: PieChart, label: "Insights", path: "/analytics" },
    { icon: Trophy, label: "Leaderboard", path: "/leaderboard" },
    { icon: MessageCircle, label: "Support", path: "/support" },
  ];

  return (
    <aside className="w-64 h-full bg-[#09090b] border-r border-white/5 flex flex-col">
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <Logo size="w-6 h-6" textSize="text-lg" />
        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1 -mr-2 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Workspace
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onCloseMobile}
            className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              isActive
                                ? "bg-zinc-800/50 text-white"
                                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/30"
                            }
                        `}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-400 rounded border border-purple-500/20">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Premium Upgrade Section */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              Upgrade to Premium
            </span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Unlock unlimited AI features and advanced analytics
          </p>
          <button
            onClick={() => navigate("/premium")}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-all"
          >
            Get Premium
          </button>
        </div>
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-white/5 shrink-0">
        <NavLink
          to="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-3 hover:bg-zinc-800/50 p-2 rounded-lg transition-colors"
        >
          <img
            src={
              info?.profilePic ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${
                info?.name || "User"
              }`
            }
            alt="User"
            className="w-8 h-8 rounded-full ring-2 ring-zinc-800 bg-zinc-700 object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {info.name}
            </p>
            <p className="text-xs text-zinc-500 truncate">Free Plan</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
