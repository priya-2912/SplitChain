import { ethers, artifacts, network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

async function main() {
  if (network.name === "sepolia" && (!process.env.SEPOLIA_RPC_URL || !process.env.DEPLOYER_PRIVATE_KEY)) throw new Error("Set SEPOLIA_RPC_URL and DEPLOYER_PRIVATE_KEY in contracts/.env before Sepolia deployment.");
  const factory = await ethers.getContractFactory("SplitChain");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const artifact = await artifacts.readArtifact("SplitChain");
  const sharedDir = path.resolve(__dirname, "../../shared/contract-interface");
  fs.mkdirSync(sharedDir, { recursive: true });
  fs.writeFileSync(path.join(sharedDir, "SplitChain.json"), JSON.stringify(artifact.abi, null, 2));
  const manifestPath = path.join(sharedDir, "contract-addresses.json");
  let manifest: Record<string, unknown> = {};
  if (fs.existsSync(manifestPath)) manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest[String(network.config.chainId)] = { address, network: network.name, deployedAt: new Date().toISOString() };
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`SplitChain deployed on ${network.name} at ${address}`);
  console.log(`ABI and address manifest exported to ${sharedDir}`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
