import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { apiService } from "@/services/api.service";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [niche, setNiche] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNext = async () => {
        if (step < 2) {
            setStep(step + 1);
        } else {
            setIsLoading(true);
            try {
                // Update profile via our custom backend
                await apiService.updateProfile({ niche });
                navigate("/dashboard");
            } catch (err) {
                console.error("Onboarding failed:", err);
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-slate-900 border-slate-800 text-white">
                <CardHeader>
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                        <Sparkles className="text-blue-500" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tighter uppercase">
                        Initialize <span className="text-blue-500">Profile</span>
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Configuring your content engine for maximum impact.
                    </CardDescription>
                </CardHeader>
                <CardContent className="py-6">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-slate-500 uppercase tracking-widest">Primary Niche</Label>
                                <Input
                                    placeholder="e.g. AI Business, Finance, Lifestyle..."
                                    className="bg-slate-950 border-slate-800 h-12 focus:border-blue-500"
                                    value={niche}
                                    onChange={(e) => setNiche(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {['Tech', 'SaaS', 'Finance', 'Growth'].map((n) => (
                                    <Button
                                        key={n}
                                        variant="outline"
                                        className="bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300"
                                        onClick={() => setNiche(n)}
                                    >
                                        {n}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 text-center">
                            <div className="py-8">
                                <h3 className="text-xl font-bold mb-2">Systems Ready</h3>
                                <p className="text-slate-400">Your engine is calibrated to the <span className="text-blue-500">{niche}</span> niche.</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full bg-white text-black hover:bg-slate-200 font-bold h-12 flex items-center justify-center gap-2 group"
                        onClick={handleNext}
                        disabled={(!niche && step === 1) || isLoading}
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                {step === 1 ? "Next Phase" : "Enter Dashboard"}
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

