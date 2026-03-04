import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sparkles, History, Send, Loader2, LogOut, Copy, Check,
    Zap, Target, FileText, Hash, ChevronDown
} from "lucide-react";
import { apiService, Script } from "@/services/api.service";
import { useNavigate } from "react-router-dom";

const NICHES = [
    "Tech / SaaS", "Finance / Investing", "Health & Fitness", "Personal Development",
    "E-commerce", "Marketing", "AI & Automation", "Lifestyle", "Education", "Entrepreneurship",
];

const PURPOSES = [
    "Brand Awareness", "Lead Generation", "Product Launch", "Community Building",
    "Drive Traffic", "Grow Following", "Educate Audience", "Go Viral", "Sell a Service",
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Copy"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
    );
}

function ScoreBar({ score }: { score: number }) {
    const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-yellow-500" : "bg-red-500";
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                    className={`h-2 rounded-full transition-all duration-700 ${color}`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <span className={`text-sm font-bold tabular-nums ${score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                {score}/100
            </span>
        </div>
    );
}

export default function Dashboard() {
    const [prompt, setPrompt] = useState("");
    const [niche, setNiche] = useState("Tech / SaaS");
    const [purpose, setPurpose] = useState("Brand Awareness");
    const [description, setDescription] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<Script[]>([]);
    const [isHistoryLoading, setIsHistoryLoading] = useState(false);
    const [currentScript, setCurrentScript] = useState<Script | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [nicheOpen, setNicheOpen] = useState(false);
    const [purposeOpen, setPurposeOpen] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => { loadHistory(); }, []);

    useEffect(() => {
        if (currentScript && outputRef.current) {
            outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [currentScript]);

    const loadHistory = async () => {
        setIsHistoryLoading(true);
        try {
            const data = await apiService.fetchScripts();
            setHistory(data ?? []);
        } catch (err) {
            console.error("Failed to load history", err);
        } finally {
            setIsHistoryLoading(false);
        }
    };

    const handleSignout = () => {
        apiService.logout();
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);
        setGenerateError(null);
        try {
            // Combine topic + description into one rich prompt
            const fullPrompt = description.trim()
                ? `${prompt}. Additional context: ${description}`
                : prompt;

            const script = await apiService.generateScript({ prompt: fullPrompt, niche, purpose });
            setCurrentScript(script);
            setHistory((prev) => [script, ...prev]);
        } catch (err: any) {
            setGenerateError(err.message || "Generation failed");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Top Nav */}
            <header className="border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-black tracking-tighter">
                        CREATOR<span className="text-blue-500">ZERO</span>
                    </h1>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={handleSignout}
                    >
                        <LogOut size={16} /> Sign Out
                    </Button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* === LEFT: Input Panel === */}
                <div className="lg:col-span-5 space-y-5">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight mb-1">
                            Script <span className="text-blue-500">Architect</span>
                        </h2>
                        <p className="text-slate-400 text-sm">Generate viral posts tailored to your audience and goals.</p>
                    </div>

                    <Card className="bg-slate-900 border-slate-800 shadow-xl">
                        <CardContent className="p-6 space-y-5">

                            {/* Niche Selector */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Target size={12} /> Target Niche
                                </Label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { setNicheOpen(!nicheOpen); setPurposeOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 h-10 bg-slate-950 border border-slate-800 rounded-md text-sm text-left hover:border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <span>{niche}</span>
                                        <ChevronDown size={14} className={`text-slate-500 transition-transform ${nicheOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {nicheOpen && (
                                        <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-800 rounded-md shadow-xl overflow-hidden">
                                            {NICHES.map((n) => (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => { setNiche(n); setNicheOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 transition-colors ${niche === n ? "text-blue-400 bg-slate-800/50" : "text-slate-300"}`}
                                                >
                                                    {n}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Topic / Idea */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Sparkles size={12} /> Topic / Idea
                                </Label>
                                <Input
                                    placeholder="e.g. How AI is replacing junior developers..."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="bg-slate-950 border-slate-800 focus:border-blue-500 h-10 placeholder:text-slate-600"
                                />
                            </div>

                            {/* Post Purpose */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Zap size={12} /> Post Goal / Purpose
                                </Label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => { setPurposeOpen(!purposeOpen); setNicheOpen(false); }}
                                        className="w-full flex items-center justify-between px-3 h-10 bg-slate-950 border border-slate-800 rounded-md text-sm text-left hover:border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                                    >
                                        <span>{purpose}</span>
                                        <ChevronDown size={14} className={`text-slate-500 transition-transform ${purposeOpen ? "rotate-180" : ""}`} />
                                    </button>
                                    {purposeOpen && (
                                        <div className="absolute z-20 mt-1 w-full bg-slate-900 border border-slate-800 rounded-md shadow-xl overflow-hidden">
                                            {PURPOSES.map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => { setPurpose(p); setPurposeOpen(false); }}
                                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 transition-colors ${purpose === p ? "text-blue-400 bg-slate-800/50" : "text-slate-300"}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Detailed Description */}
                            <div className="space-y-2">
                                <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <FileText size={12} /> Detailed Description <span className="text-slate-600 normal-case ml-1">(optional)</span>
                                </Label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your product, service, or any extra context the AI should know to create a better post..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 resize-none transition-colors"
                                />
                            </div>

                            {generateError && (
                                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-md p-3">
                                    {generateError}
                                </div>
                            )}

                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full h-12 bg-blue-600 hover:bg-blue-500 font-bold text-base tracking-wide group disabled:opacity-50 transition-all"
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 size={18} className="animate-spin" /> Synthesizing with AI...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Generate Post <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* === RIGHT: Output + History === */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Script Output */}
                    {currentScript ? (
                        <div ref={outputRef}>
                            <Card className="bg-slate-900 border-blue-500/40 border shadow-2xl shadow-blue-500/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="border-b border-slate-800 pb-4">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-blue-400 flex items-center gap-2">
                                            <Sparkles size={18} /> Generated Post
                                        </CardTitle>
                                        <div className="text-xs text-slate-500">Viral Score</div>
                                    </div>
                                    <ScoreBar score={currentScript.viral_score} />
                                </CardHeader>
                                <CardContent className="pt-5 space-y-5">

                                    {/* Hook */}
                                    <div className="space-y-1.5 p-4 bg-slate-950 rounded-lg border border-slate-800 group">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">🪝 Hook</span>
                                            <CopyButton text={currentScript.hook} />
                                        </div>
                                        <p className="text-lg font-semibold leading-snug">{currentScript.hook}</p>
                                    </div>

                                    {/* Body */}
                                    <div className="space-y-1.5 p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">📝 Body</span>
                                            <CopyButton text={currentScript.body} />
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{currentScript.body}</p>
                                    </div>

                                    {/* CTA */}
                                    <div className="space-y-1.5 p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">⚡ Call to Action</span>
                                            <CopyButton text={currentScript.cta} />
                                        </div>
                                        <p className="text-green-300 text-sm font-medium">{currentScript.cta}</p>
                                    </div>

                                    {/* Caption */}
                                    <div className="space-y-1.5 p-4 bg-slate-950 rounded-lg border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">💬 Caption</span>
                                            <CopyButton text={currentScript.caption} />
                                        </div>
                                        <p className="text-slate-400 italic text-sm">"{currentScript.caption}"</p>
                                    </div>

                                    {/* Hashtags */}
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-1.5">
                                            <Hash size={12} className="text-slate-500" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hashtags</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {currentScript.hashtags.map((tag) => (
                                                <span key={tag} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Copy All */}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 gap-2"
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${currentScript.hook}\n\n${currentScript.body}\n\n${currentScript.cta}\n\n${currentScript.caption}\n\n${currentScript.hashtags.map(h => `#${h}`).join(' ')}`
                                            );
                                        }}
                                    >
                                        <Copy size={14} /> Copy Full Post
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="hidden lg:flex flex-col items-center justify-center h-64 border border-dashed border-slate-800 rounded-xl text-slate-600">
                            <Sparkles size={40} className="mb-3 opacity-30" />
                            <p className="text-sm">Your generated post will appear here</p>
                        </div>
                    )}

                    {/* History */}
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2 text-slate-300">
                                <History className="text-slate-500" size={16} /> Recent History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isHistoryLoading ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin text-slate-600" />
                                </div>
                            ) : history.length === 0 ? (
                                <p className="text-center text-slate-600 text-sm py-8">
                                    No scripts generated yet. Create your first one!
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {history.slice(0, 8).map((script) => (
                                        <div
                                            key={script.id}
                                            className={`p-3 bg-slate-950 rounded-lg border cursor-pointer transition-all hover:border-slate-700 ${currentScript?.id === script.id ? "border-blue-500/50" : "border-slate-800"}`}
                                            onClick={() => setCurrentScript(script)}
                                        >
                                            <p className="text-sm font-medium truncate text-slate-200">{script.hook}</p>
                                            <div className="flex justify-between items-center mt-1.5">
                                                <span className="text-[10px] text-slate-600">{new Date(script.created_at).toLocaleDateString()}</span>
                                                <span className={`text-[10px] font-bold ${script.viral_score >= 80 ? "text-green-400" : script.viral_score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                                                    {script.viral_score}/100
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
