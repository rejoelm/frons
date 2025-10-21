import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "fronSOL Productivity Pods",
  description: "Work-from-coffee inspired Pomodoro dApp rewarding productive days on Solana",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <Providers>
          <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Work from Coffee • fronSOL Pods</h1>
                <p className="text-slate-300 text-sm md:text-base">
                  Track each focus, rest, and cancelled podomoro directly on-chain. Earn or lose points based on your discipline.
                </p>
              </div>
              <div className="md:self-end">
                <p className="text-xs uppercase text-slate-400">Solana Devnet</p>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="text-xs text-slate-500 text-center pb-6">
              Built with the Work-from-Coffee stack and Solana. fronSOL multiplier support coming soon.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
