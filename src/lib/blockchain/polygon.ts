import {
  publicClient,
  walletClient,
  contractConfig,
  polygonAmoy,
} from "./config";

export async function recordHashOnChain(
  passportId: string,
  contentHash: string
): Promise<{ txHash: string; blockNumber: number }> {
  if (!walletClient) {
    throw new Error("Wallet not configured: EXPO_PUBLIC_DEPLOYER_PRIVATE_KEY is not set");
  }

  const hash = await walletClient.writeContract({
    ...contractConfig,
    functionName: "anchorHash",
    args: [passportId, contentHash as `0x${string}`],
    chain: polygonAmoy,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt) {
    throw new Error("Transaction not confirmed");
  }

  return {
    txHash: receipt.transactionHash,
    blockNumber: Number(receipt.blockNumber),
  };
}

export async function verifyHashOnChain(
  contentHash: string
): Promise<{
  exists: boolean;
  passportId: string;
  timestamp: number;
  recorder: string;
}> {
  const [exists, passportId, timestamp, recorder] = await publicClient.readContract({
    ...contractConfig,
    functionName: "verifyHash",
    args: [contentHash as `0x${string}`],
  });

  return {
    exists: exists as boolean,
    passportId: passportId as string,
    timestamp: Number(timestamp),
    recorder: recorder as string,
  };
}
