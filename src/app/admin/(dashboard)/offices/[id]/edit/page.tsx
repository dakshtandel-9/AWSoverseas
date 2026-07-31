import { notFound } from "next/navigation";
import { OfficeForm } from "@/components/admin/office-form";
import { getAdminOffice, listAdminOfficeGroups } from "@/lib/office-locations";

export default async function AdminEditOfficePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [office, groups] = await Promise.all([getAdminOffice(id), listAdminOfficeGroups()]);

  if (!office) notFound();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Edit office</h1>
      <OfficeForm groups={groups} office={office} />
    </div>
  );
}
