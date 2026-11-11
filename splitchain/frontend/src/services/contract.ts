import {
  BrowserProvider,
  Contract,
  getAddress,
  keccak256,
  toUtf8Bytes,
  type Signer,
} from "ethers";
import abi from "../../../shared/contract-interface/SplitChain.json";
import { CONTRACT_ADDRESS, NETWORKS } from "../config/networks";
import type {
  Address,
  ExpenseInput,
  ExpenseRecord,
  GroupRecord,
  SettlementRecord,
  SplitChainRepository,
  TxResult,
} from "../types/domain";

export interface Eip1193Provider {
  request(args: { method: string; params?: unknown[] }): Promise<unknown>;
  on?(event: string, listener: (value: unknown) => void): void;
  removeListener?(event: string, listener: (value: unknown) => void): void;
}
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
export class WalletService {
  provider: BrowserProvider | null = null;
  signer: Signer | null = null;
  address: Address | null = null;
  chainId: number | null = null;
  async connect() {
    if (!window.ethereum)
      throw new Error(
        "MetaMask was not detected. Install MetaMask and reload this page.",
      );
    this.provider = new BrowserProvider(window.ethereum as never);
    await this.provider.send("eth_requestAccounts", []);
    this.signer = await this.provider.getSigner();
    this.address = getAddress(await this.signer.getAddress()) as Address;
    this.chainId = Number((await this.provider.getNetwork()).chainId);
    return { address: this.address, chainId: this.chainId };
  }
  async switchNetwork(chainId: number) {
    if (!window.ethereum) throw new Error("MetaMask was not detected.");
    const network = NETWORKS[chainId];
    if (!network) throw new Error("Unsupported network.");
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.hexChainId }],
      });
    } catch {
      throw new Error(
        "Could not switch network in MetaMask. Add the network manually and try again.",
      );
    }
    await this.connect();
  }
  async getNetworkId() {
    if (!this.provider) throw new Error("Connect wallet first.");
    this.chainId = Number((await this.provider.getNetwork()).chainId);
    return this.chainId;
  }
  async updateAccount(account: string | null) {
    if (!account || !this.provider) {
      this.address = null;
      this.signer = null;
      return;
    }
    this.address = getAddress(account) as Address;
    this.signer = await this.provider.getSigner(this.address);
  }
  contract(write = false) {
    if (!this.provider || !this.chainId)
      throw new Error("Connect your wallet first.");
    if (!CONTRACT_ADDRESS)
      throw new Error(
        "Contract address is not configured. Deploy SplitChain and set VITE_CONTRACT_ADDRESS.",
      );
    const runner = write ? this.signer : this.provider;
    if (!runner) throw new Error("Wallet signer is unavailable.");
    return new Contract(CONTRACT_ADDRESS, abi, runner);
  }
  async send(
    tx: Promise<{
      hash: string;
      wait(): Promise<{ status: number | null; hash: string } | null>;
    }>,
  ): Promise<TxResult> {
    try {
      const pending = await tx;
      const receipt = await pending.wait();
      if (!receipt || receipt.status !== 1)
        throw new Error("Transaction failed on-chain.");
      const explorer =
        NETWORKS[this.chainId || 31337]?.explorer ||
        import.meta.env.VITE_EXPLORER_BASE_URL ||
        "";
      const explorerUrl =
        explorer &&
        !explorer.includes("127.0.0.1") &&
        !explorer.includes("localhost")
          ? `${explorer.replace(/\/+$/, "")}/tx/${pending.hash}`
          : "";
      return {
        hash: pending.hash,
        explorerUrl,
      };
    } catch (error) {
      const e = error as {
        code?: string;
        shortMessage?: string;
        message?: string;
        data?: { errorName?: string };
        errorName?: string;
      };
      if (e.code === "4001" || e.code === "ACTION_REJECTED")
        throw new Error("Transaction was rejected in MetaMask.");
      const name = e.data?.errorName || e.errorName || "";
      const friendly: Record<string, string> = {
        NotGroupMember: "Your wallet is not a member of this group.",
        InvalidGroup: "This group is invalid or closed.",
        InvalidAddress: "Enter a valid non-zero wallet address.",
        DuplicateMember: "This wallet is already a group member.",
        InvalidAmount: "Amount must be greater than zero.",
        InvalidSplit: "The shares must add up exactly to the total.",
        InvalidParticipants: "Choose unique wallets that belong to this group.",
        NotAuthorized: "Your wallet is not authorized to perform this action.",
        InvalidSettlementState: "This settlement is no longer pending.",
        InsufficientOwedAmount:
          "The proposed amount exceeds the available balance.",
        SelfSettlement: "You cannot settle with your own wallet.",
      };
      if (friendly[name]) throw new Error(friendly[name]);
      throw new Error(
        e.shortMessage ||
          e.message ||
          "Transaction failed. Check your network and test ETH balance.",
      );
    }
  }
}
export class EthersSplitChainRepository implements SplitChainRepository {
  constructor(private wallet: WalletService) {}
  async createGroup(title: string, members: Address[]) {
    return this.wallet.send(
      this.wallet.contract(true).createGroup(title, members),
    );
  }
  async addMember(groupId: bigint, member: Address) {
    return this.wallet.send(
      this.wallet.contract(true).addMember(groupId, member),
    );
  }
  async getGroup(groupId: bigint): Promise<GroupRecord> {
    const c = this.wallet.contract();
    const [g, members] = await Promise.all([
      c.getGroup(groupId),
      c.getMembers(groupId),
    ]);
    return {
      id: g.id,
      creator: g.creator,
      createdAt: g.createdAt,
      active: g.active,
      title: g.title,
      members,
    };
  }
  async getMyGroups(address: Address): Promise<GroupRecord[]> {
    // Discover groups through GroupCreated logs; contract state remains authoritative.
    const c = this.wallet.contract();
    const created = c.filters.GroupCreated(null, address);
    const added = c.filters.MemberAdded(null, address);
    const [createdLogs, addedLogs] = await Promise.all([
      c.queryFilter(created, 0, "latest"),
      c.queryFilter(added, 0, "latest"),
    ]);
    const ids = [
      ...new Set(
        [...createdLogs, ...addedLogs].map((log: any) =>
          BigInt(log.args.groupId).toString(),
        ),
      ),
    ];
    const groups = await Promise.all(
      ids.map((id) => this.getGroup(BigInt(id))),
    );
    return groups.filter((g) => g.active);
  }
  async addExpense(input: ExpenseInput) {
    return this.wallet.send(
      this.wallet
        .contract(true)
        .addExpense(
          input.groupId,
          input.payer,
          input.totalAmountPaise,
          input.participants,
          input.shares,
          input.descriptionHash,
        ),
    );
  }
  async getExpenses(groupId: bigint): Promise<ExpenseRecord[]> {
    const c = this.wallet.contract();
    const ids: bigint[] = await c.getGroupExpenseIds(groupId);
    return Promise.all(
      ids.map(async (id) => {
        const [e, parts] = await Promise.all([
          c.getExpense(id),
          c.getExpenseShares(id),
        ]);
        return {
          expenseId: e.id,
          groupId: e.groupId,
          payer: e.payer,
          totalAmountPaise: e.totalAmount,
          createdAt: e.createdAt,
          descriptionHash: e.descriptionHash,
          participants: [...parts[0]],
          shares: [...parts[1]],
          splitMode: "EXACT" as const,
          transactionHash: "",
        };
      }),
    );
  }
  async getBalances(groupId: bigint, members: Address[]) {
    const c = this.wallet.contract();
    return Promise.all(
      members.map(async (member) => ({
        member,
        netPaise: await c.getMemberNetBalance(groupId, member),
      })),
    );
  }
  async proposeSettlement(
    groupId: bigint,
    creditor: Address,
    amount: bigint,
    referenceHash: `0x${string}`,
  ) {
    return this.wallet.send(
      this.wallet
        .contract(true)
        .proposeSettlement(groupId, creditor, amount, referenceHash),
    );
  }
  async confirmSettlement(id: bigint) {
    return this.wallet.send(this.wallet.contract(true).confirmSettlement(id));
  }
  async rejectSettlement(id: bigint) {
    return this.wallet.send(this.wallet.contract(true).rejectSettlement(id));
  }
  async getSettlements(groupId: bigint): Promise<SettlementRecord[]> {
    const c = this.wallet.contract();
    const ids: bigint[] = await c.getGroupSettlementIds(groupId);
    return Promise.all(
      ids.map(async (id) => {
        const s = await c.getSettlement(id);
        return {
          settlementId: s.id,
          groupId: s.groupId,
          debtor: s.debtor,
          creditor: s.creditor,
          amountPaise: s.amount,
          status: (["PROPOSED", "CONFIRMED", "REJECTED", "CANCELLED"][
            Number(s.status)
          ] || "PROPOSED") as SettlementRecord["status"],
          createdAt: s.createdAt,
          referenceHash: s.referenceHash,
        };
      }),
    );
  }
}
export const hashLabel = (value: string) => keccak256(toUtf8Bytes(value));
