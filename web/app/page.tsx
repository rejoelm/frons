import dynamic from "next/dynamic";
import { Suspense } from "react";
import { WalletPanel } from "../components/WalletPanel";

const PomodoroTimer = dynamic(() => import("../components/PomodoroTimerImproved").then((mod) => ({ default: mod.PomodoroTimerImproved })), {
  ssr: false,
  loading: () => <div className="border border-slate-800/60 rounded-3xl p-6">Loading timer…</div>
});

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <WalletPanel />
      <Suspense fallback={<div className="border border-slate-800/60 rounded-3xl p-6">Preparing dashboard…</div>}>
        <PomodoroTimer />
      </Suspense>
    </div>
  );
}
