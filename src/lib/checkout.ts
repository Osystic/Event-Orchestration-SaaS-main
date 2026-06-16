import { getStripe, type PlanId } from "./stripe";
import { supabase } from "@/integrations/supabase/client";

/**
 * Redirect to Stripe Checkout for a given plan.
 * For the free Starter plan this is a no-op (returns false).
 */
export async function redirectToCheckout(planId: PlanId): Promise<boolean> {
  if (planId === "starter" || planId === "business") {
    return false;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "/auth";
    return false;
  }

  const stripe = await getStripe();
  if (!stripe) {
    console.error("Stripe failed to load");
    return false;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
          userId: session.user.id,
          email: session.user.email,
        }),
      }
    );

    const { sessionId, error } = await response.json();

    if (error) {
      console.error("Checkout session error:", error);
      return false;
    }

    const result = await stripe.redirectToCheckout({ sessionId });
    if (result.error) {
      console.error("Stripe redirect error:", result.error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Checkout error:", err);
    return false;
  }
}
