import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, History, TrendingUp, Send, Loader2, LogOut } from "lucide-react";
import { apiService, Script } from "@/services/api.service";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [prompt, setPrompt] = useState("");
    const [niche, setNiche] = useState("Tech/SaaS");
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<Script[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [currentScript, setCurrentScript] = useState<Script | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setIsHistoryLoading(true);
        try {
            const data = await apiService.fetchScripts();
            setHistory(data);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const handleSignout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const script = await apiService.generateScript({ prompt, niche });
            setCurrentScript(script);
            setHistory([script, ...history]);
        } catch (err) {
            console.error("Failed to generate script", err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-br from-white to-slate-500 bg-clip-text text-transparent tracking-tighter">
                            CREATOR<span className="text-blue-500">ZERO</span>
                        </h1>
                        <p className="text-slate-400 font-medium">Precision-engineered for viral growth.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="ghost" className="gap-2 text-slate-400 hover:text-white hover:bg-slate-900">
                            <History size={18} /> History
                        </Button>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                            <TrendingUp size={18} /> Trends
                        </Button>
                        <Button
                            variant="outline"
                            className="gap-2 border-slate-800 text-slate-400 hover:text-white hover:bg-red-950/30 hover:border-red-500/50 transition-colors"
                            onClick={handleSignout}
                        >
                            <LogOut size={18} /> Signout
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Production Area */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Sparkles className="text-blue-400" /> Script Architect
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Target Niche</Label>
                                        <Input
                                            value={niche}
                                            onChange={(e) => setNiche(e.target.value)}
                                            className="bg-slate-950 border-slate-800 focus:border-blue-500 h-10"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400 uppercase text-[10px] font-bold tracking-widest">Topic/Idea</Label>
                                        <Input
                                            placeholder="e.g. Scaling a SaaS..."
                                            value={prompt}
                                            onChange={(e) => setPrompt(e.target.value)}
                                            className="bg-slate-950 border-slate-800 focus:border-blue-500 h-10"
                                        />
                                    </div>
                                </div>
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isGenerating || !prompt}
                                    className="w-full h-12 bg-white text-black hover:bg-slate-200 font-bold text-lg group"
                                >
                                    {isGenerating ? "Synthesizing..." : (
                                        <span className="flex items-center gap-2">
                                            Generate Script <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        {currentScript && (
                            <Card className="bg-slate-900 border-blue-500/50 border animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="border-b border-slate-800 pb-4">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-blue-400">Viral Script Output</CardTitle>
                                        <div className="px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                                            <span className="text-blue-400 font-bold text-sm">Score: {currentScript.viral_score}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hook</h3>
                                        <p className="text-xl font-medium leading-tight">{currentScript.hook}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Body</h3>
                                        <p className="text-slate-300 leading-relaxed">{currentScript.body}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Caption</h3>
                                        <p className="text-slate-400 italic">"{currentScript.caption}"</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {currentScript.hashtags.map((tag) => (
                                            <span key={tag} className="text-blue-500 text-sm font-medium">#{tag}</span>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <History className="text-slate-500" size={18} /> Recent History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isHistoryLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="animate-spin text-slate-500" />
                                    </div>
                                ) : history.length === 0 ? (
                                    <p className="text-center text-slate-500 text-sm py-8">No generation history yet.</p>
                                ) : (
                                    history.slice(0, 5).map((script) => (
                                        <div
                                            key={script.id}
                                            className="p-3 bg-slate-950 rounded-lg border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
                                            onClick={() => setCurrentScript(script)}
                                        >
                                            <p className="text-sm font-medium truncate">{script.hook}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[10px] text-slate-500">{new Date(script.created_at).toLocaleDateString()}</span>
                                                <span className="text-[10px] font-bold text-green-500">{script.viral_score}/100</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
