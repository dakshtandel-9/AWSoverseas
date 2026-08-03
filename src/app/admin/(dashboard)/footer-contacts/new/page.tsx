import { FooterContactForm } from "@/components/admin/footer-contact-form";

export default function AdminNewFooterContactPage() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Footer</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">New footer contact column</h1>
      <FooterContactForm />
    </div>
  );
}
