"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Users, FileText, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
    const [userCount, setUserCount] = useState<number>(0);
    const [donationCount, setDonationCount] = useState<number>(0);
    const [reportCount, setReportCount] = useState<number>(0);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        // Users
        const users = JSON.parse(localStorage.getItem('foodseeker_users') || '[]');
        setUserCount(users.length);
        // Donations
        const donations = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        setDonationCount(donations.length);
        // Reports (mocked as requests for now)
        const reports = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
        setReportCount(reports.length);
        // Recent Activity
        const activity = [
            ...donations.slice(0, 3).map((d: any) => ({ user: d.donor, role: 'Donor', status: d.status, date: d.time || 'Just now' })),
            ...users.slice(-3).map((u: any) => ({ user: u.fullName, role: u.role || 'User', status: 'Active', date: 'Just now' }))
        ];
        setRecentActivity(activity.slice(0, 5));
    }, []);

    const stats = [
        { label: 'Total Users', value: userCount.toLocaleString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Active Listings', value: donationCount.toString(), icon: FileText, color: 'bg-green-100 text-green-600' },
        { label: 'Reports', value: reportCount.toString(), icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
    ];

    return (
        <Layout role="admin">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-black mb-8">Admin Dashboard</h1>
                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center gap-4">
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-black text-sm font-medium">{stat.label}</p>
                                    <p className="text-2xl font-bold text-black">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="font-semibold text-lg text-black">Recent User & Donation Activity</h2>
                        </div>
                        <div className="p-6">
                            <table className="w-full text-left text-black">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b border-gray-100">
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Role</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentActivity.map((row, i) => (
                                        <tr key={i} className="text-sm">
                                            <td className="py-4">{row.user}</td>
                                            <td className="py-4">
                                                <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{row.role}</span>
                                            </td>
                                            <td className="py-4">{row.status}</td>
                                            <td className="py-4">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
