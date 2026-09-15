export function StatTile({ label, value, detail, icon: Icon }) {
  return (
    <div className="dashboard-card p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
        </div>
        {Icon && (
          <span className="grid size-8 place-items-center rounded-md bg-dashboard-soft">
            <Icon className="size-4 text-brand-blue" />
          </span>
        )}
      </div>
      {detail && <p className="mt-3 text-xs text-muted-foreground">{detail}</p>}
    </div>
  );
}
