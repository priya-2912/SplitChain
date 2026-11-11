# SplitChain API contract (v1)

The Solidity contract in `contracts/contracts/SplitChain.sol` is canonical. Do not hand-edit the frontend ABI; the deploy script exports the compiler artifact to `shared/contract-interface/SplitChain.json`.

## Fixed conventions
- Chain: Hardhat local `31337`; Sepolia `11155111`.
- Currency: integer paise; ₹1 = 100 paise. No floating-point arithmetic.
- IDs: Solidity `uint256`; TypeScript `bigint`.
- Split mode: `EQUAL` / `EXACT` in TypeScript; Solidity receives the final participant/share arrays.
- Settlement status: `0 PROPOSED`, `1 CONFIRMED`, `2 REJECTED`, `3 CANCELLED` (reserved).
- Positive net balance means receive; negative means owe.

## Functions
`createGroup(string,address[])`, `addMember(uint256,address)`, `getGroup(uint256)`, `getMembers(uint256)`, `addExpense(uint256,address,uint256,address[],uint256[],bytes32)`, `getExpense(uint256)`, `getExpenseShares(uint256)`, `proposeSettlement(uint256,address,uint256,bytes32)`, `confirmSettlement(uint256)`, `rejectSettlement(uint256)`, `getSettlement(uint256)`, `getGroupExpenseIds(uint256)`, `getGroupSettlementIds(uint256)`, `getMemberNetBalance(uint256,address)`.

## Balance semantics
For each expense, payer net increases by total and every participant net decreases by their share. A confirmed settlement increases debtor net and decreases creditor net by its amount. Proposed/rejected settlements do not change balances. Proposal amount is bounded by debtor's negative net and creditor's positive net. The contract does not validate a specific real-world payment.
