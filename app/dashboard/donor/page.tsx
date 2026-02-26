"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Plus, Clock, CheckCircle, Gift, Truck, Trash2, Edit } from 'lucide-react';

export default function DonorDashboard() {
    const [donations, setDonations] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', qty: '', status: 'Available' });

    // Load donations from localStorage for this donor
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        const all = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        setDonations(all.filter((d: any) => d.donorEmail === user.email));
    }, [showForm]);

    // Add new donation
    const handleAddDonation = (e: any) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        const all = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        const newDonation = {
            ...form,
            donor: user.fullName,
            donorEmail: user.email,
            time: 'Just now',
        };
        localStorage.setItem('foodseeker_donations', JSON.stringify([newDonation, ...all]));
        setShowForm(false);
        setForm({ title: '', qty: '', status: 'Available' });
    };

    // Delete donation
    const handleDelete = (idx: number) => {
        if (!window.confirm('Delete this donation?')) return;
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        const all = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        const filtered = all.filter((d: any, i: number) => !(d.donorEmail === user.email && i === idx));
        localStorage.setItem('foodseeker_donations', JSON.stringify(filtered));
        setDonations(filtered.filter((d: any) => d.donorEmail === user.email));
    };

    // Stats
    const totalQty = donations.reduce((sum, d) => sum + (parseInt(d.qty) || 0), 0);
    const totalDonations = donations.length;
    const pendingPickups = donations.filter(d => d.status === 'Available').length;

    return (
        <Layout role="donor">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-3xl mx-auto">
                    {/* Hero Section */}
                    <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between shadow-md">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2">Welcome, Food Donor!</h1>
                            <p className="text-gray-700 text-lg max-w-xl">Thank you for making a difference. Track your donations, see your impact, and help feed your community.</p>
                        </div>
                        <button onClick={() => setShowForm(true)} className="mt-6 md:mt-0 px-6 py-3 bg-green-600 text-white rounded-xl flex items-center gap-2 hover:bg-green-700 transition-colors font-semibold shadow-lg">
                            <Plus size={20} /> New Donation
                        </button>
                    </div>

                    {/* Add Donation Modal */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                            <form onSubmit={handleAddDonation} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4">
                                <h2 className="text-xl font-bold mb-2 text-green-700">Add Donation</h2>
                                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Food Item (e.g. Fresh Bread)" className="px-4 py-2 border rounded-lg" />
                                <input required value={form.qty} onChange={e => setForm(f => ({ ...f, qty: e.target.value }))} placeholder="Quantity (e.g. 10kg)" className="px-4 py-2 border rounded-lg" />
                                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="px-4 py-2 border rounded-lg">
                                    <option value="Available">Available</option>
                                    <option value="Claimed">Claimed</option>
                                    <option value="Distributed">Distributed</option>
                                </select>
                                <div className="flex gap-2 mt-2">
                                    <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Add</button>
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center gap-4">
                            <CheckCircle size={32} className="text-green-500" />
                            <div>
                                <div className="text-2xl font-bold text-green-700">{totalQty} kg</div>
                                <div className="text-gray-500">Food saved this month</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center gap-4">
                            <Gift size={32} className="text-yellow-500" />
                            <div>
                                <div className="text-2xl font-bold text-yellow-600">{totalDonations}</div>
                                <div className="text-gray-500">Total Donations</div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center gap-4">
                            <Truck size={32} className="text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold text-blue-600">{pendingPickups}</div>
                                <div className="text-gray-500">Pending Pickups</div>
                            </div>
                        </div>
                    </div>

                    {/* Donations List */}
                    <div className="space-y-4">
                        {donations.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center text-gray-700 text-lg">No donations yet. <button onClick={() => setShowForm(true)} className="text-green-600 underline">Start your first donation</button>!</div>
                        ) : (
                            donations.map((item, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-between p-6 hover:bg-green-50 transition-colors">
                                    <div>
                                        <div className="font-semibold text-black text-lg mb-1">{item.title}</div>
                                        <div className="text-sm text-gray-700 mb-2">{item.qty} • <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Available' ? 'bg-green-100 text-green-700' : item.status === 'Claimed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span> • <Clock size={14} className="inline" /> {item.time}</div>
                                    </div>
                                    <button onClick={() => handleDelete(i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
