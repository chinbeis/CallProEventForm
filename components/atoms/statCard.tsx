import { cn } from "@/lib/utils";
import type { StatCard } from "@/lib/types";


export function StatCard({ label, value, valueColor }: StatCard) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-4 py-4 text-center">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35">{label}</p>
      <p className={cn("mt-2 text-[2rem] font-bold leading-none tabular-nums", valueColor)}>
        {value}
      </p>
    </div>
  );
}