import Link from "next/link";
import { OfficeForm } from "@/components/admin/office-form";
import { listAdminOfficeGroups } from "@/lib/office-locations";

export default async function AdminNewOfficePage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  const { group } = await searchParams;
  const groups = await listAdminOfficeGroups();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">New office</h1>

      {groups.length === 0 ? (
        <p className="mt-6 max-w-2xl rounded-2xl border border-dashed border-[#e4e9f2] px-5 py-8 text-sm text-[#5b6b82]">
          Every office belongs to a group.{" "}
          <Link href="/admin/offices" className="font-semibold text-maroon-admin">
            Create a group first
          </Link>
          , then add offices to it.
        </p>
      ) : (
        <OfficeForm groups={groups} defaultGroupId={group} />
      )}
    </div>
  );
}
