"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const supabase_1 = require("../db/supabase");
const jwt_1 = require("../utils/jwt");
exports.authService = {
    async hashPassword(password) {
        return bcryptjs_1.default.hash(password, 10);
    },
    async verifyPassword(password, hash) {
        return bcryptjs_1.default.compare(password, hash);
    },
    async signup(email, password, name) {
        console.log("Starting signup for:", email);
        // check if user already exists
        const { data: existingUser } = await supabase_1.supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .maybeSingle();
        if (existingUser) {
            throw new Error("User already exists");
        }
        // hash password
        const passwordHash = await this.hashPassword(password);
        // create user
        const { data: user, error: userError } = await supabase_1.supabase
            .from("users")
            .insert({
            email,
            password_hash: passwordHash,
            name,
        })
            .select()
            .single();
        if (userError) {
            console.error("Error creating user:", userError);
            throw new Error("Failed to create user");
        }
        // create profile
        const { error: profileError } = await supabase_1.supabase
            .from("profiles")
            .insert({
            user_id: user.id,
            role: "user",
        });
        if (profileError) {
            console.error("Error creating profile:", profileError);
            throw new Error("Failed to create profile");
        }
        // generate JWT
        const token = (0, jwt_1.generateToken)(user.id, user.email);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            token,
        };
    },
    async login(email, password) {
        console.log("Login attempt:", email);
        const { data: user, error } = await supabase_1.supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();
        if (error) {
            console.error(error);
            throw new Error("Database error");
        }
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const valid = await this.verifyPassword(password, user.password_hash);
        if (!valid) {
            throw new Error("Invalid credentials");
        }
        const token = (0, jwt_1.generateToken)(user.id, user.email);
        const { data: profile } = await supabase_1.supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .single();
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            profile,
            token,
        };
    },
    async getProfile(userId) {
        const { data, error } = await supabase_1.supabase
            .from("profiles")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (error)
            throw error;
        return data;
    },
    async updateProfile(userId, profileData) {
        const { data, error } = await supabase_1.supabase
            .from("profiles")
            .update(profileData)
            .eq("user_id", userId)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
};
