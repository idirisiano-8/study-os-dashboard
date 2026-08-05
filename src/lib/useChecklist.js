import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useChecklist(checklistKey, itemKeys) {
  const [checked, setChecked] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("checklist_state")
      .select("item_key, checked")
      .eq("checklist_key", checklistKey)
      .then(({ data, error }) => {
        if (cancelled) return;
        const map = {};
        if (!error && data) {
          for (const row of data) map[row.item_key] = row.checked;
        }
        setChecked(map);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [checklistKey]);

  async function toggle(itemKey) {
    const next = !checked[itemKey];
    setChecked((c) => ({ ...c, [itemKey]: next }));
    await supabase
      .from("checklist_state")
      .upsert(
        { checklist_key: checklistKey, item_key: itemKey, checked: next, updated_at: new Date().toISOString() },
        { onConflict: "checklist_key,item_key" }
      );
  }

  return { checked, toggle, loading };
}
