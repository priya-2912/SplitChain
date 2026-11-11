import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useWallet } from "../wallet/WalletContext";
import { TARGET_CHAIN_ID } from "../../config/networks";
import { parseRupeesToPaise, formatPaiseToRupees } from "../../lib/money";
import { equalSplit, validateExactSplit } from "../../lib/split";
import { hashLabel } from "../../services/contract";
import type { GroupRecord, Share, Address } from "../../types/domain";
export function NewExpense() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { address, repository } = useWallet();
  const [group, setGroup] = useState<GroupRecord | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [mode, setMode] = useState<"EQUAL" | "EXACT">("EQUAL");
  const [exact, setExact] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (repository && groupId)
      repository
        .getGroup(BigInt(groupId))
        .then((g) => {
          setGroup(g);
          setPayer(address || g.creator);
          setParticipants(g.members);
        })
        .catch((e) => setError(e.message));
  }, [repository, groupId, address]);
  const total = useMemo(() => {
    try {
      return parseRupeesToPaise(amount);
    } catch {
      return 0n;
    }
  }, [amount]);
  const split = useMemo<Share[]>(() => {
    if (!group || total <= 0n) return [];
    try {
      if (mode === "EQUAL") return equalSplit(total, participants as Address[]);
      const rows = participants.map((p) => ({
        participant: p as Address,
        amountPaise: parseRupeesToPaise(exact[p] || "0"),
      }));
      validateExactSplit(total, rows);
      return rows;
    } catch {
      return [];
    }
  }, [group, total, mode, participants, exact]);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!repository || !address || !group) {
      setError("Connect your wallet on the configured network first.");
      return;
    }
    try {
      const totalPaise = parseRupeesToPaise(amount);
      if (!description.trim()) throw new Error("Add an expense description.");
      if (!participants.length)
        throw new Error("Select at least one participant.");
      const shares =
        mode === "EQUAL"
          ? equalSplit(totalPaise, participants as Address[])
          : participants.map((p) => ({
              participant: p as Address,
              amountPaise: parseRupeesToPaise(exact[p] || "0"),
            }));
      validateExactSplit(totalPaise, shares);
      if (!group.members.some((m) => m.toLowerCase() === payer.toLowerCase()))
        throw new Error("Payer must be a group member.");
      setBusy(true);
      const tx = await repository.addExpense({
        groupId: group.id,
        payer: payer as Address,
        totalAmountPaise: totalPaise,
        participants: shares.map((s) => s.participant),
        shares: shares.map((s) => s.amountPaise),
        descriptionHash: hashLabel(description.trim()) as `0x${string}`,
        splitMode: mode,
        description,
      });
      navigate(`/groups/${group.id}`, {
        state: {
          notice: `Expense recorded successfully!`,
          txHash: tx.hash,
          explorerUrl: tx.explorerUrl,
        },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not record expense.");
    } finally {
      setBusy(false);
    }
  };
  if (!address)
    return (
      <p className="text-slate-400">Connect your wallet to add an expense.</p>
    );
  if (!repository)
    return (
      <p className="text-amber-200">
        Switch MetaMask to the configured network (chain ID {TARGET_CHAIN_ID})
        to add an expense.
      </p>
    );
  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/groups/${groupId}`}
        className="text-sm text-slate-400 hover:text-mint"
      >
        ← Back to group
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">Add an expense</h1>
      <p className="mt-2 text-sm text-slate-400">
        {group?.title || "Loading group…"} · Record a shared cost.
      </p>
      <form
        onSubmit={submit}
        className="mt-7 space-y-6 rounded-2xl border border-line bg-panel p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label>
            <span className="text-sm">Description</span>
            <input
              className="field mt-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, fuel, tickets…"
              required
              maxLength={80}
            />
          </label>
          <label>
            <span className="text-sm">Total amount (₹)</span>
            <input
              className="field mt-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1200.00"
              inputMode="decimal"
              required
            />
          </label>
        </div>
        <label className="block">
          <span className="text-sm">Paid by</span>
          <select
            className="field mt-2"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          >
            {group?.members.map((m) => (
              <option key={m} value={m}>
                {m.slice(0, 8)}…{m.slice(-6)}{" "}
                {m.toLowerCase() === address.toLowerCase() ? "(you)" : ""}
              </option>
            ))}
          </select>
        </label>
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium">Split participants</span>
            <div className="flex rounded-lg border border-line p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode("EQUAL")}
                className={`rounded-md px-3 py-1.5 ${mode === "EQUAL" ? "bg-mint text-ink" : "text-slate-400"}`}
              >
                Equal
              </button>
              <button
                type="button"
                onClick={() => setMode("EXACT")}
                className={`rounded-md px-3 py-1.5 ${mode === "EXACT" ? "bg-mint text-ink" : "text-slate-400"}`}
              >
                Exact
              </button>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {group?.members.map((m) => (
              <div
                key={m}
                className="flex items-center gap-3 rounded-xl border border-line px-3 py-3"
              >
                <input
                  type="checkbox"
                  checked={participants.includes(m)}
                  onChange={(e) =>
                    setParticipants((prev) =>
                      e.target.checked
                        ? [...prev, m]
                        : prev.filter((x) => x !== m),
                    )
                  }
                  className="accent-emerald-400"
                />
                <span className="min-w-0 flex-1 truncate font-mono text-xs">
                  {m}
                  {m.toLowerCase() === address.toLowerCase() ? " · You" : ""}
                </span>
                {mode === "EXACT" && participants.includes(m) && (
                  <input
                    className="field max-w-32 py-2 text-right"
                    value={exact[m] || ""}
                    onChange={(e) =>
                      setExact((prev) => ({ ...prev, [m]: e.target.value }))
                    }
                    placeholder="₹ share"
                    inputMode="decimal"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-ink/60 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Total</span>
            <strong>{formatPaiseToRupees(total)}</strong>
          </div>
          {split.length > 0 && (
            <div className="mt-3 space-y-2">
              {split.map((s) => (
                <div
                  key={s.participant}
                  className="flex justify-between text-xs"
                >
                  <span className="font-mono text-slate-400">
                    {s.participant.slice(0, 8)}…{s.participant.slice(-5)}
                  </span>
                  <span>{formatPaiseToRupees(s.amountPaise)}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-3 text-[11px] text-slate-500">
            {mode === "EQUAL"
              ? "Remainder paise are assigned deterministically by wallet address."
              : "Exact shares must add up to the total."}
          </p>
        </div>
        <button
          disabled={busy || !group}
          className="w-full rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink disabled:opacity-50"
        >
          {busy ? "Waiting for confirmation…" : "Confirm and record expense"}
        </button>
        {error && <p className="text-sm text-rose-300">{error}</p>}
      </form>
    </div>
  );
}
