import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — check dashboard/.env"
  );
}

// IMPORTANT: this file ships to the browser. Use the PUBLISHABLE key only —
// never the secret key — since anyone who opens dev tools can read this bundle.
export const supabase = createClient(url, key);
