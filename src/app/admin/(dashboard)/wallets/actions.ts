"use server";

import { revalidatePath } from "next/cache";
import { adjustWalletBalance } from "@/lib/wallet";

export async function adjustWalletAction(
  userId: string,
  direction: "add" | "deduct",
  amount: number,
  reason: string,
): Promise<{ ok: boolean; error?: string }> {
  const result = await adjustWalletBalance(userId, direction, amount, reason);
  if (!result.ok) return result;

  revalidatePath("/admin/wallets");
  // The customer's own view of the same ledger.
  revalidatePath("/profile/wallet");
  revalidatePath("/profile");
  return { ok: true };
}
