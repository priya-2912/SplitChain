# Deployment

## Local
1. Start node: `npm run node -w contracts`.
2. Deploy: `npm run deploy:local`.
3. Configure MetaMask local network at `http://127.0.0.1:8545`, chain ID `31337`.
4. Set frontend `VITE_CHAIN_ID=31337` and `VITE_CONTRACT_ADDRESS` to deployed address.
5. Run `npm run dev`.

## Sepolia
1. Create a dedicated test-only deployer wallet.
2. Put RPC URL and private key in `contracts/.env`; never commit this file.
3. Run `npm run deploy:sepolia`.
4. Set frontend chain ID to `11155111` and address to the deployment output.
5. Connect MetaMask to Sepolia and use test ETH only.

A contract address is valid only on its deployment network. Re-deployment changes the address. Verify the chain before every write. Never use mainnet or real funds for this academic MVP.
