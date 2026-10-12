const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 px-6 py-10 text-center">
    {Icon && (
      <span className="mb-3 flex size-11 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm ring-1 ring-slate-200">
        <Icon className="size-5" />
      </span>
    )}
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    {description && (
      <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
