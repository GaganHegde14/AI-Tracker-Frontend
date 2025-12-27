import React from "react";
import Layout from "../Components/Layout";
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  Code2,
  Terminal,
  Cpu,
  Globe,
  Database,
  Star,
  GitFork,
  Command,
} from "lucide-react";

const DeveloperPage = () => {
  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="w-5 h-5" />,
      url: "https://github.com/sahillll0/",
      color: "text-white",
      bg: "bg-zinc-800 hover:bg-zinc-700",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      url: "https://www.linkedin.com/in/sahil-tippe-b20766284/",
      color: "text-blue-400",
      bg: "bg-blue-900/20 hover:bg-blue-900/30",
    },
    {
      name: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      url: "https://www.instagram.com/sahillllll_00/",
      color: "text-pink-400",
      bg: "bg-pink-900/20 hover:bg-pink-900/30",
    },
    {
      name: "X (Twitter)",
      icon: (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      ),
      url: "https://x.com/sahil_tippe",
      color: "text-white",
      bg: "bg-black hover:bg-zinc-900",
    },
  ];

  const skills = [
    {
      name: "React",
      icon: <Code2 className="w-4 h-4" />,
      color: "text-cyan-400",
    },
    {
      name: "Node.js",
      icon: <Terminal className="w-4 h-4" />,
      color: "text-green-400",
    },
    {
      name: "MongoDB",
      icon: <Database className="w-4 h-4" />,
      color: "text-emerald-400",
    },
    {
      name: "Tailwind",
      icon: <Globe className="w-4 h-4" />,
      color: "text-sky-400",
    },
    { name: "Express", icon: <Cpu className="w-4 h-4" />, color: "text-white" },
  ];

  return (
    <Layout className="scrollbar-hide">
      <div className="min-h-full w-full bg-[#09090b] text-white overflow-hidden relative selection:bg-purple-500/30">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10 space-y-16">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-10">
            <div className="space-y-6 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-zinc-300">
                  Available for hire
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white via-zinc-200 to-zinc-500">
                Sahil Tippe
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-lg mx-auto md:mx-0">
                Full-Stack Developer crafting digital experiences with purpose.
                Transforming ideas into scalable, high-performance web
                applications.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                <a
                  href="mailto:sahiltippe111@gmail.com"
                  className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Contact Me
                </a>
                <a
                  href="https://github.com/sahillll0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-zinc-800 text-white font-semibold rounded-full hover:bg-zinc-700 transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  View GitHub
                </a>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-6">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all cursor-default"
                  >
                    <div className={skill.color}>{skill.icon}</div>
                    <span className="text-sm font-medium text-zinc-300">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Image & Visual */}
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-tr from-purple-500 to-blue-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900/50 backdrop-blur-sm rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://avatars.githubusercontent.com/u/184468122?v=4"
                  alt="Sahil Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats & Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GitHub Stats Card */}
            <div className="md:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 overflow-hidden relative group hover:border-zinc-700 transition-colors">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Command className="w-5 h-5 text-purple-400" />
                GitHub Contributions
              </h3>
              <div className="w-full overflow-hidden rounded-lg opacity-80 group-hover:opacity-100 transition-opacity">
                <img
                  src="https://github-readme-stats.vercel.app/api?username=sahillll0&show_icons=true&theme=transparent&hide_border=true&title_color=fff&text_color=a1a1aa&icon_color=a855f7&bg_color=00000000"
                  alt="GitHub Stats"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Top Languages */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors flex flex-col justify-center">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                Top Languages
              </h3>
              <div className="w-full overflow-hidden rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                <img
                  src="https://github-readme-stats.vercel.app/api/top-langs/?username=sahillll0&layout=compact&theme=transparent&hide_border=true&title_color=fff&text_color=a1a1aa&icon_color=3b82f6&bg_color=00000000"
                  alt="Top Languages"
                  className="w-full h-full scale-110"
                />
              </div>
            </div>
          </div>

          {/* Socials Connection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] gap-3 ${link.bg}`}
              >
                <div className={`${link.color}`}>{link.icon}</div>
                <span className={`text-sm font-medium ${link.color}`}>
                  {link.name}
                </span>
              </a>
            ))}
          </div>

          {/* Featured Project Snippet (Optional/Placeholder) */}
          <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 p-8 text-center">
            <div className="inline-flex items-center gap-2 text-zinc-400 mb-4">
              <GitFork className="w-4 h-4" />
              <span className="text-sm tracking-wider uppercase">
                Current Focus
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Progress AI</h2>
            <p className="text-zinc-400 max-w-xl mx-auto mb-6">
              Building a smart task management ecosystem powered by artificial
              intelligence to revolutionize personal productivity.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-sm text-yellow-500">
                In Active Development
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeveloperPage;
