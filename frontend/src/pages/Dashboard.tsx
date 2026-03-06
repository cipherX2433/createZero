import { useState, useRef, useEffect } from "react";
import { apiService } from "@/services/api.service";
import { useNavigate } from "react-router-dom";
import { LogOut, Zap } from "lucide-react";
import SocialPostCanvas from "@/components/socialPostCanva";

const NICHES = [
    { label: "Tech / SaaS", value: "tech_saas", colors: { primary: "#6366f1", secondary: "#0ea5e9", bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)", accent: "#a78bfa", tag: "#1e1b4b" } },
    { label: "Health & Fitness", value: "health_fitness", colors: { primary: "#10b981", secondary: "#f59e0b", bg: "linear-gradient(135deg, #064e3b, #065f46, #14532d)", accent: "#6ee7b7", tag: "#052e16" } },
    { label: "Finance & Investing", value: "finance", colors: { primary: "#f59e0b", secondary: "#10b981", bg: "linear-gradient(135deg, #1c1917, #292524, #1c1917)", accent: "#fcd34d", tag: "#1c1917" } },
    { label: "Personal Branding", value: "personal_brand", colors: { primary: "#ec4899", secondary: "#8b5cf6", bg: "linear-gradient(135deg, #1a0533, #2d0a4e, #1a0533)", accent: "#f9a8d4", tag: "#500724" } },
    { label: "E-Commerce / DTC", value: "ecommerce", colors: { primary: "#f97316", secondary: "#ef4444", bg: "linear-gradient(135deg, #1c0a00, #2c1200, #1c0a00)", accent: "#fed7aa", tag: "#431407" } },
    { label: "Marketing & Growth", value: "marketing", colors: { primary: "#3b82f6", secondary: "#06b6d4", bg: "linear-gradient(135deg, #0a0a2e, #0d1b4b, #0a0a2e)", accent: "#93c5fd", tag: "#1e3a8a" } },
    { label: "Mindset & Motivation", value: "mindset", colors: { primary: "#a78bfa", secondary: "#f472b6", bg: "linear-gradient(135deg, #0c001a, #1a0030, #0c001a)", accent: "#ddd6fe", tag: "#2e1065" } },
    { label: "Education & Coaching", value: "education", colors: { primary: "#06b6d4", secondary: "#8b5cf6", bg: "linear-gradient(135deg, #0a1628, #0c2340, #0a1628)", accent: "#67e8f9", tag: "#083344" } },
];

const GOALS = [
    "Educate Audience",
    "Drive Engagement",
    "Build Authority",
    "Generate Leads",
    "Inspire & Motivate",
    "Promote Product/Service",
    "Grow Following",
    "Spark Controversy / Debate",
];

const TONES = [
    { label: "Professional", value: "professional", icon: "💼" },
    { label: "Casual", value: "casual", icon: "☕" },
    { label: "Aggressive", value: "aggressive", icon: "🔥" },
    { label: "Storytelling", value: "storytelling", icon: "📖" },
];

export default function Dashboard() {
    const navigate = useNavigate();
    const [niche, setNiche] = useState("");
    const [topic, setTopic] = useState("");
    const [goal, setGoal] = useState("");
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");
    const [tone, setTone] = useState("professional");
    const [view, setView] = useState("card");
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [error, setError] = useState("");
    const cardRef = useRef(null);
    const canvasRef = useRef<any>(null);

    const selectedNiche = NICHES.find(n => n.value === niche);
    const colors = selectedNiche?.colors || {
        primary: "#6366f1", secondary: "#0ea5e9",
        bg: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        accent: "#a78bfa", tag: "#1e1b4b"
    };

    const handleSignout = () => {
        apiService.logout();
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    };

    const fetchHistory = async () => {
        try {
            const data = await apiService.fetchScripts();
            setHistory(data || []);
        } catch (e) {
            console.error("Failed to fetch history:", e);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const loadFromHistory = (h: any) => {
        const mappedPost = {
            headline: h.metadata?.headline || h.hook,
            subtext: h.body,
            hook_quote: h.hook,
            key_points: h.metadata?.key_points || [],
            cta: h.cta,
            footer_line: h.caption,
            hashtags: h.hashtags,
            virality_score: h.viral_score,
            background: h.metadata?.background,
            layout: h.metadata?.layout,
            design: h.metadata?.design
        };
        setPost(mappedPost);
        setView("card");
    };

    async function generatePost() {
        if (!niche || !topic || !goal) {
            setError("Please fill in Target Niche, Topic, and Post Goal.");
            return;
        }
        setError("");
        setLoading(true);
        setPost(null);

        try {
            const nicheLabel = NICHES.find(n => n.value === niche)?.label || niche;
            const apiData = await apiService.generateScript({
                prompt: topic,
                niche: nicheLabel,
                purpose: goal,
                description,
                brand_name: brandName,
                tone: tone
            });

            // Map the API response format: .script, .background, .layout
            const mappedPost = apiData.script ? {
                ...apiData.script,
                background: apiData.background,
                layout: apiData.layout,
                design: apiData.design
            } : apiData;

            setPost(mappedPost);
            setView("card");
            fetchHistory(); // Refresh history
        } catch (e: any) {
            setError(e.message || "Failed to generate post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const handleDownload = () => {
        if (canvasRef.current) {
            canvasRef.current.download();
        }
    };

    const scoreColor = post?.virality_score >= 85 ? "#10b981" : post?.virality_score >= 70 ? "#f59e0b" : "#ef4444";

    return (
        <div style={{ minHeight: "100vh", background: "#000000", fontFamily: "'Geist', sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] glow-teal opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] glow-white opacity-10 blur-[100px]" />
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&family=Space+Mono:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #000; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 3px; }
        .gen-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(20,184,166,0.3) !important; }
        .gen-btn:active { transform: translateY(0); }
        .gen-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
        .tab-btn { transition: all 0.2s; }
        .tab-btn:hover { background: rgba(255,255,255,0.06) !important; }
        select option { background: #000; color: #fff; }
        .input-field:focus { outline: none; border-color: #14b8a6 !important; box-shadow: 0 0 0 3px rgba(20,184,166,0.1); }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .card-shine { background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%); }
      `}</style>

            {/* Header */}
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 32, height: 32, background: "white", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                        <Zap size={18} fill="black" stroke="black" />
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
                            Creator<span style={{ color: "#14b8a6" }}>Zero</span>
                        </div>
                        <div style={{ fontSize: 10, color: "#444", marginTop: 1, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Elite Neural Engine</div>
                    </div>
                </div>

                <button
                    onClick={handleSignout}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#ccc", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
                >
                    <LogOut size={16} /> Sign out
                </button>
            </div>

            <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
                {/* Left Panel */}
                <div style={{ width: 400, minWidth: 400, borderRight: "1px solid rgba(255,255,255,0.06)", padding: 28, display: "flex", flexDirection: "column", gap: 22, overflowY: "auto" }}>

                    {/* Niche */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>🎯</span> Target Niche
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                className="input-field"
                                value={niche}
                                onChange={e => setNiche(e.target.value)}
                                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: niche ? "#fff" : "#555", fontSize: 14, appearance: "none", cursor: "pointer", transition: "border-color 0.2s" }}
                            >
                                <option value="">Select your niche...</option>
                                {NICHES.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
                            </select>
                            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }}>▾</span>
                        </div>
                        {niche && (
                            <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                                {[colors.primary, colors.secondary, colors.accent].map((c, i) => (
                                    <div key={i} style={{ width: 20, height: 20, borderRadius: 4, background: c, border: "2px solid rgba(255,255,255,0.1)" }} title={c} />
                                ))}
                                <span style={{ fontSize: 11, color: "#555", alignSelf: "center" }}>Niche color palette active</span>
                            </div>
                        )}
                    </div>

                    {/* Topic */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>✦</span> Topic / Idea
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="e.g. How to start vibe coding..."
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 14, transition: "border-color 0.2s" }}
                        />
                    </div>

                    {/* Goal */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>⚡</span> Post Goal
                        </label>
                        <div style={{ position: "relative" }}>
                            <select
                                className="input-field"
                                value={goal}
                                onChange={e => setGoal(e.target.value)}
                                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: goal ? "#fff" : "#555", fontSize: 14, appearance: "none", cursor: "pointer", transition: "border-color 0.2s" }}
                            >
                                <option value="">Select goal...</option>
                                {GOALS.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }}>▾</span>
                        </div>
                    </div>

                    {/* Tone Selector */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>🎭</span> Content Tone
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {TONES.map(t => (
                                <button
                                    key={t.value}
                                    onClick={() => setTone(t.value)}
                                    style={{
                                        padding: "10px",
                                        background: tone === t.value ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.03)",
                                        border: `1px solid ${tone === t.value ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.08)"}`,
                                        borderRadius: 10,
                                        color: tone === t.value ? "#14b8a6" : "#888",
                                        fontSize: 12,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 4,
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <span style={{ fontSize: 16 }}>{t.icon}</span>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brand Name */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>🏷️</span> Brand / Product Name <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(optional)</span>
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            placeholder="e.g. CodeZero..."
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
                            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 14, transition: "border-color 0.2s" }}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                            <span>📄</span> Details <span style={{ color: "#333", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 10 }}>(optional)</span>
                        </label>
                        <textarea
                            className="input-field"
                            placeholder="Add any product info, audience details, key messages, or context the AI should know..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "#fff", fontSize: 13, resize: "vertical", lineHeight: 1.6, transition: "border-color 0.2s" }}
                        />
                    </div>

                    {error && (
                        <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", fontSize: 13 }}>
                            {error}
                        </div>
                    )}

                    <button
                        className="gen-btn"
                        onClick={generatePost}
                        disabled={loading}
                        style={{ padding: "15px 24px", background: loading ? "#222" : "white", border: "none", borderRadius: 12, color: loading ? "#555" : "black", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s", marginTop: 4, fontFamily: "'Syne', sans-serif", letterSpacing: 0.5 }}
                    >
                        {loading ? (
                            <><span className="pulse">⚡</span> Crafting your post...</>
                        ) : (
                            <><span>⚡</span> Generate Post</>
                        )}
                    </button>

                    {post && (
                        <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)", fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                            <div style={{ color: "#999", fontWeight: 600, marginBottom: 6 }}>💡 Pro Tips</div>
                            <div>• Post between 7-9am or 6-8pm for max reach</div>
                            <div>• Reply to every comment in the first hour</div>
                            <div>• Add to Stories within 30 min of posting</div>
                        </div>
                    )}

                    {/* History Section */}
                    {history.length > 0 && (
                        <div style={{ marginTop: 10 }}>
                            <label style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: "#666", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                                <span>🕒</span> Recent Generations
                            </label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {history.map((h) => (
                                    <div
                                        key={h.id}
                                        onClick={() => loadFromHistory(h)}
                                        style={{
                                            padding: "12px",
                                            background: "rgba(255,255,255,0.02)",
                                            border: "1px solid rgba(255,255,255,0.05)",
                                            borderRadius: 10,
                                            cursor: "pointer",
                                            transition: "all 0.2s"
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                            e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)";
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                                        }}
                                    >
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#eee", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                            {h.metadata?.headline || h.hook}
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ fontSize: 10, color: "#555" }}>
                                                {new Date(h.created_at).toLocaleDateString()}
                                            </div>
                                            <div style={{ fontSize: 10, color: "#14b8a6", fontWeight: 700 }}>
                                                ⚡ {h.viral_score}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel */}
                <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 20, background: "#07070d" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
                        <div style={{ display: "flex", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 4, gap: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
                            {["card", "text"].map(t => (
                                <button
                                    key={t}
                                    className="tab-btn"
                                    onClick={() => setView(t)}
                                    style={{ padding: "8px 20px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: view === t ? "rgba(255,255,255,0.1)" : "transparent", color: view === t ? "#fff" : "#444", transition: "all 0.2s" }}
                                >
                                    {t === "card" ? "🖼 Image Format" : "📝 Text View"}
                                </button>
                            ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#444" }}>Ready-to-share social media post</div>
                    </div>

                    {/* Card / Text Preview */}
                    <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                        {!post && !loading && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: 400, color: "#333", textAlign: "center" }}>
                                <div style={{ fontSize: 48 }}>⚡</div>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, color: "#444" }}>Your post will appear here</div>
                                <div style={{ fontSize: 14, color: "#333", maxWidth: 300 }}>Fill in the details on the left and hit Generate Post to create your viral content</div>
                            </div>
                        )}

                        {loading && (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, height: 400, color: "#555" }}>
                                <div style={{ width: 480, height: 480, borderRadius: 24, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
                                    <div className="pulse" style={{ fontSize: 40 }}>⚡</div>
                                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#555" }}>Generating viral content & image...</div>
                                    <div style={{ width: 200, height: 3, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                                        <div className="pulse" style={{ width: "60%", height: "100%", background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2 }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Generated Image View (Using SocialPostCanvas) */}
                        {post && view === "card" && post.background && (
                            <div className="fade-up" style={{ width: '100%', maxWidth: 540, display: "flex", flexDirection: "column", gap: 16 }}>
                                <div style={{ width: 540, height: 540, borderRadius: 24, overflow: "hidden", background: "#0a0a0f", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <div style={{ transform: "scale(0.5)", transformOrigin: "top left", width: 1080, height: 1080 }}>
                                        <SocialPostCanvas
                                            ref={canvasRef}
                                            background={post.background}
                                            headline={post.headline}
                                            points={post.key_points || []}
                                            cta={post.cta}
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    style={{
                                        padding: "12px 24px",
                                        background: "linear-gradient(135deg, #10b981, #059669)",
                                        border: "none",
                                        borderRadius: 12,
                                        color: "#fff",
                                        fontSize: 14,
                                        fontWeight: 700,
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        transition: "all 0.2s",
                                        width: "100%",
                                        boxShadow: "0 4px 12px rgba(16,185,129,0.2)"
                                    }}
                                    className="gen-btn"
                                >
                                    <span>📥</span> Download Image
                                </button>
                            </div>
                        )}

                        {/* Fallback CSS Card (if image generation fails or is not enabled) */}
                        {post && view === "card" && !post.background && !post.image_url && (
                            <div className="fade-up" ref={cardRef} style={{ width: 480, borderRadius: 24, overflow: "hidden", background: colors.bg, boxShadow: `0 0 60px ${colors.primary}30, 0 40px 80px rgba(0,0,0,0.6)`, border: `1px solid ${colors.primary}30`, position: "relative" }}>
                                {/* Decorative orb */}
                                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${colors.primary}30, transparent 70%)`, pointerEvents: "none" }} />
                                <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${colors.secondary}20, transparent 70%)`, pointerEvents: "none" }} />

                                <div style={{ padding: 32, position: "relative" }}>
                                    {/* Top row */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                                        <div style={{ padding: "6px 14px", background: `${colors.tag}cc`, borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: colors.accent, border: `1px solid ${colors.primary}40`, textTransform: "uppercase" }}>
                                            {selectedNiche?.label || post.niche_label || niche}
                                        </div>
                                        <div style={{ padding: "6px 14px", background: `${colors.primary}25`, borderRadius: 20, fontSize: 12, fontWeight: 700, color: scoreColor, border: `1px solid ${scoreColor}50`, display: "flex", alignItems: "center", gap: 5 }}>
                                            ⚡ {post.virality_score || post.viral_score || 85}/100
                                        </div>
                                    </div>

                                    {/* Headline */}
                                    <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, lineHeight: 1.2, color: "#fff", marginBottom: 10, letterSpacing: "-0.5px" }}>
                                        {post.headline}
                                    </h2>

                                    {/* Subtext */}
                                    {post.subtext && (
                                        <p style={{ fontSize: 14, color: colors.accent, lineHeight: 1.6, marginBottom: 20, opacity: 0.9 }}>
                                            {post.subtext}
                                        </p>
                                    )}

                                    {/* Hook quote */}
                                    {post.hook_quote && (
                                        <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.05)", borderRadius: 12, borderLeft: `3px solid ${colors.primary}`, marginBottom: 20 }}>
                                            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#ccc", fontStyle: "italic", lineHeight: 1.6 }}>
                                                "{post.hook_quote}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Key Points */}
                                    {post.key_points && post.key_points.length > 0 && (
                                        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22, padding: 18, background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
                                            {post.key_points.map((pt: string, i: number) => (
                                                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                                    <div style={{ width: 24, height: 24, minWidth: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", marginTop: 1 }}>
                                                        {i + 1}
                                                    </div>
                                                    <span style={{ fontSize: 13, color: "#ddd", lineHeight: 1.6 }}>{pt}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* CTA */}
                                    <div style={{ padding: "16px 20px", background: `linear-gradient(135deg, ${colors.primary}ee, ${colors.secondary}ee)`, borderRadius: 14, marginBottom: 20, textAlign: "center" }}>
                                        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: 0.3, lineHeight: 1.5 }}>
                                            {post.cta}
                                        </p>
                                    </div>

                                    {/* Footer line */}
                                    {post.footer_line && (
                                        <p style={{ fontSize: 12, color: "#666", marginBottom: 16, textAlign: "center" }}>
                                            {post.footer_line}
                                        </p>
                                    )}

                                    {/* Hashtags */}
                                    {post.hashtags && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                                            {post.hashtags.map((tag: string, i: number) => (
                                                <span key={i} style={{ fontSize: 11, color: colors.secondary, opacity: 0.8 }}>#{tag}</span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Bottom brand */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>
                                            CODE<span style={{ color: colors.primary }}>ZERO</span>
                                        </div>
                                        <div style={{ fontSize: 11, color: "#444" }}>AI Generated · Ready to Share</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Text View */}
                        {post && view === "text" && (
                            <div className="fade-up" style={{ width: "100%", maxWidth: 640, display: "flex", flexDirection: "column", gap: 16 }}>
                                {[
                                    { label: "Headline", content: post.headline, mono: false },
                                    { label: "Subtext", content: post.subtext, mono: false },
                                    { label: "Hook / Quote", content: post.hook_quote ? `"${post.hook_quote}"` : "", mono: true },
                                    { label: "Key Points", content: post.key_points?.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n"), mono: false },
                                    { label: "Call to Action", content: post.cta, mono: false },
                                    { label: "Footer", content: post.footer_line, mono: false },
                                    { label: "Hashtags", content: post.hashtags?.map((t: string) => `#${t}`).join(" "), mono: true },
                                ].filter(item => item.content).map(({ label, content, mono }) => (
                                    <div key={label} style={{ background: "#0f0f18", borderRadius: 12, padding: "16px 20px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#555", textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
                                        <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.7, fontFamily: mono ? "'Space Mono', monospace" : "inherit", whiteSpace: "pre-line" }}>
                                            {content}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        const text = `${post.headline}\n\n${post.subtext}\n\n"${post.hook_quote}"\n\n${post.key_points?.map((p: string, i: number) => `${i + 1}. ${p}`).join("\n")}\n\n${post.cta}\n\n${post.footer_line}\n\n${post.hashtags?.map((t: string) => `#${t}`).join(" ")}`;
                                        navigator.clipboard.writeText(text);
                                    }}
                                    style={{ padding: "12px 24px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", borderRadius: 10, color: "#a78bfa", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                                    className="tab-btn"
                                >
                                    📋 Copy All Text
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
