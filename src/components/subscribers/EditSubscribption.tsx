import type { Subscription } from "@/models/subscription";
import { useSubscribersStore } from "@/stores/subscribers/useSubscribersStore";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

const EditSubscription = () => {
  const selectedUserSubscription = useSubscribersStore(
    (s) => s.selectedUserSubscription,
  );
  const isEditOpen = useSubscribersStore((s) => s.isEditOpen);
  const closeAll = useSubscribersStore((s) => s.closeAll);

  const { useUpdate: updateSubscription } = useResourceLocked<
    never,
    never,
    Partial<Subscription>
  >("subscription");

  if (selectedUserSubscription == null || !isEditOpen) return <></>;

  async function handleSubmit(data: Record<string, string>) {
    if (selectedUserSubscription == null) return;

    try {
      // Update subscription fields
      const payload: Partial<Subscription> = {
        address: data.address,
        plan: data.planId,
      };

      await updateSubscription.run({
        id: selectedUserSubscription.id,
        payload,
      });

      alert(`Saved changes for subscriber #${selectedUserSubscription.user}`);
      closeAll();
    } catch (err) {
      console.error(err);
      alert(
        `Failed to save changes for subscriber #${selectedUserSubscription.user}`,
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-bold">Edit Subscription</h2>
          <button
            onClick={() => closeAll()}
            aria-label="Close"
            className="text-gray-500"
          >
            ✕
          </button>
        </div>

        <RenderForm wrapperClassName="mt-4 flex-column space-y-2">
          <div className="w-full">
            <label htmlFor="name" className="text-xs text-gray-500">
              Full name
            </label>
            <input
              type="text"
              disabled={true}
              className="disabled w-full rounded border px-3 py-2"
              value={`${selectedUserSubscription.name}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <RenderFormField
              field={{
                label: "Service address",
                name: "address",
                type: "text",
              }}
              defaultValue={selectedUserSubscription.address}
              labelClassName="text-xs text-gray-500"
              inputClassName="w-full rounded border px-3 py-2"
            />
            <RenderFormField
              field={{ label: "Assigned plan", name: "planId", type: "text" }}
              defaultValue={selectedUserSubscription.plan.id}
              labelClassName="text-xs text-gray-500"
              inputClassName="w-full rounded border px-3 py-2 col"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={() => closeAll()}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <RenderFormButton
              buttonLabel="Save"
              buttonClassName="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              onSubmit={handleSubmit}
            />
          </div>
        </RenderForm>
      </div>
    </div>
  );
};
export default EditSubscription;
