import { describe, it, expect } from "vitest";
import { parseRupeesToPaise, formatPaiseToRupees } from "./money";
import { equalSplit, validateExactSplit } from "./split";
import { calculateMemberBalances } from "./accounting";
const A = "0x0000000000000000000000000000000000000001" as const;
const B = "0x0000000000000000000000000000000000000002" as const;
const C = "0x0000000000000000000000000000000000000003" as const;
describe("money", () => {
  it("converts rupees without floating point", () => {
    expect(parseRupeesToPaise("12.34")).toBe(1234n);
    expect(formatPaiseToRupees(-1234n)).toBe("-₹12.34");
  });
  it("rejects more than two decimal places", () => {
    expect(() => parseRupeesToPaise("1.234")).toThrow();
  });
});
describe("split", () => {
  it("allocates remainder deterministically", () => {
    const s = equalSplit(100n, [C, A, B]);
    expect(s.map((x) => x.participant)).toEqual([A, B, C]);
    expect(s.map((x) => x.amountPaise)).toEqual([34n, 33n, 33n]);
  });
  it("validates exact split", () => {
    expect(() =>
      validateExactSplit(100n, [
        { participant: A, amountPaise: 50n },
        { participant: B, amountPaise: 50n },
      ]),
    ).not.toThrow();
    expect(() =>
      validateExactSplit(100n, [
        { participant: A, amountPaise: 50n },
        { participant: B, amountPaise: 40n },
      ]),
    ).toThrow();
  });
});
describe("accounting", () => {
  it("matches the blueprint trip vector", () => {
    const expenses: any = [
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
    ];
    const balances = calculateMemberBalances([A, B, C], expenses, []);
    expect(balances.map((b) => b.netPaise)).toEqual([40000n, 10000n, -50000n]);
  });
});
