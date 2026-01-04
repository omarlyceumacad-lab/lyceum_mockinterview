
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and service role key are required environment variables.');
}

// Create a single, server-side Supabase client for use in API routes
// We use the service_role key here to bypass Row Level Security.
export const supabase = createClient(supabaseUrl, supabaseServiceKey);
