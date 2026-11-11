import { Link, NavLink, Outlet } from "react-router-dom";
import { Blocks, Wallet, ArrowUpRight, ShieldCheck } from "lucide-react";
import { useWallet } from "../features/wallet/WalletContext";
import { NETWORKS, TARGET_CHAIN_ID } from "../config/networks";
export function Layout() {
  const { address, chainId, connecting, error, connect, switchNetwork } =
    useWallet();
  const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-ink/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="rounded-xl bg-mint/10 p-2 text-mint">
              <Blocks size={22} />
            </span>
            <span className="text-lg font-bold tracking-tight">
              Split<span className="text-mint">Chain</span>
            </span>
          </Link>
          <nav className="hidden gap-7 text-sm text-slate-400 md:flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? "text-mint" : "hover:text-white"
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/groups/new"
              className={({ isActive }) =>
                isActive ? "text-mint" : "hover:text-white"
              }
            >
              Create group
            </NavLink>
          </nav>
          <div className="flex items-center gap-3">
            {address ? (
              <>
                <span className="hidden text-xs text-slate-400 sm:inline">
                  {NETWORKS[chainId || 0]?.name || `Chain ${chainId}`}
                </span>
                {chainId !== TARGET_CHAIN_ID && (
                  <button
                    onClick={switchNetwork}
                    className="rounded-lg border border-amber-400/40 px-3 py-2 text-xs text-amber-200"
                  >
                    Switch network
                  </button>
                )}
                <span className="flex items-center gap-2 rounded-xl border border-line bg-panel px-3 py-2 text-xs">
                  <span className="h-2 w-2 rounded-full bg-mint" />
                  {short(address)}
                </span>
              </>
            ) : (
              <button
                onClick={connect}
                disabled={connecting}
                className="flex items-center gap-2 rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-60"
              >
                <Wallet size={16} />
                {connecting ? "Connecting…" : "Connect wallet"}
              </button>
            )}
          </div>
        </div>
        {error && (
          <div className="mx-auto max-w-7xl px-5 pb-3 text-xs text-rose-300">
            {error}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-line/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>SplitChain · Academic blockchain prototype</span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} /> Settlement acknowledgement only — no INR
            is transferred <ArrowUpRight size={12} />
          </span>
        </div>
      </footer>
    </div>
  );
}
