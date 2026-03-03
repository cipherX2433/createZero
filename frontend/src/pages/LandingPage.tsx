import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BarChart3, Target, Shield, Cpu } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-violet-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase">
                            Creator<span className="text-violet-500">Zero</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 rounded-full bg-white text-slate-950 text-sm font-semibold hover:bg-slate-200 transition-all flex items-center gap-2 shadow-lg shadow-white/5 active:scale-95"
                        >
                            Get Started
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                    {/* Decorative background elements */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-violet-500/10 via-transparent to-transparent blur-3xl pointer-events-none" />
                    <div className="absolute top-40 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />

                    <div className="max-w-7xl mx-auto px-4 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-violet-400 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                                </span>
                                Now in Private Beta
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                Precision-engineered for <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400">
                                    Viral Growth.
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                The elite circle of data-driven creators starts here. Harness the power of AI to craft hooks that stop the scroll and trends that dominate the feed.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 rounded-full bg-violet-600 text-white font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-2 shadow-2xl shadow-violet-600/20 active:scale-95 text-lg"
                                >
                                    Join the Elite
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all active:scale-95 text-lg"
                                >
                                    Launch App
                                </Link>
                            </div>
                        </div>

                        {/* Mockup Preview */}
                        <div className="mt-20 relative animate-in fade-in zoom-in-95 duration-1000 delay-700">
                            <div className="absolute inset-0 bg-violet-600/20 blur-[100px] -z-10" />
                            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur aspect-video overflow-hidden shadow-2xl">
                                <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                    <div className="w-3 h-3 rounded-full bg-white/10" />
                                </div>
                                <div className="p-8 h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
                                    <div className="flex items-center gap-4 text-slate-500 italic">
                                        <Cpu className="w-8 h-8 animate-spin-slow" />
                                        <span className="text-xl">AI Engine Processing Viral Potential...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-slate-950">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<Target className="w-6 h-6 text-violet-400" />}
                                title="Scroll-Stopping Hooks"
                                description="Our psych-driven AI crafts hooks designed for high-retention and maximum pattern interrupt."
                            />
                            <FeatureCard
                                icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
                                title="Viral Prediction"
                                description="Know the engagement potential of your content before you even hit publish."
                            />
                            <FeatureCard
                                icon={<Shield className="w-6 h-6 text-cyan-400" />}
                                title="Elite Data Insights"
                                description="Access real-time trend data and psychological triggers used by the top 1% of creators."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 bg-slate-950">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-white" />
                        <span className="text-lg font-bold tracking-tight text-white uppercase">
                            Creator<span className="text-violet-500">Zero</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">
                        © 2026 CreatorZero. All rights reserved. Built for the future of attention.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-violet-500/50 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
