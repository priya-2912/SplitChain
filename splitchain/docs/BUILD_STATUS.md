# Build status / scope notes

Implemented in this repository: Solidity group/expense/settlement contract; Hardhat deployment and contract tests; wallet connection and network switch; ethers v6 repository adapter; dashboard and group creation/details; creator member management; expense form with equal/exact split; expense history; on-chain balances; settlement proposal and creditor confirm/reject actions; pure accounting and split logic; shared ABI/address export; setup and QA docs.

Known MVP limitations before treating this as release-ready:
- The UI waits for a transaction receipt before showing the final hash; it does not yet expose a separate persistent Submitted state while the transaction is pending.
- There is no separate settlement-detail route, activity indexer, or group-close screen. Settlement review is available in the group details view.
- Group discovery scans events from block zero and is suitable only for a small classroom demo; an indexer/pagination is needed for scale.
- Group titles are stored in contract state and are publicly visible. Expense descriptions are represented only by a hash and are not recoverable across devices in this MVP.
- The MVP does not transfer INR, verify UPI/bank payment, or prove that expense entries are genuine.
- No external security audit has been performed. This is not production-ready.

The dependencies are installed and all tests have passed:
- Hardhat compilation: successful (1 Solidity file, 6 TypeChain typings)
- Hardhat contract tests: 8/8 passing
- Vitest unit tests: 7/7 passing
- Frontend TypeScript typecheck and Vite production build: successful
- ESLint and Prettier formatting: 0 errors, 0 warnings

Deployment, wallet approvals, and Sepolia funding require actions by the project team.
