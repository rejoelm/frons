"use client";

import { useState } from "react";
import { TopMenuBar } from "@/components/top-menu-bar";
import { AppLauncher } from "@/components/app-launcher";
import { Window } from "@/components/window-manager";
import { PomodoroApp } from "@/components/apps-new/pomodoro-app";
import { TodoApp } from "@/components/apps-new/todo-app";
import { NotesApp } from "@/components/apps-new/notes-app";
import { MusicApp } from "@/components/apps-new/music-app";
import { StatsApp } from "@/components/apps-new/stats-app";
import { FocusApp } from "@/components/apps-new/focus-app";
import { FloatingXPNotification, useXPNotifications } from "@/components/gamefi/floating-xp-notification";
import { Timer, CheckSquare, StickyNote, Music, BarChart3, Coffee, Trophy } from "lucide-react";

interface OpenWindow {
  id: string;
  appId: string;
  zIndex: number;
}

const appComponents = {
  pomodoro: PomodoroApp,
  todo: TodoApp,
  notes: NotesApp,
  music: MusicApp,
  stats: StatsApp,
  focus: FocusApp,
};

const appIcons = {
  pomodoro: Timer,
  todo: CheckSquare,
  notes: StickyNote,
  music: Music,
  stats: BarChart3,
  focus: Coffee,
};

const appTitles = {
  pomodoro: "Pomodoro Timer",
  todo: "Task Manager",
  notes: "Notes",
  music: "Ambient Sounds",
  stats: "Productivity Stats",
  focus: "Focus Mode",
};

const appDefaultSizes = {
  pomodoro: { width: 450, height: 600 },
  todo: { width: 500, height: 650 },
  notes: { width: 700, height: 600 },
  music: { width: 500, height: 550 },
  stats: { width: 600, height: 650 },
  focus: { width: 500, height: 600 },
};

export default function WorkspacePage() {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { notifications, addNotification, removeNotification } = useXPNotifications();

  const launchApp = (appId: string) => {
    // Check if app is already open
    const existingWindow = openWindows.find((w) => w.appId === appId);
    if (existingWindow) {
      // Bring to front
      focusWindow(existingWindow.id);
      return;
    }

    // Create new window with random offset
    const offset = openWindows.length * 30;
    const newWindow: OpenWindow = {
      id: `${appId}-${Date.now()}`,
      appId,
      zIndex: nextZIndex,
    };

    setOpenWindows([...openWindows, newWindow]);
    setNextZIndex(nextZIndex + 1);
  };

  const closeWindow = (id: string) => {
    setOpenWindows(openWindows.filter((w) => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setOpenWindows((windows) =>
      windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      )
    );
    setNextZIndex(nextZIndex + 1);
  };

  const handleMenuClick = () => {
    // Handle menu click
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/background/bg-1.webp')`,
        }}
      />
      
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />

      {/* Top Menu Bar */}
      <TopMenuBar
        onMenuClick={handleMenuClick}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
        showGameFiStats={false}
      />

      {/* App Launcher Sidebar */}
      <AppLauncher onLaunchApp={launchApp} />

      {/* Windows */}
      {openWindows.map((window, index) => {
        const AppComponent = appComponents[window.appId as keyof typeof appComponents];
        const Icon = appIcons[window.appId as keyof typeof appIcons];
        const title = appTitles[window.appId as keyof typeof appTitles];
        const defaultSize = appDefaultSizes[window.appId as keyof typeof appDefaultSizes];
        
        // Calculate position with offset
        const baseX = 150;
        const baseY = 120;
        const offset = index * 30;

        return (
          <Window
            key={window.id}
            id={window.id}
            title={title}
            icon={<Icon className="w-5 h-5" />}
            onClose={() => closeWindow(window.id)}
            defaultPosition={{ x: baseX + offset, y: baseY + offset }}
            defaultSize={defaultSize}
            zIndex={window.zIndex}
            onFocus={() => focusWindow(window.id)}
          >
            <AppComponent />
          </Window>
        );
      })}

      {/* Welcome Message - Only shown when no windows are open */}
      {openWindows.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center max-w-2xl px-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl shadow-2xl mb-6">
                <span className="text-white text-5xl font-bold">F</span>
              </div>
            </div>
            <h1 className="text-6xl mb-4 bg-gradient-to-r from-white via-orange-100 to-amber-100 bg-clip-text text-transparent font-bold">
              Welcome to frons.id
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Your immersive productivity workspace
            </p>
            <div className="text-white/60 mb-6">
              Click an app icon on the right to get started →
            </div>
          </div>
        </div>
      )}

      {/* Subtle Award Badge */}
      <div className="fixed bottom-6 left-6 z-50 opacity-40 hover:opacity-100 transition-opacity">
        <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white/80 text-sm">
          ✨ Inspired by Award-Winning Design
        </div>
      </div>

      {/* XP Notifications */}
      <FloatingXPNotification
        notifications={notifications}
        onRemove={removeNotification}
      />

      {/* Demo XP Button (for testing) */}
      {openWindows.length > 0 && (
        <button
          onClick={() => addNotification(75, "Completed a Pomodoro session")}
          className="fixed bottom-6 right-24 z-50 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg shadow-lg text-sm opacity-50 hover:opacity-100 transition-all"
        >
          Test XP +
        </button>
      )}
    </div>
  );
}

