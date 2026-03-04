import bcrypt from 'bcryptjs';
import { supabase } from '../db/supabase';
import { createClient } from '@supabase/supabase-js';

export const authService = {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    },

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    },

    async signup(email: string, password: string) {
        console.log('Starting custom signup for:', email);

        // 1. Hash password FIRST for atomic storage via metadata
        const passwordHash = await this.hashPassword(password);

        // 2. Sign up to Supabase Auth with metadata
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    password_hash: passwordHash
                }
            }
        });

        if (error) {
            console.error('Supabase Auth signUp error:', error);
            throw error;
        }

        if (!data.user) throw new Error('Failed to create user');
        console.log('User created successfully:', data.user.id);

        return data;
    },

    async login(email: string, password: string) {
        console.log('Attempting custom login for:', email);

        // 1. Fetch user profile to get hash (Bypasses RLS if SERVICE_ROLE_KEY is in use)
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, password_hash')
            .eq('email', email)
            .maybeSingle();

        if (profileError) {
            console.error('Database lookup error during login:', profileError);
            throw new Error('Internal server error during authentication');
        }

        if (!profile) {
            console.warn('User not found in profiles table for email:', email);
            throw new Error('User not found');
        }

        if (!profile.password_hash) {
            console.warn('User found but has no password hash:', email);
            throw new Error('Account requires password setup or migration');
        }

        // 2. Manual comparison
        const isValid = await this.verifyPassword(password, profile.password_hash);
        if (!isValid) {
            console.warn('Invalid password attempt for:', email);
            throw new Error('Invalid credentials');
        }

        // 3. Sign in to Supabase to get session
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('Supabase Auth signIn error:', error);
            throw error;
        }

        console.log('User logged in successfully:', data.user.id);
        return data;
    }
};
