import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Zap } from "lucide-react";
import { apiService } from "@/services/api.service";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await apiService.login({ email, password });
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden font-geist">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] glow-teal opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] glow-white opacity-10 blur-[100px]" />
            </div>

            <Card className="w-full max-w-md glass border-white/5 text-white relative z-10 shadow-2xl">
                <CardHeader className="space-y-2 text-center">
                    <div className="w-12 h-12 rounded-xl bg-white mx-auto flex items-center justify-center mb-4">
                        <Zap className="w-6 h-6 text-black fill-black" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase">
                        Welcome <span className="text-teal-400">Back</span>
                    </CardTitle>
                    <CardDescription className="text-white/40 font-medium">
                        Secure connection required for neural deployment.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-xs font-bold uppercase tracking-wider">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="architect@creatorzero.ai"
                                className="bg-white/[0.03] border-white/5 focus:border-teal-500 h-12 rounded-xl"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" title="password" className="text-[11px] font-bold uppercase tracking-widest text-white/40">Secret Key</Label>
                            <Input
                                id="password"
                                type="password"
                                className="bg-white/[0.03] border-white/5 focus:border-teal-500 h-12 rounded-xl"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-6 pt-4">
                        <Button
                            className="w-full bg-white hover:bg-white/90 text-black font-black uppercase tracking-widest h-12 rounded-xl transition-all active:scale-95"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Login"}
                        </Button>
                        <p className="text-[13px] text-white/40 font-medium">
                            New operative?{" "}
                            <Link to="/signup" className="text-white hover:text-teal-400 transition-colors underline-offset-4 underline">
                                Register Terminal
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

