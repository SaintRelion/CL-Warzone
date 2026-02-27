import { useSubscribersStore } from "@/stores/subscribers/useSubscribersStore";
import { formatReadableDate } from "@saintrelion/time-functions";

const ViewSubscription = () => {
  const selectedSubscription = useSubscribersStore(
    (s) => s.selectedUserSubscription,
  );
  const isViewOpen = useSubscribersStore((s) => s.isViewOpen);
  const closeAll = useSubscribersStore((s) => s.closeAll);

  if (selectedSubscription == null || !isViewOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">Subscriber Overview</h2>
          <button
            onClick={() => closeAll()}
            aria-label="Close"
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Full name</p>
            <p className="font-medium text-gray-900">
              {selectedSubscription.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Plan</p>
            <p className="font-medium text-gray-900">
              {selectedSubscription.plan.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-medium text-gray-900">
              {selectedSubscription.status}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Address</p>
            <p className="font-medium text-gray-900">
              {selectedSubscription.address}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Outstanding balance</p>
            <p className="font-medium text-gray-900">
              ₱
              {parseFloat(selectedSubscription.amount).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Next billing</p>
            <p className="font-medium text-gray-900">
              {formatReadableDate(selectedSubscription.next_billing_date)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => closeAll()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default ViewSubscription;
