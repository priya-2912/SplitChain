# SplitChain

Blockchain-based shared expense tracking and settlement acknowledgement. This academic MVP records group expenses, calculates balances, and lets a debtor propose a settlement that the creditor acknowledges. **It does not transfer INR, verify UPI/bank payments, or custody funds.**

## Stack
- React + TypeScript + Vite + Tailwind CSS
- Solidity + Hardhat
- ethers.js v6 + MetaMask
- Hardhat local chain for development; Ethereum Sepolia (chain ID `11155111`) for demo

## Requirements
- Node.js 20.x and npm
- MetaMask browser extension
- Git

## Quick start

```bash
npm install
cp contracts/.env.example contracts/.env
cp frontend/.env.example frontend/.env
npm run compile
npm run test:contracts
npm run test:frontend
# Commit the generated package-lock.json so the team can use npm ci
```

### Run locally
Terminal 1:
```bash
npm run node -w contracts
```
Terminal 2:
```bash
npm run deploy:local
```
Copy the printed contract address into `frontend/.env` as `VITE_CONTRACT_ADDRESS`. Add the Hardhat local network to MetaMask (`http://127.0.0.1:8545`, chain ID `31337`) and import a **local test account only** using a private key printed by your local Hardhat node. Never use a real wallet key here.

Terminal 3:
```bash
npm run dev
```
Open the Vite URL. Connect MetaMask and use the local network.

### Sepolia demo
Set `SEPOLIA_RPC_URL`, `DEPLOYER_PRIVATE_KEY` (dedicated test-only account), and optionally `ETHERSCAN_API_KEY` in `contracts/.env`. Deploy with `npm run deploy:sepolia`, then set `VITE_CHAIN_ID=11155111` and the deployed address in `frontend/.env`. Fund only with Sepolia test ETH. The deployer key is used only by Hardhat and is never bundled into the frontend.

## Project structure
- `contracts/`: Solidity contract, Hardhat config, deploy script, contract tests
- `frontend/`: React app, wallet integration, group/expense/balance/settlement features
- `shared/contract-interface/`: canonical ABI and per-network address manifest
- `docs/`: interface, testing and deployment notes

## Important accounting rules
- INR is represented as integer paise: ₹125.50 = `12550n`.
- Equal split distributes remainder paise in ascending normalized wallet-address order.
- Positive net balance means the member should receive; negative means they owe.
- Only a **confirmed** settlement changes balances.
- Public-chain data is public forever. Never write names, emails, phone numbers, bank details, or receipts to the chain.

## Current limitations
This is an academic prototype, not a production financial product or security audit. Group titles and expense descriptions are stored as hashes on-chain; the UI retains local labels only for the current browser session. A production-grade cross-device description experience would require an explicitly designed off-chain metadata/indexing layer. Settlement confirmation is an acknowledgement, not proof of payment.
