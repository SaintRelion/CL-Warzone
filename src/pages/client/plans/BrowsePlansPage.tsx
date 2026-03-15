import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type {
  CreateSubscription,
  UpdateSubscriptionStatus,
  Subscription,
} from "@/models/subscription";
import type { Plan } from "@/models/Plan";
import {
  useResourceLocked,
  type Paginated,
} from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { User } from "@/models/user";

const BrowsePlansPage = () => {
  const user = useCurrentUser<User>();
  const [viewedPlan, setViewedPlan] = useState<Plan | null>(null);

  const { useList: getPlans } = useResourceLocked<Paginated<Plan>>("plan", {
    showToast: false,
  });

  const plans = getPlans().data;

  const {
    useList: getSubscription,
    useInsert: insertSubscription,
    useUpdate: updateSubscription,
  } = useResourceLocked<
    Paginated<Subscription>,
    CreateSubscription,
    UpdateSubscriptionStatus
  >("subscription");

  const { useList: getUserBilling } =
    useResourceLocked<Paginated<UserBillingInfo>>("userbilling");

  const currentSubscriptions = getSubscription({
    filters: { user: user.id },
  }).data;

  async function handleConfirmPlan(confirmedPlan: Plan) {
    if (confirmedPlan != null) {
      if (openSubscription) {
        await updateSubscription.run({
          id: openSubscription.id,
          payload: { status: "cancelled" },
        });
      }

      await insertSubscription.run({
        user: user.id,
        plan: confirmedPlan.id,
        address: user.street_address,
      });
    }
  }

  const openSubscription =
    currentSubscriptions?.results.find((sub) =>
      ["pending", "active", "suspended"].includes(sub.status),
    ) ?? null;

  const myActiveBilling = getUserBilling({
    filters: {
      user: user.id,
      subscription: openSubscription ? openSubscription.id : -1,
    },
  }).data;

  if (!plans || !currentSubscriptions || !myActiveBilling)
    return <div>Loading...</div>;

  const currentPlan = openSubscription
    ? plans.results.find((p) => p.id == openSubscription.plan)
    : null;

  const hasUnpaidBill =
    myActiveBilling.results.length > 0 &&
    myActiveBilling.results[0].status === "unpaid";

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Our Internet Plans
      </h2>
      <p className="mb-8 text-gray-600">
        Choose the perfect plan for your needs
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {plans.results.map((plan) => {
          const disableButton =
            insertSubscription.isLocked ||
            hasUnpaidBill ||
            (openSubscription &&
              (openSubscription.status === "pending" ||
                openSubscription.status === "suspended"));

          // Determine badge & button status
          const subscriptionStatus =
            openSubscription?.plan === plan.id
              ? openSubscription.status
              : currentPlan?.id === plan.id
                ? "current"
                : "available";

          const statusStyles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700",
            current: "bg-green-100 text-green-700",
            active: "bg-green-100 text-green-700",
            suspended: "bg-gray-100 text-gray-700",
            available: "bg-indigo-100 text-indigo-700",
          };

          const statusLabels: Record<string, string> = {
            pending: "⏳ Approval Pending",
            current: "✓ Current Plan",
            active: "✓ Active",
            suspended: "⚠ Suspended",
            available: "Avail Plan",
          };

          return (
            <div
              key={plan.id}
              className="overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-xl"
            >
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mb-4 text-sm text-gray-600">{plan.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-indigo-600">
                    ₱{plan.price}
                  </span>
                  <span className="text-gray-600">/month</span>
                </div>

                {/* Status Badge */}
                <span
                  className={`inline-flex w-fit items-center rounded-full px-2 py-1 text-xs font-bold ${
                    statusStyles[subscriptionStatus]
                  }`}
                >
                  {statusLabels[subscriptionStatus]}
                </span>

                {/* Subscription Dialog */}
                <Dialog
                  onOpenChange={(open) => {
                    if (!open) setViewedPlan(null);
                  }}
                  open={viewedPlan?.id === plan.id}
                >
                  <DialogTrigger asChild>
                    <button
                      disabled={disableButton ?? false}
                      onClick={() => {
                        if (hasUnpaidBill) {
                          alert(
                            "You have pending bills, please complete any remaining balance.",
                          );
                          return;
                        }
                        setViewedPlan(plan);
                      }}
                      className={`mt-4 w-full rounded-lg py-3 font-medium transition ${
                        subscriptionStatus === "pending"
                          ? "cursor-not-allowed bg-yellow-500 text-white"
                          : subscriptionStatus === "current" ||
                              subscriptionStatus === "active"
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {statusLabels[subscriptionStatus]}
                    </button>
                  </DialogTrigger>

                  <DialogContent className="bg-white sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Confirm Your Subscription</DialogTitle>
                      <DialogDescription>
                        Review your plan details and provide your installation
                        address.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Order Summary */}
                    <div className="mb-6 rounded-xl border bg-gray-50 p-4 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                        <span className="fa-solid fa-receipt text-indigo-600" />
                        Order Summary
                      </h3>

                      <div className="mb-4 flex items-start gap-3">
                        <span className="fa-solid fa-wifi text-xl text-indigo-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {viewedPlan?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {viewedPlan?.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Monthly Plan</span>
                          <span>₱{viewedPlan?.price}</span>
                        </div>

                        <hr className="my-3" />
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-gray-600">
                        <p>
                          <span className="fa-solid fa-circle-dot mr-1" />{" "}
                          Service Area: {user.service_area.toUpperCase()}
                        </p>
                        <p>
                          <span className="fa-solid fa-circle-dot mr-1" />{" "}
                          Billing Cycle: Monthly
                        </p>
                      </div>
                    </div>

                    <DialogFooter className="mt-6 flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        onClick={() => setViewedPlan(null)}
                      >
                        Cancel
                      </Button>

                      <Button
                        onClick={() => {
                          if (viewedPlan) handleConfirmPlan(viewedPlan);
                          setViewedPlan(null);
                        }}
                        className="bg-indigo-600 text-white hover:bg-indigo-700"
                      >
                        Order Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>

      {currentPlan && (
        <div className="mt-8 rounded-xl border-2 border-green-200 bg-green-50 p-6">
          <h3 className="mb-2 text-xl font-bold text-green-900">
            ✓ Plan Selected
          </h3>
          <p className="text-green-800">
            You have selected <strong>{currentPlan.name}</strong> at ₱
            {currentPlan.price}/month.
          </p>
          <p className="text-xs text-red-800"></p>
        </div>
      )}
    </div>
  );
};
export default BrowsePlansPage;
