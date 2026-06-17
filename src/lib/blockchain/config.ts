import { createPublicClient, createWalletClient, http, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import contractData from "./contract.json";

const AMOY_CHAIN_ID = 80002;

const polygonAmoy: Chain = {
    id: AMOY_CHAIN_ID,
    name: "Polygon Amoy",
    rpcUrls: {
        default: {
            http: [
                process.env.EXPO_PUBLIC_POLYGON_RPC_URL ||
                "https://rpc-amoy.polygon.technology",
            ],
        },
    },
    nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
    blockExplorers: {
        default: { name: "PolygonScan", url: "https://amoy.polygonscan.com" },
    },
    testnet: true,
};

const AMOY_RPC_URL =
    process.env.EXPO_PUBLIC_POLYGON_RPC_URL || "https://rpc-amoy.polygon.technology";

const CONTRACT_ADDRESS =
    process.env.EXPO_PUBLIC_CONTRACT_ADDRESS || contractData.address;

const DEPLOYER_PRIVATE_KEY = process.env.EXPO_PUBLIC_DEPLOYER_PRIVATE_KEY || "";

export const publicClient = createPublicClient({
    transport: http(AMOY_RPC_URL),
    chain: polygonAmoy,
});

export const account = DEPLOYER_PRIVATE_KEY
    ? privateKeyToAccount(DEPLOYER_PRIVATE_KEY as `0x${string}`)
    : null;

export const walletClient = account
    ? createWalletClient({
        account,
        transport: http(AMOY_RPC_URL),
        chain: polygonAmoy,
    })
    : null;

export const contractConfig = {
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: contractData.abi,
} as const;

export function getPolygonScanUrl(txHash: string): string {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
}

export { AMOY_CHAIN_ID, AMOY_RPC_URL, CONTRACT_ADDRESS, polygonAmoy };
