import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log("Checking scripts table...");
    try {
        const { data, error } = await supabase.from('scripts').select('id').limit(1);
        if (error) {
            console.error("DB Error on scripts table:", error.message, error.hint, error.details);
        } else {
            console.log("Successfully queried scripts table. Total rows fetched:", data.length);
        }
    } catch (e) {
        console.error("Catastrophic error:", e);
    }
}
check();
