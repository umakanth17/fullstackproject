"use client";

import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import VideoBackground from '@/components/VideoBackground';

export default function RoleSelect() {
    const router = useRouter();
    const roles = [
        { key: 'donor', label: 'Food Donor', desc: 'List surplus food, coordinate donations, and track impact.' },
        { key: 'recipient', label: 'Recipient Organization', desc: 'Request food donations, manage logistics, and distribute to those in need.' },
        { key: 'admin', label: 'Admin', desc: 'Manage platform content, oversee user interactions, and ensure data accuracy.' },
        { key: 'analyst', label: 'Data Analyst', desc: 'Track food waste trends, analyze data, and generate reports to improve efficiency.' },
    ];
    return (
        <Layout>
            <div className="min-h-screen flex flex-col items-center justify-center py-16 relative overflow-hidden">
                <VideoBackground />
                <div className="relative z-10 w-full flex flex-col items-center">
                    <h1 className="text-4xl font-bold mb-12 text-white drop-shadow-md">Select Your Dashboard</h1>
                    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl px-6">
                        {roles.map(role => (
                            <button
                                key={role.key}
                                onClick={() => router.push(`/dashboard/${role.key}`)}
                                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl p-8 flex flex-col items-start hover:bg-white/20 transition-all group hover:-translate-y-1"
                            >
                                <span className="text-2xl font-bold mb-3 text-green-300 group-hover:text-green-200 transition-colors">{role.label}</span>
                                <span className="text-gray-200 mb-6 text-left">{role.desc}</span>
                                <span className="mt-auto text-white font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                                    Go to {role.label} <span className="text-xl">→</span>
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
