import { hash, verify } from "@node-rs/argon2";

const ARGON_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

// Fixed dummy hash for constant-time comparison on unknown users
let cachedDummyHash: string | null = null;

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(
  hashVal: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(hashVal, password);
  } catch {
    return false;
  }
}

export async function verifyDummyPassword(password: string): Promise<void> {
  if (!cachedDummyHash) {
    cachedDummyHash = await hashPassword("DUMMY_PASSWORD_SLOTSWAP_12345");
  }
  await verifyPassword(cachedDummyHash, password);
}
