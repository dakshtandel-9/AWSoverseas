import { CityAgentForm } from "@/components/admin/city-agent-form";

export default function AdminNewCityAgentPage() {
  return (
    <div>
      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#5b6b82]">Contact page</p>
      <h1 className="mt-2 text-2xl font-bold text-[#1A0A53] sm:text-3xl">New city</h1>
      <CityAgentForm />
    </div>
  );
}
