// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://svchjzxxoycbjrfcnzvz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2Y2hqenh4b3ljYmpyZmNuenZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzIyNTQsImV4cCI6MjA1OTQwODI1NH0.lH0bfEyZpd1fpF86RiOozXuqQYrWnXZr_pN9Zb3uTMU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);