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
import { RenderForm, RenderFormField } from "@saintrelion/forms";
import type { Plan } from "@/models/plan";

const BrowsePlansPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const plans: Plan[] = [
    {
      id: 1,
      name: "Basic 100 Mbps",
      speed: "100 Mbps",
      price: "1299",
      features: ["Download: 100 Mbps", "Upload: 20 Mbps", "Unlimited data"],
      description: "Perfect for casual browsing",
    },
    {
      id: 2,
      name: "Fiber 500 Mbps",
      speed: "500 Mbps",
      price: "1999",
      features: ["Download: 500 Mbps", "Upload: 100 Mbps", "Unlimited data"],
      description: "Great for streaming and gaming",
    },
    {
      id: 2,
      name: "Fiber 1000 Mbps",
      speed: "1000 Mbps",
      price: "2999",
      features: ["Download: 1000 Mbps", "Upload: 1000 Mbps", "Unlimited data"],
      description: "Great for streaming and gaming",
    },
  ];

  return (
    <div>
      <h2 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
        Our Internet Plans
      </h2>
      <p className="mb-8 text-gray-600">
        Choose the perfect plan for your needs
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
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
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="fa-solid fa-check mt-0.5 flex-shrink-0 text-lg text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white transition hover:bg-indigo-700">
                    Select
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm Your Plan</DialogTitle>
                    <DialogDescription>
                      You are about to subscribe to{" "}
                      <strong>{selectedPlan?.name}</strong> for ₱
                      {selectedPlan?.price}/month. Please confirm your
                      installation address.
                    </DialogDescription>
                  </DialogHeader>

                  <RenderForm>
                    <RenderFormField
                      field={{
                        label: "Installation Address",
                        type: "text",
                        name: "homeAddress",
                        placeholder: "Enter your complete address",
                      }}
                      wrapperClassName="flex flex-col "
                      labelClassName="text-sm font-medium text-gray-700 mb-1"
                    />

                    <DialogFooter className="mt-6">
                      <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                        Confirm Subscription
                      </Button>
                    </DialogFooter>
                  </RenderForm>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 rounded-xl border-2 border-green-200 bg-green-50 p-6">
          <h3 className="mb-2 text-xl font-bold text-green-900">
            ✓ Plan Selected
          </h3>
          <p className="text-green-800">
            You have selected <strong>{selectedPlan.name}</strong> at ₱
            {selectedPlan.price}/month.
          </p>
        </div>
      )}
    </div>
  );
};
export default BrowsePlansPage;
