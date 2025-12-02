const KPICard = ({ kvp }: { kvp: Record<string, string> }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-600 text-sm font-medium">{kvp.title}</p>
          <p className="text-secondary-900 mt-1 text-3xl font-bold">
            {kvp.value}
          </p>
          <p className="text-success-600 mt-2 text-sm">
            <i className={kvp.detailsIcon}></i> {kvp.details}
          </p>
        </div>
        <i className={kvp.kpiIcon}></i>
      </div>
    </div>
  );
};
export default KPICard;
