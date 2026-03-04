import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BarChart3, Target, Shield, Cpu, Play } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-teal-500/30 font-geist">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] glow-teal opacity-50 blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] glow-white opacity-30 blur-[100px]" />
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] glow-teal opacity-20 blur-[80px]" />
            </div>

            {/* Navigation */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50">
                <div className="glass px-6 h-12 flex items-center gap-8 rounded-full">
                    <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                        <Zap className="w-4 h-4 text-white fill-white" />
                        <span className="text-sm font-bold tracking-tight uppercase">
                            Creator<span className="text-teal-400">Zero</span>
                        </span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-[13px] font-medium text-white/60">
                        <a href="#features" className="hover:text-white transition-colors">Home</a>
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
                        <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
                    </div>
                    <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                        <Link to="/login" className="text-[13px] font-medium text-white/80 hover:text-white transition-colors">
                            Log in
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-white text-black px-4 py-1.5 rounded-full text-[13px] font-bold hover:bg-white/90 transition-all active:scale-95"
                        >
                            Create Account
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-48 pb-32 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
                        {/* Dynamic Tag */}
                        <div className="glass px-4 py-1 rounded-full text-[11px] font-bold text-white/80 flex items-center gap-2 mb-12 uppercase tracking-widest backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                            Unlock Your Creator Spark!
                            <ArrowRight className="w-3 h-3" />
                        </div>

                        {/* Title */}
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                            One-click for <br />
                            <span className="text-white/40">Viral Defense.</span>
                        </h1>

                        <p className="max-w-xl text-white/50 text-sm md:text-base mb-12 leading-relaxed">
                            Dive into the art assets, where innovative AI technology meets professional content expertise. Precision-engineered for the modern feed.
                        </p>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/signup"
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-white/90 transition-all active:scale-95 shadow-xl shadow-white/5"
                            >
                                Open App ↗
                            </Link>
                            <Link
                                to="/about"
                                className="glass text-white px-8 py-3 rounded-full font-bold hover:bg-white/5 transition-all active:scale-95"
                            >
                                Discover More
                            </Link>
                        </div>

                        {/* Visual Elements Inspired by Image */}
                        <div className="mt-24 relative w-full max-w-5xl aspect-video glass rounded-3xl overflow-hidden shadow-2xl group">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group-hover:bg-white/20">
                                    <Play className="w-6 h-6 fill-white text-white" />
                                </div>
                            </div>

                            {/* Decorative Lines/Nodes */}
                            <div className="absolute top-1/4 left-1/4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                                    <Cpu className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-white/40 uppercase">System</div>
                                    <div className="text-xs font-bold">Processing AI</div>
                                </div>
                            </div>

                            <div className="absolute bottom-1/4 right-1/4 flex items-center gap-3">
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-white/40 uppercase">Metrics</div>
                                    <div className="text-xs font-bold font-mono">98.4% Engagement</div>
                                </div>
                                <div className="w-10 h-10 rounded-lg glass flex items-center justify-center">
                                    <BarChart3 className="w-5 h-5 text-teal-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-32 px-4 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={<Target className="w-5 h-5 text-teal-400" />}
                                title="Precision Hooks"
                                description="Algorithm-perfect patterns that stop the scroll instantly."
                            />
                            <FeatureCard
                                icon={<Zap className="w-5 h-5 text-white" />}
                                title="Lightning Generation"
                                description="From blank screen to viral script in under 60 seconds."
                            />
                            <FeatureCard
                                icon={<Shield className="w-5 h-5 text-white/40" />}
                                title="Content Defense"
                                description="Protect your brand with AI-verified distribution strategies."
                            />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-20 border-t border-white/5 px-4 relative z-10 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-white fill-white" />
                        <span className="text-lg font-black tracking-tighter uppercase">
                            Creator<span className="text-teal-400">Zero</span>
                        </span>
                    </div>
                    <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-white/40">
                        <a href="#" className="hover:text-white">Security</a>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl glass hover:bg-white/[0.05] transition-all group border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-white/40 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
