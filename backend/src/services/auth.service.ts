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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError) throw profileError;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("email, name")
      .eq("id", userId)
      .single();

    if (userError) throw userError;

    return {
      ...profile,
      email: user.email,
      name: user.name,
    };
  },

  async updateProfile(userId: string, profileData: any) {
    console.log("[AuthService] updateProfile called for userId:", userId);
    console.log("[AuthService] profileData received:", JSON.stringify(profileData));

    try {
      const { name, niche, goals } = profileData;

      // Update users table if name is provided
      if (name !== undefined) {
        console.log("[AuthService] Updating users.name to:", name);
        const { error: userErr } = await supabase
          .from("users")
          .update({ name })
          .eq("id", userId);

        if (userErr) {
          console.error("[AuthService] users.name update failed:", userErr);
          throw new Error(`User name update failed: ${userErr.message}`);
        }
      }

      // Prepare profile table updates
      const profileUpdates: any = {};
      if (niche !== undefined) profileUpdates.niche = niche;
      if (goals !== undefined) profileUpdates.goals = goals;

      if (Object.keys(profileUpdates).length > 0) {
        console.log("[AuthService] Updating profiles table with:", JSON.stringify(profileUpdates));
        const { error: profileErr } = await supabase
          .from("profiles")
          .update(profileUpdates)
          .eq("user_id", userId);

        if (profileErr) {
          console.error("[AuthService] profiles update failed:", profileErr);
          throw new Error(`Profile data update failed: ${profileErr.message}`);
        }
      }

      console.log("[AuthService] Profile update cycle complete. Fetching updated profile.");
      return this.getProfile(userId);
    } catch (err: any) {
      console.error("[AuthService] CRITICAL error in updateProfile:", err);
      throw err;
    }
  },
};