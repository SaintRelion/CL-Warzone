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
  Subscription,
  CreateSubscription,
  UpdateSubscriptionStatus,
} from "@/models/subscription";
import { getCurrentDateTimeString, toDate } from "@saintrelion/time-functions";
import type { Plan } from "@/models/Plan";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UserBillingInfo } from "@/models/Billing";
import type { User } from "@/models/user";

const BrowsePlansPage = () => {
  const user = useCurrentUser<User>();
  const [viewedPlan, setViewedPlan] = useState<Plan | null>(null);

  const { useList: getPlans } = useResourceLocked<Plan>("plan", {
    showToast: false,
  });

  const plans = getPlans().data;

  const {
    useList: getSubscription,
    useInsert: insertSubscription,
    useUpdate: updateSubscription,
  } = useResourceLocked<
    Subscription,
    CreateSubscription,
    UpdateSubscriptionStatus
  >("subscription");

  const { useList: getUserBilling } =
    useResourceLocked<UserBillingInfo>("userbilling");

  const currentSubscriptions = getSubscription({
    filters: { user: user.id, status: "active" },
  }).data;
  const currentPlan =
    currentSubscriptions.length > 0
      ? plans.filter((p) => p.id == currentSubscriptions[0].plan)[0]
      : null;

  const myActiveBilling = getUserBilling({
    filters: {
      user: user.id,
      subscription:
        currentSubscriptions.length == 0 ? -1 : currentSubscriptions[0].id,
    },
  }).data;

  async function handleConfirmPlan(confirmedPlan: Plan) {
    const currentDay = toDate(getCurrentDateTimeString());

    if (currentDay != null && confirmedPlan != null) {
      if (currentSubscriptions.length > 0) {
        const currentSubscription = currentSubscriptions[0];

        await updateSubscription.run({
          id: currentSubscription.id,
          payload: { status: "disabled" },
        });
      }

      // + 30 days
      currentDay.setDate(currentDay.getDate() + 30);

      await insertSubscription.run({
        user: user.id,
        plan: confirmedPlan.id,
        amount: confirmedPlan.price,
        address: user.street_address,
        status: "active",
        next_billing_date: currentDay.toISOString().split("T")[0],
      });
    }
  }

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Our Internet Plans
      </h2>
      <p className="mb-8 text-gray-600">
        Choose the perfect plan for your needs
      </p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => {
          // Dynamically generate features
          const features = [
            `Up to ${plan.speed_mbps} Mbps Speed`,
            "Unlimited Data",
            plan.name === "Basic Fiber" ? "Free Installation" : null,
            plan.name === "Pro Gamer" ? "Low Latency Routing" : null,
            plan.name === "Enterprise Fiber" ? "Dedicated IP Option" : null,
            "24/7 Customer Support", // generic feature
          ].filter(Boolean); // remove nulls

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

                <ul className="mb-6 space-y-3">
                  {features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="fa-solid fa-check mt-0.5 shrink-0 text-lg text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Dialog
                  onOpenChange={(open) => {
                    if (!open) setViewedPlan(null);
                  }}
                  open={viewedPlan != null}
                >
                  <DialogTrigger asChild>
                    <button
                      disabled={insertSubscription.isLocked}
                      onClick={() => {
                        if (currentSubscriptions.length > 0) {
                          if (
                            myActiveBilling.length > 0 &&
                            myActiveBilling[0].status == "Unpaid"
                          ) {
                            alert(
                              "You have pending bills, please complete any remaining balance.",
                            );
                            return;
                          }
                        }

                        setViewedPlan(plan);
                      }}
                      className={`w-full rounded-lg py-3 font-medium transition ${
                        currentPlan?.id === plan.id
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      {currentPlan?.id === plan.id
                        ? "Current Plan"
                        : "Switch Plan"}
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

                    {/* ================ ORDER SUMMARY CARD ================ */}
                    <div className="mb-6 rounded-xl border bg-gray-50 p-4 shadow-sm">
                      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
                        <span className="fa-solid fa-receipt text-indigo-600" />
                        Order Summary
                      </h3>

                      {/* Plan info */}
                      <div className="mb-4 flex items-start gap-3">
                        <span className="fa-solid fa-wifi text-xl text-indigo-600" />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {viewedPlan?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {viewedPlan?.speed_mbps} • Unlimited Data
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Monthly Plan</span>
                          <span>₱{viewedPlan?.price}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Installation Fee</span>
                          <span>₱1,500</span>
                        </div>

                        <hr className="my-3" />

                        <div className="flex justify-between font-semibold">
                          <span>Monthly Total</span>
                          <span>₱{Number(viewedPlan?.price) - 150}</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold text-indigo-700">
                          <span>First Month Total</span>
                          <span>₱{Number(viewedPlan?.price) + 1500 - 150}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-gray-600">
                        <p>
                          <span className="fa-solid fa-circle-dot mr-1" />{" "}
                          Installation: To be scheduled
                        </p>
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
