import { useState, useEffect } from "react";
import { apiService } from "@/services/api.service";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Target, Award, Save, Edit2, Loader2, LogOut } from "lucide-react";

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        niche: "",
        goals: [] as string[]
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await apiService.fetchProfile();
                setProfile(data);
                setFormData({
                    name: data.name || "",
                    niche: data.niche || "",
                    goals: data.goals || []
                });
            } catch (err: any) {
                setError(err.message || "Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        console.log("[Profile] Saving formData:", formData);
        try {
            const updatedProfile = await apiService.updateProfile(formData);
            console.log("[Profile] Update successful:", updatedProfile);
            setProfile(updatedProfile);
            setEditMode(false);
        } catch (err: any) {
            console.error("[Profile] Save error:", err);
            setError(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        apiService.logout();
        window.dispatchEvent(new Event("auth-change"));
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-geist selection:bg-teal-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] glow-teal opacity-20 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] glow-white opacity-10 blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto pt-24 pb-32 px-6">
                {/* Back Button */}
                <Link to="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium tracking-wide border-b border-transparent group-hover:border-white/20">Back to Dashboard</span>
                </Link>

                {/* Profile Header */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl glass flex items-center justify-center border border-white/10 group overflow-hidden relative">
                            <User className="w-10 h-10 text-white group-hover:scale-110 transition-transform" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight mb-2">
                                {profile?.name || "Member"}<span className="text-teal-400">.</span>
                            </h1>
                            <p className="text-white/40 text-sm flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5" />
                                {profile?.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleLogout}
                            className="glass px-6 py-2.5 rounded-full text-sm font-bold text-red-400 border border-red-400/10 hover:bg-red-400/5 transition-all flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                        {editMode ? (
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-white text-black px-8 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-all flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                        ) : (
                            <button
                                onClick={() => setEditMode(true)}
                                className="glass px-8 py-2.5 rounded-full text-sm font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-400/10 border border-red-400/20 text-red-400 px-6 py-4 rounded-2xl text-sm mb-12">
                        {error}
                    </div>
                )}

                {/* Profile Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <Section title="Basic Information" icon={<User className="w-4 h-4 text-teal-400" />}>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Full Name</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
                                    />
                                ) : (
                                    <div className="text-sm font-medium">{profile?.name || "Not set"}</div>
                                )}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Email Address</label>
                                <div className="text-sm font-medium text-white/60">{profile?.email}</div>
                                <div className="text-[10px] text-white/20 mt-1 uppercase tracking-wider">Email cannot be changed</div>
                            </div>
                        </div>
                    </Section>

                    {/* Niche & Goals */}
                    <Section title="Content Strategy" icon={<Target className="w-4 h-4 text-teal-400" />}>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Target Niche</label>
                                {editMode ? (
                                    <input
                                        type="text"
                                        value={formData.niche}
                                        onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                        placeholder="e.g. Technology"
                                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-400/50 transition-colors"
                                    />
                                ) : (
                                    <div className="text-sm font-medium capitalize">{profile?.niche || "Not specified"}</div>
                                )}
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-2 block">Performance Goals</label>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.goals?.length > 0 ? (
                                        profile.goals.map((goal: string) => (
                                            <span key={goal} className="px-3 py-1 rounded-full glass border border-white/5 text-[10px] font-bold uppercase tracking-wider">
                                                {goal}
                                            </span>
                                        ))
                                    ) : (
                                        <div className="text-sm font-medium text-white/40 italic">No goals defined</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Section>
                </div>
            </div>

            <style>{`
                .glass {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
                .glow-teal { background: radial-gradient(circle, #2dd4bf 0%, transparent 70%); }
                .glow-white { background: radial-gradient(circle, #ffffff 0%, transparent 70%); }
            `}</style>
        </div>
    );
}

function Section({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="glass rounded-3xl border border-white/5 p-8 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-teal-400/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">{title}</h2>
            </div>
            {children}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <Award className="w-12 h-12" />
            </div>
        </div>
    );
}
