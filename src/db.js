import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://uxaxrlkficlrmbbhtpia.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4YXhybGtmaWNscm1iYmh0cGlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg2NzE2NjAsImV4cCI6MjAzNDI0NzY2MH0.ssmbI7kVRYIZizwQbyUIGgjZ3awzSDyrLo1RgNkcRJ8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
