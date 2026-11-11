export const NETWORKS: Record<
  number,
  { name: string; explorer: string; hexChainId: string }
> = {
  31337: {
    name: "Hardhat Local",
    explorer: "http://127.0.0.1:8545",
    hexChainId: "0x7a69",
  },
  11155111: {
    name: "Sepolia",
    explorer: "https://sepolia.etherscan.io",
    hexChainId: "0xaa36a7",
  },
};
export const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 31337);
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
