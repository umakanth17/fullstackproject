"use client";

import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';

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
            <div className="min-h-screen flex flex-col items-center justify-center py-16">
                <h1 className="text-3xl font-bold mb-8">Select Your Dashboard</h1>
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
                    {roles.map(role => (
                        <button
                            key={role.key}
                            onClick={() => router.push(`/dashboard/${role.key}`)}
                            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 flex flex-col items-start hover:bg-green-50 transition-colors"
                        >
                            <span className="text-xl font-semibold mb-2 text-green-700">{role.label}</span>
                            <span className="text-gray-600 mb-4">{role.desc}</span>
                            <span className="mt-auto text-green-600 font-bold">Go to {role.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
