import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        // Validate URL format before attempting to create client
        if (!supabaseUrl.startsWith('https://')) {
            throw new Error("Supabase URL must start with https://");
        }
        client = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.error('❌ Supabase Init Error:', err);
    }
}

export const supabase = client as any;

if (!supabase) {
    console.warn(
        '⚠️ Supabase Connection Warning: \n' +
        'Invalid or missing Supabase credentials in .env.local. \n' +
        'Please ensure NEXT_PUBLIC_SUPABASE_URL is a full URL (starts with https://).'
    );
}
