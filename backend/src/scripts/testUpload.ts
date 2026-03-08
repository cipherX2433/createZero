import * as dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log("URL:", supabaseUrl);
// don't log the full key

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function testUpload() {
    console.log("Starting test upload to DevZeroImage bucket...");

    // create a simple 1x1 png 
    const base64Pixel = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
    const buffer = Buffer.from(base64Pixel, "base64");

    const fileName = `test-upload-${Date.now()}.png`;

    try {
        console.time("Upload Time");
        const { data, error } = await supabase.storage
            .from("DevZeroImage")
            .upload(fileName, buffer, {
                contentType: "image/png",
                upsert: false,
            });
        console.timeEnd("Upload Time");

        if (error) {
            console.error("Test upload error:", error);
        } else {
            console.log("Test upload success!", data);
        }
    } catch (e) {
        console.error("Test upload exception:", e);
    }
}

testUpload();
