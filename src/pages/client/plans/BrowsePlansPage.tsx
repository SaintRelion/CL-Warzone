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
    name: "Basic 10 Mbps",
    speed: "10 Mbps",
    price: "999",
    features: ["Download: 10 Mbps", "Upload: 10 Mbps", "Unlimited data"],
    description: "Perfect for casual browsing",
  },
  
   {
    id: 2,
    name: "Basic 50 Mbps",
    speed: "50 Mbps",
    price: "1499",
    features: ["Download: 50 Mbps", "Upload: 50 Mbps", "Unlimited data"],
    description: "Perfect for casual browsing",
  },
  {
    id: 3,
    name: "Fiber 100 Mbps",
    speed: "100 Mbps",
    price: "2499",
    features: ["Download: 100 Mbps", "Upload: 100 Mbps", "Unlimited data"],
    description: "Best for heavy users and smart homes",
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
                    <button
                      onClick={() => setSelectedPlan(plan)}
                      className={`w-full rounded-lg py-3 font-medium transition 
                        ${selectedPlan?.id === plan.id 
                          ? "bg-green-600 text-white hover:bg-green-700" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                      {selectedPlan?.id === plan.id ? "Current Plan" : "Switch Plan"}
                    </button>
                  </DialogTrigger>

<DialogContent className="bg-white sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Switch to This Plan</DialogTitle>
    <DialogDescription>
      You are switching to <strong>{plan.name}</strong> for ₱{plan.price}/month.
      Please fill in your payment details to continue.
    </DialogDescription>
  </DialogHeader>


                  <DialogContent className="bg-white sm:max-w-md">
  <DialogHeader>
    <DialogTitle>Confirm Your Subscription</DialogTitle>
    <DialogDescription>
      Review your plan details and provide your installation address.
    </DialogDescription>
  </DialogHeader>

  {/* ===================== ORDER SUMMARY CARD ===================== */}
  <div className="border rounded-xl p-4 bg-gray-50 mb-6 shadow-sm">
    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
      <span className="text-indigo-600 fa-solid fa-receipt" />
      Order Summary
    </h3>

    {/* Plan info */}
    <div className="flex items-start gap-3 mb-4">
      <span className="fa-solid fa-wifi text-indigo-600 text-xl" />
      <div>
        <p className="font-semibold text-gray-900">
          {selectedPlan?.name}
        </p>
        <p className="text-sm text-gray-600">
          {selectedPlan?.speed} • Unlimited Data
        </p>
      </div>
    </div>

    {/* Items */}
    <div className="space-y-2 text-sm text-gray-700">
      <div className="flex justify-between">
        <span>Monthly Plan</span>
        <span>₱{selectedPlan?.price}</span>
      </div>

      <div className="flex justify-between">
        <span>Installation Fee</span>
        <span>₱1,500</span>
      </div>

      <div className="flex justify-between text-green-600">
        <span className="flex items-center gap-1">
          <span className="fa-solid fa-tag" />
          New Customer (10% off)
        </span>
        <span>-₱150</span>
      </div>

      <hr className="my-3" />

      <div className="flex justify-between font-semibold">
        <span>Monthly Total</span>
        <span>₱{Number(selectedPlan?.price) - 150}</span>
      </div>

      <div className="flex justify-between font-bold text-indigo-700 text-lg">
        <span>First Month Total</span>
        <span>
          ₱{Number(selectedPlan?.price) + 1500 - 150}
        </span>
      </div>
    </div>

    {/* Savings Box */}
    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex justify-between">
      <span className="flex items-center gap-2">
        <span className="fa-solid fa-wallet" />
        Total Savings
      </span>
      <span className="font-semibold">₱150</span>
    </div>

    {/* Notes */}
    <div className="mt-3 text-xs text-gray-600 space-y-1">
      <p><span className="fa-solid fa-circle-dot mr-1" /> Installation: To be scheduled</p>
      <p><span className="fa-solid fa-circle-dot mr-1" /> Service Area: Metro Manila</p>
      <p><span className="fa-solid fa-circle-dot mr-1" /> Billing Cycle: Monthly</p>
    </div>
  </div>

  {/* ===================== YOUR EXISTING FORM ===================== */}
           

          <RenderForm>
            <DialogFooter className="mt-6 flex justify-end gap-3">
              {/* Cancel Button */}
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>

              {/* Confirm Button */}
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                Order Confirm
              </Button>
            </DialogFooter>
          </RenderForm>

          </DialogContent>
                  
                </DialogContent>
              </Dialog>

</div> </div> ))} </div>


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
