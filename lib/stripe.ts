import 'server-only';
import Stripe from 'stripe';

console.log("Stripe Key Yüklü mü?", !!process.env.STRIPE_SECRET_KEY); // Bu satırı ekle

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {

  typescript: true,
});