import type { Subscription, UserSubscription } from "@/models/subscription";
import { useSubscribersStore } from "@/stores/subscribers/useSubscribersStore";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";

const MoreMenu = ({ subscription }: { subscription: UserSubscription }) => {
  const closeAll = useSubscribersStore((s) => s.closeAll);

  const [updating, setUpdating] = useState(false);
  const { useUpdate: updateSubscription } = useResourceLocked<
    never,
    never,
    Partial<Subscription>
  >("subscription");

  function updateStatus(
    sub: UserSubscription,
    newStatus: "pending" | "active" | "suspended" | "cancelled",
  ) {
    closeAll();

    if (updating) return;

    setUpdating(true);
    (async () => {
      try {
        await updateSubscription.run({
          id: sub.id,
          payload: { status: newStatus },
        });

        alert(`Subscriber #${sub.id} updated to ${newStatus}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to update subscriber #${sub.id}`);
      }

      setUpdating(false);
    })();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={`More actions for ${subscription.id}`}
          className="rounded p-2 hover:bg-gray-50"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-56 bg-white">
        <ul className="py-2">
          {subscription.status === "pending" && (
            <li>
              <button
                onClick={() => updateStatus(subscription, "active")}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Approve
              </button>
            </li>
          )}

          {subscription.status === "active" && (
            <>
              <li>
                <button
                  onClick={() => updateStatus(subscription, "suspended")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-yellow-50"
                >
                  Suspend
                </button>
              </li>

              <li>
                <button
                  onClick={() => updateStatus(subscription, "cancelled")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel
                </button>
              </li>
            </>
          )}

          {subscription.status === "suspended" && (
            <>
              <li>
                <button
                  onClick={() => updateStatus(subscription, "active")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-green-50"
                >
                  Resume
                </button>
              </li>

              <li>
                <button
                  onClick={() => updateStatus(subscription, "cancelled")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cancel
                </button>
              </li>
            </>
          )}

          {subscription.status === "cancelled" && (
            <li className="px-3 py-2 text-sm text-gray-400">
              Subscription Cancelled
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
export default MoreMenu;
