"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, verifyPassword, SESSION_COOKIE } from "@/lib/auth/session";

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  if (!password || !(await verifyPassword(password))) {
    return { error: "Incorrect password." };
  }

  const { token, maxAge } = await createSessionToken();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  redirect("/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
