import * as dotenv from 'dotenv';
dotenv.config();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
    try {
        console.log("Fetching buckets...");
        const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
        if (bucketsError) {
            console.error("Failed to list buckets:", bucketsError);
        } else {
            console.log("Buckets:", buckets.map(b => b.name));
        }

        console.log("\nTesting upload with Blob...");
        const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
        const buffer = Buffer.from(base64Pixel, "base64");
        const blob = new Blob([buffer], { type: "image/png" });

        const { data, error } = await supabase.storage
            .from("DevZeroImage")
            .upload("ping.png", blob, { upsert: true });

        if (error) {
            console.error("Blob upload error:", error);
        } else {
            console.log("Blob upload success!", data);
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

run();
