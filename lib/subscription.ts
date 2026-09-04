export type SubscriptionTier = 'FREE' | 'BASIC' | 'ENTERPRISE' | 'ULTIMATE';

const TIER_ORDER: SubscriptionTier[] = ['FREE', 'BASIC', 'ENTERPRISE', 'ULTIMATE'];

/** Maps Stripe / profiles.subscription_plan strings to a normalized tier. */
export function parseSubscriptionTier(plan: string | null | undefined): SubscriptionTier {
  if (!plan) return 'FREE';
  const upper = plan.toUpperCase();
  if (upper.includes('ULTIMATE') || upper.includes('CLUSTER')) return 'ULTIMATE';
  if (
    upper.includes('ENTERPRISE') ||
    upper.includes('EXECUTIVE') ||
    upper.includes('EXEC')
  ) {
    return 'ENTERPRISE';
  }
  if (upper.includes('BASIC') || upper.includes('STARTER') || upper.includes('ACCESS')) {
    return 'BASIC';
  }
  return 'FREE';
}

export function tierMeetsMinimum(
  userTier: SubscriptionTier,
  required: SubscriptionTier
): boolean {
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(required);
}

/** Roblox UI Editor — Enterprise / Executive tier and above. */
export function canAccessRobloxEditor(plan: string | null | undefined): boolean {
  return tierMeetsMinimum(parseSubscriptionTier(plan), 'ENTERPRISE');
}
