import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAddress } from "ethers";
import {
  ArrowLeftRight,
  ArrowUpRight,
  CheckCircle2,
  Plus,
  Receipt,
  Scale,
  Users,
  LoaderCircle,
} from "lucide-react";
import { useWallet } from "../wallet/WalletContext";
import { formatPaiseToRupees, parseRupeesToPaise } from "../../lib/money";
import { suggestSettlements } from "../../lib/accounting";
import { TARGET_CHAIN_ID } from "../../config/networks";
import type {
  ExpenseRecord,
  GroupRecord,
  MemberBalance,
  SettlementRecord,
} from "../../types/domain";

export function GroupDetails() {
  const { groupId } = useParams();
  const location = useLocation();
  const { address, repository } = useWallet();
  const [group, setGroup] = useState<GroupRecord | null>(null);
  const [balances, setBalances] = useState<MemberBalance[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionResult, setActionResult] = useState<{
    message: string;
    txHash?: string;
    explorerUrl?: string;
  } | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [newMember, setNewMember] = useState("");
  const [prefilledCreditor, setPrefilledCreditor] = useState("");
  const [prefilledAmount, setPrefilledAmount] = useState("");

  const notice = location.state as {
    notice?: string;
    txHash?: string;
    explorerUrl?: string;
  } | null;

  const load = useCallback(async () => {
    if (!repository || !groupId) return;
    setLoading(true);
    try {
      const g = await repository.getGroup(BigInt(groupId));
      const [b, e, s] = await Promise.all([
        repository.getBalances(g.id, g.members),
        repository.getExpenses(g.id),
        repository.getSettlements(g.id),
      ]);
      setGroup(g);
      setBalances(b);
      setExpenses(e);
      setSettlements(s);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load group.");
    } finally {
      setLoading(false);
    }
  }, [repository, groupId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!repository || !group) return;
    setActing("add-member");
    setActionResult(null);
    try {
      const member = getAddress(newMember) as `0x${string}`;
      if (group.members.some((m) => m.toLowerCase() === member.toLowerCase()))
        throw new Error("This wallet is already a member.");
      const tx = await repository.addMember(group.id, member);
      setActionResult({
        message: "Member added successfully!",
        txHash: tx.hash,
        explorerUrl: tx.explorerUrl,
      });
      setNewMember("");
      await load();
    } catch (e) {
      setActionResult({
        message: e instanceof Error ? e.message : "Could not add member.",
      });
    } finally {
      setActing(null);
    }
  };

  const settleAction = async (id: bigint, action: "confirm" | "reject") => {
    if (!repository) return;
    setActing(`${action}-${id}`);
    setActionResult(null);
    try {
      const tx =
        action === "confirm"
          ? await repository.confirmSettlement(id)
          : await repository.rejectSettlement(id);
      setActionResult({
        message:
          action === "confirm"
            ? "Settlement acknowledged on blockchain!"
            : "Settlement rejected on blockchain.",
        txHash: tx.hash,
        explorerUrl: tx.explorerUrl,
      });
      await load();
    } catch (e) {
      setActionResult({
        message: e instanceof Error ? e.message : "Settlement action failed.",
      });
    } finally {
      setActing(null);
    }
  };

  const suggestions = useMemo(() => suggestSettlements(balances), [balances]);

  if (!address)
    return (
      <div className="rounded-2xl border border-line bg-panel p-8 text-center">
        Connect your wallet to view this group.
      </div>
    );
  if (!repository)
    return (
      <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-6 text-sm text-amber-100">
        Switch MetaMask to the configured network (chain ID {TARGET_CHAIN_ID})
        to view this group.
      </div>
    );
  if (loading)
    return (
      <div className="flex items-center gap-2 text-slate-400">
        <LoaderCircle className="animate-spin" /> Loading group…
      </div>
    );
  if (error || !group)
    return <div className="text-rose-300">{error || "Group not found."}</div>;

  const owed = balances
    .filter((b) => b.netPaise > 0n)
    .reduce((s, b) => s + b.netPaise, 0n);
  const you = balances.find(
    (b) => b.member.toLowerCase() === address.toLowerCase(),
  );
  const pendingForMe = settlements.filter(
    (s) =>
      s.status === "PROPOSED" &&
      s.creditor.toLowerCase() === address.toLowerCase(),
  );
  const memberLabel = (wallet: string) =>
    `${wallet.slice(0, 8)}…${wallet.slice(-5)}`;

  const handleUseSuggestion = (creditor: string, amountPaise: bigint) => {
    setPrefilledCreditor(creditor);
    const rupees = (Number(amountPaise) / 100).toFixed(2);
    setPrefilledAmount(rupees);
    const element = document.getElementById("settlement-proposal-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-7">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-mint"
      >
        ← All groups
      </Link>

      {notice?.notice && (
        <div className="flex flex-col justify-between gap-2 rounded-xl border border-mint/30 bg-mint/10 p-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm text-mint">
            <CheckCircle2 size={18} />
            <span>{notice.notice}</span>
          </div>
          {notice.txHash && (
            <div className="font-mono text-xs text-slate-400">
              Tx: {memberLabel(notice.txHash)}
              {notice.explorerUrl && (
                <a
                  href={notice.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-mint underline hover:text-white"
                >
                  View on Explorer <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {actionResult && (
        <div className="flex flex-col justify-between gap-2 rounded-xl border border-mint/30 bg-mint/10 p-4 sm:flex-row sm:items-center">
          <span className="text-sm text-mint">{actionResult.message}</span>
          {actionResult.txHash && (
            <div className="font-mono text-xs text-slate-400">
              Tx: {memberLabel(actionResult.txHash)}
              {actionResult.explorerUrl && (
                <a
                  href={actionResult.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 inline-flex items-center gap-1 text-mint underline hover:text-white"
                >
                  View on Explorer <ArrowUpRight size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-mint">Group #{group.id.toString()}</p>
          <h1 className="mt-2 text-3xl font-semibold">{group.title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {group.members.length} members · Created{" "}
            {new Date(Number(group.createdAt) * 1000).toLocaleDateString()}
          </p>
        </div>
        <Link
          to={`/groups/${group.id}/expenses/new`}
          className="inline-flex items-center gap-2 rounded-xl bg-mint px-4 py-3 text-sm font-semibold text-ink"
        >
          <Plus size={16} /> Add expense
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-panel p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Your net balance
          </p>
          <p
            className={`mt-3 text-2xl font-semibold ${
              you && you.netPaise >= 0n ? "text-mint" : "text-rose-300"
            }`}
          >
            {formatPaiseToRupees(you?.netPaise || 0n)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {you && you.netPaise > 0n
              ? "You are owed"
              : you && you.netPaise < 0n
                ? "You owe"
                : "Settled up"}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Total outstanding credit
          </p>
          <p className="mt-3 text-2xl font-semibold">
            {formatPaiseToRupees(owed)}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Across all group members
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-panel p-5">
          <p className="text-xs uppercase tracking-widest text-slate-500">
            Recorded settlements
          </p>
          <p className="mt-3 text-2xl font-semibold">{settlements.length}</p>
          <p className="mt-1 text-xs text-slate-500">
            Proposed, confirmed and rejected
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <section className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center gap-2">
            <Users className="text-mint" size={18} />
            <h2 className="font-semibold">Members & balances</h2>
          </div>
          <div className="mt-5 space-y-4">
            {balances.map((b) => (
              <div
                key={b.member}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-mono text-xs">{b.member}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {b.member.toLowerCase() === group.creator.toLowerCase()
                      ? "Group creator"
                      : "Member"}
                    {b.member.toLowerCase() === address.toLowerCase()
                      ? " · You"
                      : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    b.netPaise > 0n
                      ? "text-mint"
                      : b.netPaise < 0n
                        ? "text-rose-300"
                        : "text-slate-400"
                  }`}
                >
                  {formatPaiseToRupees(b.netPaise)}
                </span>
              </div>
            ))}
          </div>
          {address.toLowerCase() === group.creator.toLowerCase() &&
            group.active && (
              <form
                onSubmit={addMember}
                className="mt-5 border-t border-line pt-4"
              >
                <label className="block text-xs text-slate-400">
                  Add member wallet address
                  <input
                    className="field mt-2"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    placeholder="0x…"
                  />
                </label>
                <button
                  disabled={acting === "add-member" || !newMember.trim()}
                  className="mt-2 rounded-lg border border-line px-3 py-2 text-xs text-mint disabled:opacity-50"
                >
                  {acting === "add-member" ? "Adding…" : "Add member"}
                </button>
              </form>
            )}
        </section>

        <section className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="text-mint" size={18} />
            <h2 className="font-semibold">Settlement activity</h2>
          </div>
          {settlements.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">
              No settlement proposals yet.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {[...settlements].reverse().map((s) => (
                <div
                  key={s.settlementId.toString()}
                  className="flex items-center justify-between gap-3 border-b border-line pb-3 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs">
                      {memberLabel(s.debtor)} → {memberLabel(s.creditor)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Settlement #{s.settlementId.toString()} ·{" "}
                      <span
                        className={
                          s.status === "CONFIRMED"
                            ? "text-mint font-medium"
                            : s.status === "REJECTED"
                              ? "text-rose-300"
                              : "text-amber-200"
                        }
                      >
                        {s.status}
                      </span>
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatPaiseToRupees(s.amountPaise)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Automatic Settlement Suggestions */}
      {suggestions.length > 0 && (
        <section className="rounded-2xl border border-line bg-panel p-5">
          <div className="flex items-center gap-2">
            <Scale className="text-mint" size={18} />
            <h2 className="font-semibold">Automatic settlement suggestions</h2>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Calculated to simplify all outstanding balances with the minimum
            number of payments.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((item, idx) => {
              const isMyDebt =
                item.debtor.toLowerCase() === address.toLowerCase();
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-xl border border-line/70 bg-ink p-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Suggestion #{idx + 1}</span>
                      {isMyDebt && (
                        <span className="rounded-full bg-rose-400/10 px-2 py-0.5 text-[10px] text-rose-300">
                          Your debt
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {memberLabel(item.debtor)}
                      <span className="mx-1 text-slate-500">pays</span>
                      {memberLabel(item.creditor)}
                    </p>
                    <p className="mt-2 text-xl font-bold text-mint">
                      {formatPaiseToRupees(item.amountPaise)}
                    </p>
                  </div>
                  {isMyDebt && (
                    <button
                      onClick={() =>
                        handleUseSuggestion(item.creditor, item.amountPaise)
                      }
                      className="mt-3 inline-flex items-center justify-center gap-1 rounded-lg bg-mint/10 px-3 py-1.5 text-xs font-semibold text-mint hover:bg-mint hover:text-ink transition"
                    >
                      Use suggestion <ArrowUpRight size={13} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-line bg-panel p-5">
        <div className="flex items-center gap-2">
          <Receipt className="text-mint" size={18} />
          <h2 className="font-semibold">Expense history</h2>
        </div>
        {expenses.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No expenses recorded yet. Add the first shared expense to start the
            ledger.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Expense</th>
                  <th className="pb-3 font-medium">Paid by</th>
                  <th className="pb-3 font-medium">Participants</th>
                  <th className="pb-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {[...expenses].reverse().map((e) => (
                  <tr
                    key={e.expenseId.toString()}
                    className="border-t border-line"
                  >
                    <td className="py-3">
                      <span className="font-medium">
                        Expense #{e.expenseId.toString()}
                      </span>
                      <span className="mt-1 block text-[11px] text-slate-500">
                        {new Date(Number(e.createdAt) * 1000).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-xs">
                      {memberLabel(e.payer)}
                      {e.payer.toLowerCase() === address.toLowerCase()
                        ? " (You)"
                        : ""}
                    </td>
                    <td className="py-3 text-xs text-slate-400">
                      {e.participants.length} people
                    </td>
                    <td className="py-3 text-right font-semibold">
                      {formatPaiseToRupees(e.totalAmountPaise)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {pendingForMe.length > 0 && (
        <section className="rounded-2xl border border-mint/30 bg-mint/[.04] p-5">
          <h2 className="font-semibold text-mint">
            Settlement requests for you
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Review each request. Confirm only after you have independently
            checked the off-chain payment.
          </p>
          <div className="mt-4 space-y-3">
            {pendingForMe.map((s) => (
              <div
                key={s.settlementId.toString()}
                className="flex flex-col justify-between gap-3 rounded-xl border border-line bg-panel p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm">
                    {memberLabel(s.debtor)} proposes{" "}
                    <strong>{formatPaiseToRupees(s.amountPaise)}</strong>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Settlement #{s.settlementId.toString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    disabled={!!acting}
                    onClick={() => settleAction(s.settlementId, "reject")}
                    className="rounded-lg border border-line px-3 py-2 text-xs text-slate-300 disabled:opacity-50"
                  >
                    {acting === `reject-${s.settlementId}`
                      ? "Rejecting…"
                      : "Reject"}
                  </button>
                  <button
                    disabled={!!acting}
                    onClick={() => settleAction(s.settlementId, "confirm")}
                    className="rounded-lg bg-mint px-3 py-2 text-xs font-semibold text-ink disabled:opacity-50"
                  >
                    {acting === `confirm-${s.settlementId}`
                      ? "Confirming…"
                      : "Confirm"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-amber-200/80">
            Confirmation records acknowledgement only. SplitChain does not
            transfer INR or verify UPI/bank payment.
          </p>
        </section>
      )}

      <div id="settlement-proposal-section">
        <SettlementProposal
          group={group}
          balances={balances}
          prefilledCreditor={prefilledCreditor}
          prefilledAmount={prefilledAmount}
          onProposed={async (tx) => {
            setActionResult({
              message: "Settlement proposal confirmed on blockchain!",
              txHash: tx.hash,
              explorerUrl: tx.explorerUrl,
            });
            await load();
          }}
        />
      </div>

      <p className="text-xs text-slate-500">
        Balances are calculated by the contract. Settlement acknowledgement
        records a user's confirmation; it does not move INR or prove an
        off-chain transfer.
      </p>
    </div>
  );
}

function SettlementProposal({
  group,
  balances,
  prefilledCreditor,
  prefilledAmount,
  onProposed,
}: {
  group: GroupRecord;
  balances: MemberBalance[];
  prefilledCreditor: string;
  prefilledAmount: string;
  onProposed: (tx: { hash: string; explorerUrl?: string }) => Promise<void>;
}) {
  const { address, repository } = useWallet();
  const [creditor, setCreditor] = useState(prefilledCreditor);
  const [amount, setAmount] = useState(prefilledAmount);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (prefilledCreditor) setCreditor(prefilledCreditor);
    if (prefilledAmount) setAmount(prefilledAmount);
  }, [prefilledCreditor, prefilledAmount]);

  if (!address || !group) return null;
  const me = balances.find(
    (b) => b.member.toLowerCase() === address.toLowerCase(),
  );
  const creditors = balances.filter(
    (b) => b.netPaise > 0n && b.member.toLowerCase() !== address.toLowerCase(),
  );
  if (!me || me.netPaise >= 0n) return null;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (!repository) throw new Error("Wallet not connected.");
      const paise = parseRupeesToPaise(amount);
      if (!creditor) throw new Error("Choose a creditor.");
      if (paise <= 0n || paise > 0n - me.netPaise)
        throw new Error("Amount exceeds your outstanding group debt.");
      setBusy(true);
      const tx = await repository.proposeSettlement(
        group.id,
        creditor as `0x${string}`,
        paise,
        ("0x" + "0".repeat(64)) as `0x${string}`,
      );
      setMessage(
        `Proposal confirmed: ${tx.hash}. The creditor must acknowledge it.`,
      );
      setAmount("");
      setCreditor("");
      await onProposed(tx);
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Could not propose settlement.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-panel p-5"
    >
      <h3 className="font-semibold">Propose a settlement</h3>
      <p className="mt-1 text-sm text-slate-400">
        Your outstanding net debt:{" "}
        <strong className="text-rose-300">
          {formatPaiseToRupees(0n - me.netPaise)}
        </strong>
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select
          className="field"
          value={creditor}
          onChange={(e) => setCreditor(e.target.value)}
        >
          <option value="">Choose creditor</option>
          {creditors.map((c) => (
            <option key={c.member} value={c.member}>
              {c.member.slice(0, 8)}… · owed {formatPaiseToRupees(c.netPaise)}
            </option>
          ))}
        </select>
        <input
          className="field"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount in ₹"
          inputMode="decimal"
        />
      </div>
      <button
        disabled={busy || !creditors.length}
        className="mt-3 rounded-xl bg-mint px-4 py-2.5 text-sm font-semibold text-ink disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Propose acknowledgement"}
      </button>
      <p className="mt-3 text-xs text-amber-200/80">
        This records a proposal only. It does not transfer INR or verify a
        bank/UPI payment.
      </p>
      {message && (
        <p className="mt-2 break-all text-xs text-slate-300">{message}</p>
      )}
    </form>
  );
}
