import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
  Users,
  Receipt,
  Scale,
} from "lucide-react";
import { useWallet } from "../features/wallet/WalletContext";
export function Landing() {
  const { address, connect, connecting } = useWallet();
  return (
    <div className="space-y-20 py-8">
      <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-mint/20 bg-mint/5 px-3 py-1.5 text-xs text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Transparent
            group expense records
          </div>
          <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Shared expenses.
            <br />
            <span className="text-mint">Clear balances.</span>
            <br />
            No awkward maths.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400">
            SplitChain brings your group's expenses and settlement
            acknowledgements onto a shared blockchain record, so everyone can
            see how the numbers add up.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {address ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3.5 text-sm font-semibold text-ink"
              >
                Open dashboard <ArrowRight size={17} />
              </Link>
            ) : (
              <button
                onClick={connect}
                disabled={connecting}
                className="inline-flex items-center gap-2 rounded-xl bg-mint px-5 py-3.5 text-sm font-semibold text-ink"
              >
                {connecting ? "Connecting…" : "Connect MetaMask"}
                <ArrowRight size={17} />
              </button>
            )}
            <a
              href="#how"
              className="rounded-xl border border-line px-5 py-3.5 text-sm font-semibold text-slate-300 hover:border-slate-500"
            >
              How it works
            </a>
          </div>
          <p className="mt-5 text-xs text-slate-500">
            Academic prototype · Sepolia testnet · No real money transfers
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-full bg-mint/5 blur-3xl" />
          <div className="relative rounded-3xl border border-line bg-panel p-5 shadow-glow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">GROUP OVERVIEW</p>
                <h3 className="mt-1 text-lg font-semibold">Weekend Trip</h3>
              </div>
              <span className="rounded-full bg-mint/10 px-3 py-1 text-xs text-mint">
                On-chain
              </span>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-ink p-4">
                <p className="text-xs text-slate-500">You are owed</p>
                <p className="mt-2 text-2xl font-semibold text-mint">₹400.00</p>
              </div>
              <div className="rounded-2xl bg-ink p-4">
                <p className="text-xs text-slate-500">You owe</p>
                <p className="mt-2 text-2xl font-semibold text-rose-300">
                  ₹0.00
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Recent activity</span>
                <span className="text-slate-600">Illustrative preview</span>
              </div>
              {[
                {
                  name: "Lunch · equal split",
                  value: "₹900.00",
                  tag: "Expense",
                },
                {
                  name: "Petrol · equal split",
                  value: "₹600.00",
                  tag: "Expense",
                },
                {
                  name: "Settlement acknowledged",
                  value: "₹400.00",
                  tag: "Confirmed",
                },
              ].map((x, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-line/70 px-3 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-mint">
                      {i === 2 ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Receipt size={16} />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-medium">{x.name}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{x.tag}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold">{x.value}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[10px] text-slate-600">
              Example interface only — not live account data.
            </p>
          </div>
        </div>
      </section>
      <section id="how" className="space-y-8">
        <div className="max-w-xl">
          <p className="text-sm text-mint">Simple by design</p>
          <h2 className="mt-2 text-3xl font-semibold">
            Everything your group needs to stay in sync.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Create a group",
              desc: "Connect your wallet, create a group, and add the people you share costs with.",
            },
            {
              icon: Receipt,
              title: "Record expenses",
              desc: "Add who paid, choose participants, and split equally or enter exact shares.",
            },
            {
              icon: Scale,
              title: "Settle transparently",
              desc: "See net balances and propose a settlement for the creditor to acknowledge.",
            },
          ].map((x, i) => (
            <div
              key={x.title}
              className="rounded-2xl border border-line bg-panel p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mint/10 text-mint">
                <x.icon size={22} />
              </span>
              <p className="mt-5 text-xs text-slate-600">0{i + 1}</p>
              <h3 className="mt-1 text-lg font-semibold">{x.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{x.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-3xl border border-mint/15 bg-mint/[.04] p-7 sm:p-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-mint">
              <LockKeyhole size={17} />
              <span className="text-xs font-semibold uppercase tracking-widest">
                Built for transparency
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-semibold">
              Your records, verifiable by the group.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              SplitChain stores group and expense records on a public test
              blockchain. It does not hold funds, make payments, or guarantee
              that an off-chain expense or payment is genuine.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-mint"
          >
            Get started <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
