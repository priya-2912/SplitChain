import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getAddress } from "ethers";
import { Link } from "react-router-dom";
import { Plus, Users, ArrowUpRight, LoaderCircle } from "lucide-react";
import { useWallet } from "../wallet/WalletContext";
import { TARGET_CHAIN_ID } from "../../config/networks";
import type { GroupRecord } from "../../types/domain";
export function Dashboard() {
  const { address, repository } = useWallet();
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!address || !repository) return;
    setLoading(true);
    repository
      .getMyGroups(address)
      .then(setGroups)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [address, repository]);
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-mint">Your workspace</p>
          <h1 className="mt-2 text-3xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">
            Keep shared costs clear, from the first expense to the final
            acknowledgement.
          </p>
        </div>
        <Link
          to="/groups/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink"
        >
          <Plus size={17} /> Create a group
        </Link>
      </div>
      {!address ? (
        <div className="rounded-2xl border border-line bg-panel p-10 text-center">
          <Users className="mx-auto text-mint" size={32} />
          <h2 className="mt-4 text-xl font-semibold">
            Connect your wallet to get started
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Your wallet address is your identity in SplitChain. Connect MetaMask
            to view and manage your groups.
          </p>
        </div>
      ) : !repository ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-sm text-amber-100">
          Switch MetaMask to the configured network (chain ID {TARGET_CHAIN_ID})
          to load your groups.
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-slate-400">
          <LoaderCircle className="animate-spin" /> Loading groups…
        </div>
      ) : error ? (
        <p className="text-rose-300">{error}</p>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint/10 text-mint">
            <Users />
          </div>
          <h2 className="mt-4 text-lg font-semibold">No groups yet</h2>
          <p className="mt-1 text-sm text-slate-400">
            Create your first group and invite the wallets you share expenses
            with.
          </p>
          <Link
            to="/groups/new"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-mint"
          >
            Create your first group <ArrowUpRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <Link
              key={g.id.toString()}
              to={`/groups/${g.id}`}
              className="group rounded-2xl border border-line bg-panel p-5 transition hover:-translate-y-0.5 hover:border-mint/50"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-xl bg-mint/10 p-2 text-mint">
                  <Users size={19} />
                </span>
                <ArrowUpRight
                  className="text-slate-600 transition group-hover:text-mint"
                  size={17}
                />
              </div>
              <h3 className="mt-5 font-semibold">{g.title}</h3>
              <p className="mt-1 text-xs text-slate-500">
                Group #{g.id.toString()} · {g.members.length} members
              </p>
              <p className="mt-4 truncate text-xs text-slate-400">
                Created by {g.creator}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
export function CreateGroup() {
  const { address, repository } = useWallet();
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [txResult, setTxResult] = useState<{
    hash: string;
    explorerUrl?: string;
  } | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    setTxResult(null);
    if (!address || !repository) {
      setMessage("Connect your wallet on the configured network first.");
      return;
    }
    try {
      const list = members
        .split(/[\n,;]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => getAddress(x) as `0x${string}`);
      if (new Set(list.map((x) => x.toLowerCase())).size !== list.length)
        throw new Error("Member addresses must be unique.");
      if (list.some((x) => x.toLowerCase() === address.toLowerCase()))
        throw new Error(
          "Your connected wallet is added automatically; do not enter it again.",
        );
      if (list.length > 19)
        throw new Error(
          "A group can contain at most 20 members including you.",
        );
      setBusy(true);
      const tx = await repository.createGroup(title.trim(), list);
      setTxResult({ hash: tx.hash, explorerUrl: tx.explorerUrl });
      setMessage("Group transaction confirmed successfully!");
      setTitle("");
      setMembers("");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Could not create group.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/dashboard" className="text-sm text-slate-400 hover:text-mint">
        ← Back to dashboard
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">Create a group</h1>
      <p className="mt-2 text-sm text-slate-400">
        Start a shared space for a trip, household, event, or recurring
        expenses.
      </p>
      <form
        onSubmit={submit}
        className="mt-8 space-y-5 rounded-2xl border border-line bg-panel p-6"
      >
        <label className="block">
          <span className="text-sm font-medium">Group name</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            required
            placeholder="e.g. Weekend Trip"
            className="field mt-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium">
            Initial member wallet addresses{" "}
            <span className="text-slate-500">(optional)</span>
          </span>
          <textarea
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            rows={4}
            placeholder="0x… — one address per line"
            className="field mt-2 font-mono text-xs"
          />
          <span className="mt-2 block text-xs text-slate-500">
            Your connected wallet is added automatically. Maximum 20 members
            total.
          </span>
        </label>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3 text-xs leading-5 text-amber-100/80">
          Group title is stored in contract state and is publicly visible. Do
          not include private information.
        </div>
        <button
          disabled={busy}
          className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {busy ? "Waiting for confirmation…" : "Create group on blockchain"}
        </button>
        {message && (
          <div className="space-y-1 text-xs text-mint">
            <p>{message}</p>
            {txResult && (
              <p className="break-all font-mono text-[11px] text-slate-400">
                Tx: {txResult.hash}
                {txResult.explorerUrl && (
                  <a
                    href={txResult.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 inline-flex items-center gap-0.5 text-mint underline hover:text-white"
                  >
                    View on Explorer <ArrowUpRight size={12} />
                  </a>
                )}
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
