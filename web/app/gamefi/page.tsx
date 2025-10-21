"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const NFTProfile = dynamic(() => import("../../components/NFTProfile").then(mod => ({ default: mod.NFTProfile })), { ssr: false });
const Achievements = dynamic(() => import("../../components/Achievements").then(mod => ({ default: mod.Achievements })), { ssr: false });
const LevelRank = dynamic(() => import("../../components/LevelRank").then(mod => ({ default: mod.LevelRank })), { ssr: false });
const StreakCalendar = dynamic(() => import("../../components/StreakCalendar").then(mod => ({ default: mod.StreakCalendar })), { ssr: false });
const DailyChallenges = dynamic(() => import("../../components/DailyChallenges").then(mod => ({ default: mod.DailyChallenges })), { ssr: false });
const Leaderboard = dynamic(() => import("../../components/Leaderboard").then(mod => ({ default: mod.Leaderboard })), { ssr: false });
const ThemeCustomization = dynamic(() => import("../../components/ThemeCustomization").then(mod => ({ default: mod.ThemeCustomization })), { ssr: false });

export default function GameFiPage() {
  // Mock data - in production this would come from on-chain data
  const mockData = {
    totalPoints: 5420,
    focusSessions: 54,
    restSessions: 12,
    cancelledSessions: 3,
    longestStreak: 12,
    currentStreak: 7,
    focusSessionsToday: 3,
    restSessionsToday: 1,
    pointsToday: 315,
    history: [] // Would be populated with actual session data
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                🎮 GameFi Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">Level up your productivity with rewards and achievements</p>
            </div>
            <a
              href="/"
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              ← Back to Timer
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Top Section - Profile & Level */}
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
            <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[400px]" />}>
              <NFTProfile />
            </Suspense>
            <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[400px]" />}>
              <LevelRank totalPoints={mockData.totalPoints} />
            </Suspense>
          </div>

          {/* Daily Challenges */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[400px]" />}>
            <DailyChallenges
              focusSessionsToday={mockData.focusSessionsToday}
              restSessionsToday={mockData.restSessionsToday}
              pointsToday={mockData.pointsToday}
              currentStreak={mockData.currentStreak}
            />
          </Suspense>

          {/* Achievements */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[600px]" />}>
            <Achievements
              focusSessions={mockData.focusSessions}
              restSessions={mockData.restSessions}
              totalPoints={mockData.totalPoints}
              longestStreak={mockData.longestStreak}
            />
          </Suspense>

          {/* Streak Calendar */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[500px]" />}>
            <StreakCalendar
              history={mockData.history}
              currentStreak={mockData.currentStreak}
            />
          </Suspense>

          {/* Leaderboard */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[600px]" />}>
            <Leaderboard
              userPoints={mockData.totalPoints}
              userFocusSessions={mockData.focusSessions}
              userStreak={mockData.currentStreak}
            />
          </Suspense>

          {/* Theme Customization */}
          <Suspense fallback={<div className="border border-slate-800 rounded-2xl p-6 animate-pulse bg-slate-900/50 h-[500px]" />}>
            <ThemeCustomization userPoints={mockData.totalPoints} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

