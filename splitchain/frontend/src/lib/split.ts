import { getAddress } from "ethers";
import type { Address, Share } from "../types/domain";
export function equalSplit(
  totalPaise: bigint,
  participants: Address[],
): Share[] {
  if (totalPaise <= 0n) throw new Error("Total must be positive.");
  if (!participants.length) throw new Error("Choose at least one participant.");
  const normalized = participants
    .map((p) => getAddress(p) as Address)
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  if (
    new Set(normalized.map((p) => p.toLowerCase())).size !== normalized.length
  )
    throw new Error("Participants must be unique.");
  const base = totalPaise / BigInt(normalized.length);
  const remainder = totalPaise % BigInt(normalized.length);
  return normalized.map((participant, i) => ({
    participant,
    amountPaise: base + (BigInt(i) < remainder ? 1n : 0n),
  }));
}
export function validateExactSplit(totalPaise: bigint, shares: Share[]): void {
  if (totalPaise <= 0n || !shares.length)
    throw new Error("Total and participant list must be positive.");
  if (shares.some((s) => s.amountPaise <= 0n))
    throw new Error("Every share must be greater than zero.");
  if (
    new Set(shares.map((s) => getAddress(s.participant).toLowerCase())).size !==
    shares.length
  )
    throw new Error("Participants must be unique.");
  if (shares.reduce((sum, s) => sum + s.amountPaise, 0n) !== totalPaise)
    throw new Error("Shares must add up exactly to the total.");
}
