import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            if (error.message.includes("rate limit")) {
                setError("Email rate limit exceeded. Please try again later or disable 'Confirm email' in your Supabase project settings.");
            } else {
                setError(error.message);
            }
            setIsLoading(false);
        } else if (data.user && !data.session) {
            // Email confirmation is required
            setSuccess(true);
            setIsLoading(false);
        } else if (data.session) {
            navigate("/onboarding");
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase">
                        Create <span className="text-blue-500">Zero</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Join the elite circle of data-driven creators.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-md text-sm">
                                Authentication sequence initiated. Please verify your email to proceed.
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="architect@creatorzero.ai"
                                className="bg-slate-950 border-slate-800 focus:border-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-slate-950 border-slate-800 focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-500 font-bold uppercase tracking-widest"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Access"}
                        </Button>
                        <p className="text-sm text-slate-400">
                            Already a member?{" "}
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
