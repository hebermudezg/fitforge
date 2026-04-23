import * as Crypto from 'expo-crypto';

export async function hashPassword(password: string): Promise<string> {
  // Use SHA-256 with the password itself as a simple hash
  // For local SQLite this is adequate — passwords never leave the device
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hash;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const inputHash = await hashPassword(password);
  return inputHash === hash;
}
