const RecentActivityCard = ({ kvp }: { kvp: Record<string, string> }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="bg-success-100 rounded-lg p-2">
        <i className={kvp.iconClassName}></i>
      </div>
      <div className="flex-1">
        <p className="text-secondary-900 text-sm font-medium">{kvp.title}</p>
        <p className="text-secondary-600 text-xs">{kvp.description}</p>
        <p className="text-secondary-500 mt-1 text-xs">{kvp.time}</p>
      </div>
    </div>
  );
};
export default RecentActivityCard;
