import { Contract, JsonRpcProvider, Wallet } from "ethers";
import contractData from "./contract.json";

const AMOY_CHAIN_ID = 80002;
const AMOY_RPC_URL =
  process.env.EXPO_PUBLIC_POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";
const CONTRACT_ADDRESS =
  process.env.EXPO_PUBLIC_CONTRACT_ADDRESS || contractData.address;
const DEPLOYER_PRIVATE_KEY = process.env.EXPO_PUBLIC_DEPLOYER_PRIVATE_KEY || "";

export function getProvider(): JsonRpcProvider {
  return new JsonRpcProvider(AMOY_RPC_URL, AMOY_CHAIN_ID);
}

export function getSigner(): Wallet {
  if (!DEPLOYER_PRIVATE_KEY) {
    throw new Error("EXPO_PUBLIC_DEPLOYER_PRIVATE_KEY is not set in .env.local");
  }
  return new Wallet(DEPLOYER_PRIVATE_KEY, getProvider());
}

export function getContract(signerOrProvider: Wallet | JsonRpcProvider): Contract {
  return new Contract(CONTRACT_ADDRESS, contractData.abi, signerOrProvider);
}

export function getPolygonScanUrl(txHash: string): string {
  return `https://amoy.polygonscan.com/tx/${txHash}`;
}

export { AMOY_CHAIN_ID, AMOY_RPC_URL, CONTRACT_ADDRESS };
