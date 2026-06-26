import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgColorClass: string;
}

export function MetricCard({
  id,
  title,
  value,
  description,
  icon: Icon,
  colorClass,
  bgColorClass,
}: MetricCardProps) {
  return (
    <div
      id={id}
      className="bg-white rounded-none border-2 border-brand-line p-5 flex items-start justify-between hover:translate-x-[1px] hover:translate-y-[1px] transition-transform shadow-[4px_4px_0px_0px_#141414] select-none"
    >
      <div className="flex-1">
        <span className="text-[11px] font-serif italic text-brand-ink/70 uppercase tracking-widest block mb-1">
          {title}
        </span>
        <h3 className="text-3xl font-mono font-bold text-brand-ink tracking-tight">
          {value}
        </h3>
        <p className="text-[11px] font-mono text-brand-ink/50 mt-2">
          {description}
        </p>
      </div>
      <div className="p-2.5 rounded-none border border-brand-line bg-brand-accent-ultralight text-brand-accent flex-shrink-0 ml-3">
        <Icon className="w-5 h-5 stroke-[2.25]" />
      </div>
    </div>
  );
}

