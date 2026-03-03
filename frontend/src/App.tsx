import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import AuthCallback from './pages/AuthCallback';
import { useEffect, useState } from 'react';

import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={session ? <Navigate to="/dashboard" /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={session ? <Navigate to="/dashboard" /> : <Signup />}
                />
                <Route
                    path="/dashboard"
                    element={session ? <Dashboard /> : <Navigate to="/login" />}
                />
                <Route
                    path="/onboarding"
                    element={session ? <Onboarding /> : <Navigate to="/login" />}
                />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
