import { notFound } from "next/navigation";
import { FooterContactForm } from "@/components/admin/footer-contact-form";
import { getAdminFooterContact } from "@/lib/footer-contacts";

export default async function AdminEditFooterContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await getAdminFooterContact(id);

  if (!contact) notFound();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Footer</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Edit footer contact column</h1>
      <FooterContactForm contact={contact} />
    </div>
  );
}
