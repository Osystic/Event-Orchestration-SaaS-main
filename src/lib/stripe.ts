import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

let stripePromise: ReturnType<typeof loadStripe> | null = null;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

export type PlanId = "starter" | "pro" | "business";

export interface PlanConfig {
  id: PlanId;
  name: string;
  price: string;
  priceMonthly: number | null;
  stripePriceId: string | null;
  features: string[];
}

export const PLANS: PlanConfig[] = [
  {
    id: "starter",
    name: "Starter Plan",
    price: "Free",
    priceMonthly: null,
    stripePriceId: null,
    features: ["Basic event creation", "Limited templates", "Core planning tools"],
  },
  {
    id: "pro",
    name: "Pro Plan",
    price: "$29/mo",
    priceMonthly: 29,
    stripePriceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID as string,
    features: [
      "Unlimited events",
      "Advanced AI workflows",
      "Real-time collaboration tools",
      "Analytics dashboard",
    ],
  },
  {
    id: "business",
    name: "Business Plan",
    price: "TBA",
    priceMonthly: null,
    stripePriceId: null,
    features: [
      "Multi-user collaboration",
      "Vendor and partner integrations",
      "Priority support",
      "Custom workflow automation",
    ],
  },
];

export function getPlanById(id: PlanId): PlanConfig | undefined {
  return PLANS.find((p) => p.id === id);
}
