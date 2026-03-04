import type { Subscription } from "@/models/subscription";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { MoreHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import type { User } from "@/models/user";
import { useAccountsStore } from "@/stores/accounts/useAccountsStore";

const MoreMenu = ({ user }: { user: User }) => {
  const closeAll = useAccountsStore((s) => s.closeAll);

  const [updating, setUpdating] = useState(false);
  const { useUpdate: updateUser } = useResourceLocked<
    never,
    never,
    Partial<Subscription>
  >("user");

  function updateStatus(
    user: User,
    newStatus: "active" | "disabled" | "deactivated",
  ) {
    closeAll();

    if (updating) return;

    setUpdating(true);
    (async () => {
      try {
        await updateUser.run({
          id: user.id,
          payload: { status: newStatus },
        });

        alert(`Account #${user.id} updated to ${newStatus}`);
      } catch (err) {
        console.error(err);
        alert(`Failed to update account #${user.id}`);
      }

      setUpdating(false);
    })();
  }

  function deleteUser(user: User) {
    closeAll();

    if (updating) return;

    const typed = window.prompt(
      `Type DELETE to permanently remove account #${user.id}. This action cannot be undone.`,
      "",
    );

    if (typed !== "DELETE") {
      alert("Deletion cancelled. You must type DELETE to confirm.");
      return;
    }

    setUpdating(true);
    (async () => {
      try {
        await updateUser.run({
          id: user.id,
          payload: { status: "archived" },
        });

        alert(`Account #${user.id} has been deleted`);
      } catch (err) {
        console.error(err);
        alert(`Failed to delete account #${user.id}`);
      }

      setUpdating(false);
    })();
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label={`More actions for ${user.id}`}
          className="rounded p-2 hover:bg-gray-50"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" side="bottom" className="w-64 bg-white">
        <ul className="py-2">
          {/* Active user */}
          {user.status === "active" && (
            <>
              <li>
                <button
                  onClick={() => updateStatus(user, "disabled")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-100"
                >
                  Suspend user (temporarily prevent login)
                </button>
              </li>
              <li>
                <button
                  onClick={() => updateStatus(user, "deactivated")}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Deactivate user (disable account permanently)
                </button>
              </li>
            </>
          )}

          {/* Disabled user */}
          {user.status === "disabled" && (
            <li>
              <button
                onClick={() => updateStatus(user, "active")}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Reactivate user (restore access)
              </button>
            </li>
          )}

          {/* Deactivated user */}
          {user.status === "deactivated" && (
            <li>
              <button
                onClick={() => updateStatus(user, "active")}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50"
              >
                Activate user (enable account)
              </button>
            </li>
          )}

          {/* DELETE option always available */}
          <li>
            <button
              onClick={() => deleteUser(user)}
              className="mt-2 flex w-full items-center gap-2 rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
            >
              Delete user
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
};
export default MoreMenu;
