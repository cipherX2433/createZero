/**
 * migrateToStorage.ts
 *
 * One-time migration: uploads any base64 image/video blobs stored in the
 * `scripts.metadata` column to Supabase Storage (DevZeroImage / DevZeroVideo
 * buckets) and updates the metadata records to point to the new public URLs.
 *
 * Safe to run multiple times — records that already contain a URL are skipped.
 *
 * Usage:
 *   npm run migrate:storage
 */

import * as dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── helpers ──────────────────────────────────────────────────────────────────

async function uploadBase64ToStorage(
    base64String: string,
    mimeType: "image/png" | "video/mp4"
): Promise<string> {
    const isImage = mimeType === "image/png";
    const bucket = isImage ? "DevZeroImage" : "DevZeroVideo";
    const ext = isImage ? "png" : "mp4";
    const fileName = `migrated-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Strip the data URI prefix if present  (data:image/png;base64,...)
    const base64Data = base64String.includes(",")
        ? base64String.split(",")[1]
        : base64String;

    const buffer = Buffer.from(base64Data, "base64");

    const { error } = await supabase.storage
        .from(bucket)
        .upload(fileName, buffer, {
            contentType: mimeType,
            upsert: false,
        });

    if (error) throw new Error(`Upload to ${bucket} failed: ${error.message}`);

    const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

    return urlData.publicUrl;
}

// ── main ─────────────────────────────────────────────────────────────────────

async function migrate() {
    console.log("════════════════════════════════════════════════");
    console.log("  Starting base64 → Supabase Storage migration  ");
    console.log("  Buckets: DevZeroImage  |  DevZeroVideo         ");
    console.log("════════════════════════════════════════════════\n");

    const { data: scripts, error } = await supabase
        .from("scripts")
        .select("id, metadata");

    if (error) {
        console.error("Failed to fetch scripts:", error.message);
        process.exit(1);
    }

    if (!scripts || scripts.length === 0) {
        console.log("No scripts found. Nothing to migrate.");
        return;
    }

    console.log(`Found ${scripts.length} records to check.\n`);

    let migrated = 0;
    let skipped = 0;
    let failed = 0;

    for (const script of scripts) {
        const meta: Record<string, any> = script.metadata || {};
        const updates: Record<string, any> = { ...meta };
        let changed = false;

        // ── Image: stored in `background` or `image` field ───────────────────
        for (const field of ["background", "image"] as const) {
            const val: string | undefined = meta[field];
            if (val && val.startsWith("data:image")) {
                try {
                    console.log(`[${script.id}] Migrating ${field} image...`);
                    const url = await uploadBase64ToStorage(val, "image/png");
                    updates[field] = url;
                    changed = true;
                    console.log(`[${script.id}] ✅ ${field} → ${url}`);
                } catch (err: any) {
                    console.error(`[${script.id}] ❌ ${field} migration failed:`, err.message);
                    failed++;
                }
            }
        }

        // ── Video: stored in `video` field ───────────────────────────────────
        const videoVal: string | undefined = meta.video;
        if (videoVal && videoVal.startsWith("data:video")) {
            try {
                console.log(`[${script.id}] Migrating video...`);
                const url = await uploadBase64ToStorage(videoVal, "video/mp4");
                updates.video = url;
                changed = true;
                console.log(`[${script.id}] ✅ video → ${url}`);
            } catch (err: any) {
                console.error(`[${script.id}] ❌ video migration failed:`, err.message);
                failed++;
            }
        }

        if (!changed) {
            console.log(`[${script.id}] ⏭  Skipped (already URL or no media)`);
            skipped++;
            continue;
        }

        // Write updated metadata back to DB
        const { error: updateError } = await supabase
            .from("scripts")
            .update({ metadata: updates })
            .eq("id", script.id);

        if (updateError) {
            console.error(`[${script.id}] ❌ DB update failed:`, updateError.message);
            failed++;
        } else {
            migrated++;
        }

        // Small delay to avoid rate-limiting
        await new Promise((r) => setTimeout(r, 300));
    }

    console.log("\n════════════════════════════════════════════");
    console.log(`  Migration complete!`);
    console.log(`  ✅ Migrated : ${migrated}`);
    console.log(`  ⏭  Skipped  : ${skipped}`);
    console.log(`  ❌ Failed   : ${failed}`);
    console.log("════════════════════════════════════════════");
}

migrate().catch(console.error);
