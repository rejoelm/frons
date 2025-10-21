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
  const [backgroundIndex, setBackgroundIndex] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    // Load saved background
    const saved = localStorage.getItem('backgroundIndex');
    if (saved) setBackgroundIndex(parseInt(saved));
    return () => clearInterval(timer);
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
    { id: "timer", icon: "/icons/clock.png", label: "Timer" },
    { id: "todo", icon: "/icons/board.png", label: "To-Do List" },
    { id: "ambience", icon: "/icons/ambience.png", label: "Ambience" },
    { id: "music", icon: "/icons/music.png", label: "Music Player" },
    { id: "notepad", icon: "/icons/notepad.png", label: "Notepad" },
    { id: "bookmark", icon: "/icons/bookmark.png", label: "Bookmark" },
  ];

  return (
    <>
      <head>
        <title>frons.id - Work from Coffee</title>
      </head>
      
      {/* Main Container */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Coffee Shop Background */}
        <div className="absolute inset-0 -z-50">
          <Image
            src={`/background/bg-${backgroundIndex}.webp`}
            alt="Coffee shop background"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Subtle overlay for better text readability */}
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Top Menu Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 px-6 py-3">
          <div className="flex items-center justify-between bg-black/30 backdrop-blur-md rounded-lg px-4 py-2">
            {/* Left Side */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src="/frons-logo.png" 
                  alt="Frons" 
                  width={24}
                  height={24}
                  className="rounded"
                />
                <span className="text-white font-semibold text-sm">frons.id</span>
              </Link>
              <div className="flex items-center gap-2">
                <button className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
                  Menu
                </button>
                <button className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
                  Apps
                </button>
                <Link href="/gamefi" className="text-white/90 hover:text-white text-sm px-3 py-1 rounded hover:bg-white/10 transition-colors">
                  GameFi
                </Link>
              </div>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center gap-4">
              <span className="text-white/90 text-sm font-medium">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
              </span>
            </div>
          </div>
        </div>

        {/* Widget Sidebar - Right Side */}
        <div className="absolute right-6 top-24 z-40 flex flex-col gap-3">
          {widgets.map((widget) => {
            const isActive = openWidgets.has(widget.id as WidgetType);
            return (
              <button
                key={widget.id}
                onClick={() => toggleWidget(widget.id as WidgetType)}
                className={`group flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/20 backdrop-blur-sm scale-105"
                    : "hover:bg-white/10 hover:scale-105"
                }`}
                title={widget.label}
              >
                <div className="relative w-12 h-12">
                  <Image
                    src={widget.icon}
                    alt={widget.label}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
                <span className="text-xs text-white drop-shadow-md font-medium text-center max-w-[80px] truncate">
                  {widget.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Widgets Container */}
        <div className="relative z-30 pt-24 px-8 pb-20 h-full overflow-auto">
          {openWidgets.has("timer") && <TimerWidget onClose={() => toggleWidget("timer")} />}
          {openWidgets.has("todo") && <TodoWidget onClose={() => toggleWidget("todo")} />}
          {openWidgets.has("notepad") && <NotepadWidget onClose={() => toggleWidget("notepad")} />}
          {openWidgets.has("music") && <MusicPlayerWidget onClose={() => toggleWidget("music")} />}
          {openWidgets.has("bookmark") && <BookmarkWidget onClose={() => toggleWidget("bookmark")} />}
          {openWidgets.has("sessionlog") && <SessionLogWidget onClose={() => toggleWidget("sessionlog")} />}
          {openWidgets.has("ambience") && <AmbienceWidget onClose={() => toggleWidget("ambience")} />}
        </div>

        {/* Award Badge - Bottom Left */}
        <div className="absolute bottom-6 left-6 z-40">
          <div className="bg-black/40 backdrop-blur-md rounded-lg px-4 py-3 border border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <div className="text-xs text-white/90 font-semibold">frons.id</div>
                <div className="text-[10px] text-white/60">Productivity Workspace</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

