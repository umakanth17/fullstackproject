"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

export default function AnalystDashboard() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        // Aggregate donations and requests by day (mock)
        const donations = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        const requests = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
        // Group by day (last 7 days)
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString();
        });
        const dayStats = days.map(day => {
            const saved = donations.filter((d: any) => new Date(d.time).toLocaleDateString() === day).length;
            const waste = requests.filter((r: any) => new Date(r.claimedAt || r.time).toLocaleDateString() === day).length;
            return { name: day, waste, saved };
        });
        setData(dayStats);
    }, []);

    return (
        <Layout role="analyst">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-black mb-8">Analytics Overview</h1>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-96">
                            <h2 className="font-semibold text-lg text-black mb-4">Donations vs Requests</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="saved" fill="#16a34a" name="Food Saved (Donations)" />
                                    <Bar dataKey="waste" fill="#ef4444" name="Requests" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 h-96">
                            <h2 className="font-semibold text-lg text-black mb-4">Donation Trends</h2>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={data}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="saved" stroke="#2563eb" name="Donations" />
                                    <Line type="monotone" dataKey="waste" stroke="#ef4444" name="Requests" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
