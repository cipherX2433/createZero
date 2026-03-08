import * as dotenv from 'dotenv';
dotenv.config();
import { aiService } from './src/ai/ai.service';
import { supabase } from './src/db/supabase';

async function testGeneration() {
    try {
        console.log("Testing image generation directly through AI service...");
        const imageUrl = await aiService.generateImage("A tiny pixel art house", "720P", "16:9");
        console.log("Result URL:", imageUrl);

        // check if url is publicly accessible right now
        const resp = await fetch(imageUrl, { method: 'HEAD' });
        console.log("Image HEAD status:", resp.status);

    } catch (e) {
        console.error("Test failed:", e);
    }
}

testGeneration();
