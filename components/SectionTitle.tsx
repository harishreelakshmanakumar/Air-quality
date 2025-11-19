import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export default function SectionTitle({ title, description, action }: Props) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
