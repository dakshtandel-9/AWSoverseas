import { notFound } from "next/navigation";
import { CityAgentForm } from "@/components/admin/city-agent-form";
import { getAdminCityAgent } from "@/lib/city-agents";

export default async function AdminEditCityAgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const agent = await getAdminCityAgent(id);

  if (!agent) notFound();

  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">Edit city</h1>
      <CityAgentForm agent={agent} />
    </div>
  );
}
