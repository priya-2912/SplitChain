import { describe, expect, it } from "vitest";
import { calculateMemberBalances } from "./accounting";
import type { Address, ExpenseRecord, SettlementRecord } from "../types/domain";

const A = "0x0000000000000000000000000000000000000001" as Address;
const B = "0x0000000000000000000000000000000000000002" as Address;
const C = "0x0000000000000000000000000000000000000003" as Address;
const expenses = [
  {
    payer: A,
    totalAmountPaise: 90000n,
    participants: [A, B, C],
    shares: [30000n, 30000n, 30000n],
  },
  {
    payer: B,
    totalAmountPaise: 60000n,
    participants: [A, B, C],
    shares: [20000n, 20000n, 20000n],
  },
] as unknown as ExpenseRecord[];
const settlement = (
  id: bigint,
  debtor: Address,
  creditor: Address,
  amountPaise: bigint,
  status: SettlementRecord["status"],
): SettlementRecord => ({
  settlementId: id,
  groupId: 1n,
  debtor,
  creditor,
  amountPaise,
  status,
  createdAt: 0n,
  referenceHash: `0x${"0".repeat(64)}` as `0x${string}`,
});

describe("shared SplitChain accounting vector", () => {
  it("does not change balances for proposed or rejected settlements", () => {
    const result = calculateMemberBalances([A, B, C], expenses, [
      settlement(1n, C, A, 40000n, "PROPOSED"),
      settlement(2n, C, B, 10000n, "REJECTED"),
    ]);
    expect(result.map((x) => x.netPaise)).toEqual([40000n, 10000n, -50000n]);
  });
  it("matches the full two-step confirmed settlement vector", () => {
    const result = calculateMemberBalances([A, B, C], expenses, [
      settlement(1n, C, A, 40000n, "CONFIRMED"),
      settlement(2n, C, B, 10000n, "CONFIRMED"),
    ]);
    expect(result.map((x) => x.netPaise)).toEqual([0n, 0n, 0n]);
  });
});
