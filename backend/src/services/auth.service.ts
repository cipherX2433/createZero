import bcrypt from "bcryptjs";
import { supabase } from "../db/supabase";
import { generateToken } from "../utils/jwt";

export const authService = {

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  },

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  },

  async signup(email: string, password: string, name?: string) {
    console.log("Starting signup for:", email);

    // check if user already exists
    const { data: existingUser } = await supabase
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
    const { data: user, error: userError } = await supabase
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
    const { error: profileError } = await supabase
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
    const token = generateToken(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    };
  },

  async login(email: string, password: string) {
    console.log("Login attempt:", email);

    const { data: user, error } = await supabase
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

    const token = generateToken(user.id, user.email);

    const { data: profile } = await supabase
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

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return data;
  },

  async updateProfile(userId: string, profileData: any) {
    const { data, error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) throw error;

    return data;
  },
};