
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseKey, {
    db: { schema: 'voyna_mir' }
});

export default supabaseClient
        