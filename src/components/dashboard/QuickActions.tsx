const QuickActions = ({
  iconClassName,
  actionName,
  actionDescription,
}: {
  iconClassName: string;
  actionName: string;
  actionDescription: string;
}) => {
  return (
    <button className="border-accent-300 hover:border-accent-500 hover:bg-accent-50 group flex flex-col items-center rounded-lg border-2 border-dashed p-4 transition-colors">
      <div className="bg-accent-500 group-hover:bg-accent-600 mb-3 rounded-lg p-3 transition-colors">
        <i className={iconClassName}></i>
      </div>
      <span className="text-secondary-900 font-medium">{actionName}</span>
      <span className="text-secondary-600 mt-1 text-xs">
        {actionDescription}
      </span>
    </button>
  );
};
export default QuickActions;
