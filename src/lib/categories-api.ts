import type { SupabaseClient } from "@supabase/supabase-js";
import { isTempCategoryId, type CategoryConfig } from "@/lib/constants";
import type { UserCategory } from "@/types";

export async function saveUserCategories(
  supabase: SupabaseClient,
  userId: string,
  categories: CategoryConfig[],
  existingIds: string[]
): Promise<UserCategory[]> {
  const nextIds = categories.map((c) => c.id);
  const removedIds = existingIds.filter(
    (id) => !nextIds.includes(id) && !isTempCategoryId(id)
  );

  if (removedIds.length > 0) {
    const { count } = await supabase
      .from("expenses")
      .select("*", { count: "exact", head: true })
      .in("category_id", removedIds);

    if (count && count > 0) {
      throw new Error(
        "Cannot remove categories that already have expenses logged"
      );
    }

    const { error: deleteError } = await supabase
      .from("user_categories")
      .delete()
      .in("id", removedIds)
      .eq("user_id", userId);

    if (deleteError) throw deleteError;
  }

  const saved: UserCategory[] = [];

  for (let index = 0; index < categories.length; index++) {
    const cat = categories[index];
    const row = {
      user_id: userId,
      slug: cat.slug,
      label: cat.label.trim(),
      color: cat.color,
      percentage: cat.percentage,
      sort_order: index,
      is_custom: cat.isCustom,
    };

    if (isTempCategoryId(cat.id)) {
      const { data, error } = await supabase
        .from("user_categories")
        .insert(row)
        .select()
        .single();

      if (error) throw error;
      saved.push(data);
    } else {
      const { data, error } = await supabase
        .from("user_categories")
        .update(row)
        .eq("id", cat.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      saved.push(data);
    }
  }

  return saved.sort((a, b) => a.sort_order - b.sort_order);
}

export async function fetchUserCategories(
  supabase: SupabaseClient,
  userId: string
): Promise<UserCategory[]> {
  const { data } = await supabase
    .from("user_categories")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });

  return data ?? [];
}
