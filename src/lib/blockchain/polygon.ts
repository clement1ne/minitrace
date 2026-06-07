import { getProvider, getSigner, getContract } from "./config";

function toBytes32(hex: string): string {
  const clean = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (clean.length !== 64) {
    throw new Error(`Hash must be 32 bytes (64 hex chars). Got ${clean.length} chars.`);
  }
  return "0x" + clean;
}

export async function recordHashOnChain(
  passportId: string,
  contentHash: string
): Promise<{ txHash: string; blockNumber: number }> {
  const signer = getSigner();
  const contract = getContract(signer);
  const bytes32Hash = toBytes32(contentHash);

  const tx = await contract.anchorHash(passportId, bytes32Hash);
  const receipt = await tx.wait(1);

  if (!receipt) {
    throw new Error("Transaction not confirmed");
  }

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
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
  const provider = getProvider();
  const contract = getContract(provider);
  const bytes32Hash = toBytes32(contentHash);

  const [exists, passportId, timestamp, recorder] = await contract.verifyHash(bytes32Hash);

  return {
    exists,
    passportId,
    timestamp: Number(timestamp),
    recorder,
  };
}

