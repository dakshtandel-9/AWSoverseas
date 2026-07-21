"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/server";
import { getAccount } from "@/lib/account";
import { getWalletSummary } from "@/lib/wallet";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/wallet-constants";

export type BankDetailsFormState = { error?: string; success?: boolean };

export async function updateBankDetailsAction(
  _prevState: BankDetailsFormState,
  formData: FormData,
): Promise<BankDetailsFormState> {
  const account = await getAccount();
  if (!account) return { error: "Your session expired — please sign in again." };

  const accountNumber = String(formData.get("bank-account-number") ?? "").trim();
  const accountHolder = String(formData.get("bank-account-holder") ?? "").trim();
  const bankName = String(formData.get("bank-name") ?? "").trim();
  const ifsc = String(formData.get("bank-ifsc") ?? "")
    .trim()
    .toUpperCase();

  if (!accountNumber || !accountHolder || !bankName || !ifsc) {
    return { error: "Please fill in all bank details." };
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("user_profiles")
    .update({
      bank_account_number: accountNumber,
      bank_account_holder: accountHolder,
      bank_name: bankName,
      bank_ifsc: ifsc,
    })
    .eq("id", account.user.id);

  if (error) return { error: "Something went wrong saving your bank details. Please try again." };

  revalidatePath("/profile/wallet");
  return { success: true };
}

export async function requestWithdrawalAction(
  amount: number,
): Promise<{ ok: boolean; error?: string }> {
  const account = await getAccount();
  if (!account) return { ok: false, error: "Your session expired — please sign in again." };
  if (!amount || amount < MIN_WITHDRAWAL_AMOUNT) {
    return { ok: false, error: `Minimum withdrawal is $${MIN_WITHDRAWAL_AMOUNT}` };
  }

  const { profile } = account;
  if (!profile.bank_account_number || !profile.bank_account_holder || !profile.bank_name || !profile.bank_ifsc) {
    return { ok: false, error: "Add your bank details before requesting a withdrawal" };
  }

  const summary = await getWalletSummary(profile.id);
  if (amount > summary.available) {
    return { ok: false, error: "That's more than your available balance" };
  }

  const db = supabaseAdmin();
  const { error } = await db.from("wallet_withdrawals").insert({
    user_id: profile.id,
    amount,
    bank_account_number: profile.bank_account_number,
    bank_account_holder: profile.bank_account_holder,
    bank_name: profile.bank_name,
    bank_ifsc: profile.bank_ifsc,
  });

  if (error) return { ok: false, error: "Could not submit your withdrawal request. Please try again." };

  revalidatePath("/profile/wallet");
  revalidatePath("/profile");
  return { ok: true };
}
