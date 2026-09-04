"use server";

import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function createCheckoutSession(priceId: string, userId: string) {
  const origin = (await headers()).get("origin");

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing`,
    client_reference_id: userId, // Supabase kullanıcı ID'sini buraya gömüyoruz
  });

  redirect(session.url!);
}