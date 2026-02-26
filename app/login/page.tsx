"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react';
import VideoBackground from '@/components/VideoBackground';
import Navbar from '@/components/Navbar';
import { loginUser } from '@/lib/authService';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotNew, setForgotNew] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');

    const isValidEmail = (email: string) => {
        // Enforce Google email domains
        return /^[a-zA-Z0-9._%+-]+@(gmail\.com|googlemail\.com)$/.test(email);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!password) {
            setError('Please enter your password.');
            return;
        }

        // Use localStorage-based login
        const result = loginUser(email, password);
        if (!result.success || !result.user) {
            setError(result.message || 'Invalid email or password.');
            return;
        }
        // Save user session (for demo, store in localStorage)
        localStorage.setItem('foodseeker_current_user', JSON.stringify(result.user));
        // Route to role selection dashboard
        router.push('/dashboard/role-select');
    };

    const handleForgot = (e: React.FormEvent) => {
        e.preventDefault();
        setForgotMsg('');
        if (!forgotEmail || !forgotNew) {
            setForgotMsg('Please enter your email and new password.');
            return;
        }
        const users = JSON.parse(localStorage.getItem('foodseeker_users') || '[]');
        const idx = users.findIndex((u: any) => u.email === forgotEmail);
        if (idx === -1) {
            setForgotMsg('Account not found.');
            return;
        }
        users[idx].password = forgotNew;
        localStorage.setItem('foodseeker_users', JSON.stringify(users));
        setForgotMsg('Password reset successful! You can now log in.');
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            <Navbar />
            <div className="flex-1 flex items-center justify-center relative">
                <VideoBackground />

                {/* Forgot Password Modal */}
                {showForgot && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <form onSubmit={handleForgot} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
                            <h2 className="text-xl font-bold mb-2 text-green-700">Reset Password</h2>
                            <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Email" className="px-4 py-2 border rounded-lg" />
                            <input value={forgotNew} onChange={e => setForgotNew(e.target.value)} placeholder="New Password" type="password" className="px-4 py-2 border rounded-lg" />
                            {forgotMsg && <div className="text-sm text-green-600">{forgotMsg}</div>}
                            <div className="flex gap-2 mt-2">
                                <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Reset</button>
                                <button type="button" onClick={() => setShowForgot(false)} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="relative z-10 w-full max-w-md p-8 m-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl text-white animate-fade-in">
                    <Link href="/" className="inline-flex items-center gap-2 text-green-300 hover:text-white transition-colors mb-8 text-sm">
                        <ArrowLeft size={16} /> Back to Home
                    </Link>

                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                        <p className="text-gray-200 text-sm">Login to continue preventing food waste.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <AlertCircle size={16} className="text-red-500" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Email ID / Username</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl focus:outline-none focus:ring-1 transition-colors placeholder:text-gray-500 text-white ${error && !isValidEmail(email) && email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-white/10 focus:border-green-500 focus:ring-green-500'}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-200">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors placeholder:text-gray-500 text-white"
                                />
                                <div className="absolute right-3 top-3 flex items-center gap-2">
                                    <input type="checkbox" id="showPass" checked={showPassword} onChange={() => setShowPassword(v => !v)} />
                                    <label htmlFor="showPass" className="text-xs text-gray-200 cursor-pointer">Show</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                                <span className="text-gray-200">Remember Me</span>
                            </label>
                            <button type="button" className="text-green-300 hover:text-white transition-colors" onClick={() => setShowForgot(true)}>
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-600/20"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-300">
                        Don&apos;t have an account? {' '}
                        <Link href="/register" className="text-green-300 hover:text-white font-semibold transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
