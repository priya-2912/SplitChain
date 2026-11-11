import type {
  Address,
  ExpenseRecord,
  MemberBalance,
  SettlementRecord,
} from "../types/domain";
export function calculateMemberBalances(
  members: Address[],
  expenses: ExpenseRecord[],
  settlements: SettlementRecord[],
): MemberBalance[] {
  const net = new Map<string, bigint>(
    members.map((m) => [m.toLowerCase(), 0n]),
  );
  for (const expense of expenses) {
    net.set(
      expense.payer.toLowerCase(),
      (net.get(expense.payer.toLowerCase()) ?? 0n) + expense.totalAmountPaise,
    );
    expense.participants.forEach((participant, i) =>
      net.set(
        participant.toLowerCase(),
        (net.get(participant.toLowerCase()) ?? 0n) - expense.shares[i],
      ),
    );
  }
  for (const settlement of settlements.filter(
    (s) => s.status === "CONFIRMED",
  )) {
    net.set(
      settlement.debtor.toLowerCase(),
      (net.get(settlement.debtor.toLowerCase()) ?? 0n) + settlement.amountPaise,
    );
    net.set(
      settlement.creditor.toLowerCase(),
      (net.get(settlement.creditor.toLowerCase()) ?? 0n) -
        settlement.amountPaise,
    );
  }
  return members.map((member) => ({
    member,
    netPaise: net.get(member.toLowerCase()) ?? 0n,
  }));
}
export function suggestSettlements(balances: MemberBalance[]) {
  const debtors = balances
    .filter((b) => b.netPaise < 0n)
    .map((b) => ({ member: b.member, remaining: -b.netPaise }));
  const creditors = balances
    .filter((b) => b.netPaise > 0n)
    .map((b) => ({ member: b.member, remaining: b.netPaise }));
  const suggestions: {
    debtor: Address;
    creditor: Address;
    amountPaise: bigint;
  }[] = [];
  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount =
      debtors[i].remaining < creditors[j].remaining
        ? debtors[i].remaining
        : creditors[j].remaining;
    if (amount > 0n)
      suggestions.push({
        debtor: debtors[i].member,
        creditor: creditors[j].member,
        amountPaise: amount,
      });
    debtors[i].remaining -= amount;
    creditors[j].remaining -= amount;
    if (debtors[i].remaining === 0n) i++;
    if (creditors[j].remaining === 0n) j++;
  }
  return suggestions;
}
