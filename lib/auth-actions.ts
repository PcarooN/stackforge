import { supabase } from "./supabase";

// Kullanıcı oturumunu al
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Çıkış yapma fonksiyonu
export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = "/login";
}