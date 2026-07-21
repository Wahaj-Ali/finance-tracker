import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "@/components/settings/SettingsClient";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { data: categories }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase
      .from("user_categories")
      .select("*")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <SettingsClient
      profile={profile}
      initialCategories={categories ?? []}
      userId={user.id}
    />
  );
}
