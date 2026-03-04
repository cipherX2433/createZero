import { supabase } from '@/lib/supabase';

export interface Script {
    id: string;
    user_id: string;
    hook: string;
    body: string;
    cta: string;
    caption: string;
    hashtags: string[];
    viral_score: number;
    created_at: string;
}

export interface GenerateScriptRequest {
    prompt: string;
    niche: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

async function getAuthHeader(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? { 'Authorization': `Bearer ${session.access_token}` } : {};
}

export const apiService = {
    async fetchScripts(): Promise<Script[]> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/scripts/history`, {
            headers: {
                ...authHeader,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch scripts');
        const result = await response.json();
        return result.data;
    },

    async generateScript(data: GenerateScriptRequest): Promise<Script> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/scripts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate script');
        const result = await response.json();
        return result.data;
    },

    async signup(data: any): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Signup failed');
        return result.data;
    },

    async login(data: any): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Login failed');
        return result.data;
    },
};
