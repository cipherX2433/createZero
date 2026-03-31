import dns from "node:dns";
import { createClient } from "@supabase/supabase-js";

// Fix for Node 18+ fetch IPv6 routing timeouts to AWS/Supabase
dns.setDefaultResultOrder('ipv4first');


console.log("ENV CHECK:", {
  url: process.env.SUPABASE_URL,
  service: process.env.SUPABASE_SERVICE_ROLE_KEY,
})

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
console.log("Using service role:", process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0,20))

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)