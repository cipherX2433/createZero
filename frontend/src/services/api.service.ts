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

export const apiService = {
    async fetchScripts(): Promise<Script[]> {
        const response = await fetch(`${API_BASE_URL}/scripts/history`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('sb-token')}`, // Placeholder for real token handling
            },
        });
        if (!response.ok) throw new Error('Failed to fetch scripts');
        const result = await response.json();
        return result.data;
    },

    async generateScript(data: GenerateScriptRequest): Promise<Script> {
        const response = await fetch(`${API_BASE_URL}/scripts/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('sb-token')}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to generate script');
        const result = await response.json();
        return result.data;
    },
};
