import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  value?: string | number;
  children?: ReactNode;
};

export default function MetricCard({ title, subtitle, value, children }: Props) {
  return (
    <div className="card flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide">{title}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
        {value !== undefined && <span className="text-lg font-semibold text-slate-800">{value}</span>}
      </div>
      {children}
    </div>
  );
}
