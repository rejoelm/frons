"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const TimerWidget = dynamic(() => import("../../components/wfc/TimerWidget"), { ssr: false });
const TodoWidget = dynamic(() => import("../../components/wfc/TodoWidget"), { ssr: false });
const NotepadWidget = dynamic(() => import("../../components/wfc/NotepadWidget"), { ssr: false });
const MusicPlayerWidget = dynamic(() => import("../../components/wfc/MusicPlayerWidget"), { ssr: false });
const BookmarkWidget = dynamic(() => import("../../components/wfc/BookmarkWidget"), { ssr: false });
const SessionLogWidget = dynamic(() => import("../../components/wfc/SessionLogWidget"), { ssr: false });
const AmbienceWidget = dynamic(() => import("../../components/wfc/AmbienceWidget"), { ssr: false });

type WidgetType = "timer" | "todo" | "notepad" | "music" | "bookmark" | "sessionlog" | "ambience";

export default function WorkFromCoffeePage() {
  const [openWidgets, setOpenWidgets] = useState<Set<WidgetType>>(new Set(["timer"]));
  const [time, setTime] = useState(new Date());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleWidget = (widget: WidgetType) => {
    setOpenWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widget)) {
        newSet.delete(widget);
      } else {
        newSet.add(widget);
      }
      return newSet;
    });
  };

  const widgets = [
    { id: "timer", icon: "⏱", label: "Timer", color: "from-orange-400 to-rose-500" },
    { id: "todo", icon: "✓", label: "Tasks", color: "from-blue-400 to-cyan-500" },
    { id: "ambience", icon: "🎧", label: "Sounds", color: "from-emerald-400 to-teal-500" },
    { id: "music", icon: "♫", label: "Music", color: "from-purple-400 to-pink-500" },
    { id: "notepad", icon: "✎", label: "Notes", color: "from-amber-400 to-orange-500" },
    { id: "bookmark", icon: "★", label: "Links", color: "from-indigo-400 to-purple-500" },
  ];

  return (
    <>
      <head>
        <title>frons.id - Modern Workspace</title>
      </head>
      
      {/* Main Container */}
      <div className="fixed inset-0 overflow-hidden bg-[#0a0a0f]">
        {/* Dynamic Gradient Background */}
        <div 
          className="absolute inset-0 opacity-40 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,107,0,0.15), transparent 40%)`
          }}
        />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-transparent rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-transparent rounded-full blur-3xl animate-float-slow" />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.01)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,.01)_1.5px,transparent_1.5px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]" />

        {/* Top Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-6">
          <div className="max-w-[1900px] mx-auto">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-500" />
                  <div className="relative w-11 h-11 bg-gradient-to-br from-orange-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center">
                    <Image 
                      src="/frons-logo.png" 
                      alt="Frons" 
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">frons.id</div>
                  <div className="text-[9px] text-gray-600 font-semibold tracking-widest uppercase">Workspace</div>
                </div>
              </Link>

              {/* Center Nav */}
              <div className="flex items-center gap-1 px-1.5 py-1.5 bg-white/[0.02] backdrop-blur-xl rounded-xl border border-white/[0.05]">
                {["Workspace", "Rewards", "GameFi"].map((item) => (
                  <Link
                    key={item}
                    href={item === "GameFi" ? "/gamefi" : "#"}
                    className="px-5 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all duration-200"
                  >
                    {item}
                  </Link>
                ))}
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 backdrop-blur-xl rounded-lg border border-emerald-500/20">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <div className="absolute inset-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">DEVNET</span>
                </div>
                
                <div className="text-sm text-gray-500 font-mono tabular-nums">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
                
                <button className="relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-purple-500 opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative px-5 py-2.5 text-sm font-bold text-white flex items-center gap-2">
                    Connect Wallet
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Floating Widget Dock */}
        <div className="absolute right-8 top-32 z-40">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-b from-orange-500/10 via-purple-500/10 to-pink-500/10 rounded-[28px] blur-2xl" />
            <div className="relative flex flex-col gap-2 p-2.5 bg-black/40 backdrop-blur-2xl rounded-[24px] border border-white/[0.08]">
              {widgets.map((widget) => {
                const isActive = openWidgets.has(widget.id as WidgetType);
                return (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidget(widget.id as WidgetType)}
                    className="relative group"
                    title={widget.label}
                  >
                    {isActive && (
                      <div className={`absolute -inset-1 bg-gradient-to-br ${widget.color} rounded-[18px] opacity-60 blur-md`} />
                    )}
                    <div className={`relative w-16 h-16 rounded-[16px] flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? `bg-gradient-to-br ${widget.color} shadow-2xl scale-110`
                        : "bg-white/[0.03] hover:bg-white/[0.08] hover:scale-105 border border-white/[0.05]"
                    }`}>
                      <span className="text-2xl">{widget.icon}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Widgets Container */}
        <div className="relative z-30 pt-32 px-8 pb-20">
          {openWidgets.has("timer") && <TimerWidget />}
          {openWidgets.has("todo") && <TodoWidget />}
          {openWidgets.has("notepad") && <NotepadWidget />}
          {openWidgets.has("music") && <MusicPlayerWidget />}
          {openWidgets.has("bookmark") && <BookmarkWidget />}
          {openWidgets.has("sessionlog") && <SessionLogWidget />}
          {openWidgets.has("ambience") && <AmbienceWidget />}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl" />
            <div className="relative px-6 py-2.5 bg-black/40 backdrop-blur-2xl rounded-full border border-white/[0.08]">
              <p className="text-xs text-gray-500 font-medium">
                Built with <span className="text-red-400">❤️</span> by{" "}
                <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent font-bold">
                  frons.id
                </span>
                {" "}• Powered by{" "}
                <span className="text-purple-400 font-semibold">Solana</span>
              </p>
            </div>
          </div>
        </div>

        {/* Custom Animations */}
        <style jsx global>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(30px, -30px) rotate(5deg); }
            66% { transform: translate(-20px, 20px) rotate(-5deg); }
          }
          @keyframes float-delayed {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            33% { transform: translate(-40px, 30px) rotate(-7deg); }
            66% { transform: translate(30px, -20px) rotate(7deg); }
          }
          @keyframes float-slow {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(20px, -40px) scale(1.1); }
          }
          .animate-float {
            animation: float 20s ease-in-out infinite;
          }
          .animate-float-delayed {
            animation: float-delayed 25s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float-slow 30s ease-in-out infinite;
          }
        `}</style>
      </div>
    </>
  );
}

