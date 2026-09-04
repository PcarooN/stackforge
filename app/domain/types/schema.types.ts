export interface DbPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  stripe_price_id: string | null;
  features: string[] | null;
}

export interface DbProduct {
  id: string;
  name: string;
  description: string;
  price: string;
  currency: string;
  platform: string;
  version?: string;
  updated_at: string;
  is_active: boolean;
  download_url?: string;
  features?: string[];
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
  subscription_plan: string | null;
  subscription_status: string | null;
  created_at?: string;
}
