export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-7">
      <p className="text-emerald-700 text-sm font-bold uppercase tracking-[.2em] mb-2">
        {eyebrow}
      </p>
      <h2 className="section-title">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-2">{subtitle}</p>}
    </div>
  );
}
