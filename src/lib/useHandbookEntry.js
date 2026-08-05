import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";

const SAVE_DEBOUNCE_MS = 800;

/**
 * Loads a handbook_entries row (entry_type + period_key) and gives back
 * [content, setContent, status] where status is 'loading' | 'saved' | 'saving' | 'error'.
 * Edits autosave after a short pause, so pages behave like a living document
 * rather than needing an explicit Save button.
 */
export function useHandbookEntry(entryType, periodKey, defaultContent) {
  const [content, setContent] = useState(defaultContent);
  const [status, setStatus] = useState("loading");
  const saveTimer = useRef(null);
  const loadedOnce = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadedOnce.current = false;
    setStatus("loading");

    async function load() {
      const { data, error } = await supabase
        .from("handbook_entries")
        .select("content")
        .eq("entry_type", entryType)
        .eq("period_key", periodKey)
        .maybeSingle();

      if (cancelled) return;
      if (error) {
        setStatus("error");
        return;
      }
      setContent(data ? { ...defaultContent, ...data.content } : defaultContent);
      loadedOnce.current = true;
      setStatus("saved");
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entryType, periodKey]);

  useEffect(() => {
    if (!loadedOnce.current) return; // don't save the initial load-triggered set
    setStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from("handbook_entries")
        .upsert(
          { entry_type: entryType, period_key: periodKey, content, updated_at: new Date().toISOString() },
          { onConflict: "entry_type,period_key" }
        );
      setStatus(error ? "error" : "saved");
    }, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return [content, setContent, status];
}
