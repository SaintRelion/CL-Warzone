import type { Subscription, UserSubscription } from "@/models/subscription";
import { useSubscribersStore } from "@/stores/subscribers/useSubscribersStore";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { MoreHorizontal, ToggleLeft } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MoreMenu = ({ subscription }: { subscription: UserSubscription }) => {
  const closeAll = useSubscribersStore((s) => s.closeAll);

  const { useUpdate: updateSubscription } = useResourceLocked<
    never,
    never,
    Partial<Subscription>
  >("subscription");

  function handleToggleStatus(sub: Subscription) {
    const newStatus = sub.status === "active" ? "disabled" : "active";
    closeAll();

    (async () => {
      try {
        await updateSubscription.run({
          id: sub.id,
          payload: { status: newStatus },
        });
        alert(`Subscriber #${sub.id} status updated to ${newStatus}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to update status for subscriber #${sub.id}`);
      }
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
          {subscription.status !== "archived" && (
            <li>
              <button
                onClick={() => handleToggleStatus(subscription)}
                className="flex w-full items-center gap-2 text-sm hover:bg-gray-50"
              >
                <ToggleLeft className="h-4 w-4 text-gray-600" />
                {subscription.status === "active" ? "Active" : "Disabled"}
              </button>
            </li>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
};
export default MoreMenu;
