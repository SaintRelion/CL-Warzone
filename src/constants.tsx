import type { Plan } from "./models/Plan";

export const PLANS: Plan[] = [
  {
    id: "1",
    name: "Basic 10 Mbps",
    speed: "10 Mbps",
    price: "999",
    features: ["Download: 10 Mbps", "Upload: 10 Mbps", "Unlimited data"],
    description: "Perfect for casual browsing",
  },

  {
    id: "2",
    name: "Basic 50 Mbps",
    speed: "50 Mbps",
    price: "1499",
    features: ["Download: 50 Mbps", "Upload: 50 Mbps", "Unlimited data"],
    description: "Perfect for casual browsing",
  },
  {
    id: "3",
    name: "Fiber 100 Mbps",
    speed: "100 Mbps",
    price: "2499",
    features: ["Download: 100 Mbps", "Upload: 100 Mbps", "Unlimited data"],
    description: "Best for heavy users and smart homes",
  },
];
