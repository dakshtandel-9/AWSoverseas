import type { Metadata } from "next";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login | aws overseas", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f8fc] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-[#e4e9f2] bg-white p-8 shadow-[0_1px_2px_rgba(4,22,47,0.04),0_18px_40px_-16px_rgba(4,22,47,0.14)]">
        <Logo />
        <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">
          Admin Access
        </p>
        <h1 className="mt-2 text-2xl font-bold text-[#002144]">Sign in to the dashboard</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5b6b82]">
          Enter the admin password to manage site content, messages, and settings.
        </p>
        <div className="mt-7">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
