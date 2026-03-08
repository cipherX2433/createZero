-- CreatorZero Database Schema

-- 1. Users Table (Custom Auth)
-- This replaces Supabase auth.users for our application's direct authentication.
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles Table 
-- Links to the custom users table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    niche TEXT,
    goals TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scripts Table
CREATE TABLE IF NOT EXISTS public.scripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    hook TEXT NOT NULL,
    body TEXT NOT NULL,
    cta TEXT NOT NULL,
    caption TEXT NOT NULL,
    hashtags TEXT[],
    viral_score INTEGER CHECK (viral_score BETWEEN 0 AND 100),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Trends Table
CREATE TABLE IF NOT EXISTS public.trends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL, -- e.g., 'tiktok', 'instagram'
    topic TEXT NOT NULL,
    description TEXT,
    relevance_score INTEGER CHECK (relevance_score BETWEEN 0 AND 100),
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Usage Logs Table
CREATE TABLE IF NOT EXISTS public.usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- e.g., 'generate_script'
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Users: Users can only see and edit their own user record
-- We use current_setting('request.jwt.claims', true)::json->>'sub' to extract the custom JWT user ID.
CREATE POLICY "Users can view own user record" ON public.users
    FOR SELECT USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = id
    );

CREATE POLICY "Users can update own user record" ON public.users
    FOR UPDATE USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = id
    );

CREATE POLICY "Allow public signup" ON public.users
    FOR INSERT WITH CHECK (true);

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Allow profile creation on signup" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Scripts: Users can only see and manage their own scripts
CREATE POLICY "Users can view own scripts" ON public.scripts
    FOR SELECT USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can create own scripts" ON public.scripts
    FOR INSERT WITH CHECK (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can delete own scripts" ON public.scripts
    FOR DELETE USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

-- Trends: Everyone can read trends
CREATE POLICY "Public read trends" ON public.trends
    FOR SELECT USING (true);

-- Usage Logs: Users can only see their own logs
CREATE POLICY "Users can view own logs" ON public.usage_logs
    FOR SELECT USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

-- GRANTS (Ensure the anon and authenticated roles can actually use the schema and tables)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;


-- 6. Videos Table (AI Video Generation)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    prompt TEXT NOT NULL,
    niche TEXT NOT NULL,
    duration INTEGER,
    resolution TEXT,
    style TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    video_url TEXT,
    external_job_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos" ON public.videos
    FOR SELECT USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can create own videos" ON public.videos
    FOR INSERT WITH CHECK (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can update own videos" ON public.videos
    FOR UPDATE USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );

CREATE POLICY "Users can delete own videos" ON public.videos
    FOR DELETE USING (
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid = user_id
    );
