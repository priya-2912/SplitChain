export type Address = `0x${string}`;
export type SplitMode = "EQUAL" | "EXACT";
export type SettlementStatus =
  "PROPOSED" | "CONFIRMED" | "REJECTED" | "CANCELLED";
export interface Share {
  participant: Address;
  amountPaise: bigint;
}
export interface GroupRecord {
  id: bigint;
  creator: Address;
  createdAt: bigint;
  active: boolean;
  title: string;
  members: Address[];
}
export interface ExpenseInput {
  groupId: bigint;
  payer: Address;
  totalAmountPaise: bigint;
  participants: Address[];
  shares: bigint[];
  descriptionHash: `0x${string}`;
  splitMode: SplitMode;
  description?: string;
}
export interface ExpenseRecord extends ExpenseInput {
  expenseId: bigint;
  createdAt: bigint;
  transactionHash: string;
}
export interface SettlementRecord {
  settlementId: bigint;
  groupId: bigint;
  debtor: Address;
  creditor: Address;
  amountPaise: bigint;
  status: SettlementStatus;
  createdAt: bigint;
  referenceHash: `0x${string}`;
  transactionHash?: string;
}
export interface MemberBalance {
  member: Address;
  netPaise: bigint;
}
export interface TxResult {
  hash: string;
  explorerUrl: string;
}
export interface SplitChainRepository {
  createGroup(title: string, members: Address[]): Promise<TxResult>;
  addMember(groupId: bigint, member: Address): Promise<TxResult>;
  getGroup(groupId: bigint): Promise<GroupRecord>;
  getMyGroups(address: Address): Promise<GroupRecord[]>;
  addExpense(input: ExpenseInput): Promise<TxResult>;
  getExpenses(groupId: bigint): Promise<ExpenseRecord[]>;
  getBalances(groupId: bigint, members: Address[]): Promise<MemberBalance[]>;
  proposeSettlement(
    groupId: bigint,
    creditor: Address,
    amount: bigint,
    referenceHash: `0x${string}`,
  ): Promise<TxResult>;
  confirmSettlement(settlementId: bigint): Promise<TxResult>;
  rejectSettlement(settlementId: bigint): Promise<TxResult>;
  getSettlements(groupId: bigint): Promise<SettlementRecord[]>;
}
