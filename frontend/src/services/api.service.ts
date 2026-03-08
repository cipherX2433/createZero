// import { supabase } from '@/lib/supabase';


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

export interface GenerateImageRequest {
    prompt: string;
    resolution?: string;
    aspect_ratio?: string;
}

export interface GenerateVideoRequest {
    prompt: string;
    resolution?: string;
    aspect_ratio?: string;
    mode: 'Image' | 'Video';
}


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

async function getAuthHeader(): Promise<Record<string, string>> {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
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

    async generateImage(data: GenerateImageRequest): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/scripts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            throw new Error(errJson.error || 'Failed to generate image');
        }
        const result = await response.json();
        return result.data;
    },

    async generateVideoInline(data: GenerateVideoRequest): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/scripts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            throw new Error(errJson.error || 'Failed to generate video');
        }
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
        if (!response.ok) {
            const error = typeof result.error === 'object'
                ? JSON.stringify(result.error)
                : (result.error || 'Signup failed');
            throw new Error(error);
        }

        if (result.success && result.data.token) {
            localStorage.setItem('auth_token', result.data.token);
            window.dispatchEvent(new Event('auth-change'));
        }

        return result.data;
    },

    async login(data: any): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
            const error = typeof result.error === 'object'
                ? JSON.stringify(result.error)
                : (result.error || 'Login failed');
            throw new Error(error);
        }

        if (result.success && result.data.token) {
            localStorage.setItem('auth_token', result.data.token);
            window.dispatchEvent(new Event('auth-change'));
        }

        return result.data;
    },

    async updateProfile(data: any): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update profile');
        const result = await response.json();
        return result.data;
    },

    async fetchProfile(): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                ...authHeader,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        const result = await response.json();
        return result.data;
    },

    // --- VIDEO GENERATION API ---
    async generateVideo(data: { prompt: string, niche: string, duration?: number, resolution?: string, style?: string }): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/video/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate video');
        const result = await response.json();
        return result.data;
    },

    async checkVideoStatus(jobId: string): Promise<any> {
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/video/status/${jobId}`, {
            headers: {
                ...authHeader,
            },
        });
        if (!response.ok) throw new Error('Failed to check video status');
        const result = await response.json();
        return result.data;
    },

    async fetchVideoHistory(): Promise<any[]> {
        // Videos are stored in the scripts table alongside images.
        // Filter by metadata.create_mode === 'Video' or presence of metadata.video.
        const authHeader = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}/scripts/history`, {
            headers: {
                ...authHeader,
            },
        });
        if (!response.ok) {
            console.error('Failed to fetch video history');
            return [];
        }
        const result = await response.json();
        const all: any[] = result.data || [];
        return all.filter(
            (item) => item.metadata?.create_mode === 'Video' || item.metadata?.video
        );
    },

    logout() {
        localStorage.removeItem('auth_token');
    }
};


