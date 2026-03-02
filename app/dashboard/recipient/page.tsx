"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';

export default function RecipientDashboard() {
    const [availableFood, setAvailableFood] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const all = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        setAvailableFood(all.filter((d: any) => d.status === 'Available'));
    }, []);

    const handleClaim = (idx: number) => {
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        let all = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
        const donation = availableFood[idx];
        // Mark as claimed and assign to this recipient
        all = all.map((d: any) =>
            d.title === donation.title && d.donorEmail === donation.donorEmail && d.status === 'Available'
                ? { ...d, status: 'Claimed', claimedBy: user.email, claimedAt: new Date().toISOString() }
                : d
        );
        localStorage.setItem('foodseeker_donations', JSON.stringify(all));
        setAvailableFood(all.filter((d: any) => d.status === 'Available'));
        // Optionally, add to recipient's requests
        const requests = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
        requests.push({ ...donation, recipient: user.email, status: 'Claimed', claimedAt: new Date().toISOString() });
        localStorage.setItem('foodseeker_requests', JSON.stringify(requests));
    };

    const filteredFood = availableFood.filter(f =>
        (f.title || '').toLowerCase().includes((search || '').toLowerCase()) ||
        (f.donor || '').toLowerCase().includes((search || '').toLowerCase())
    );

    return (
        <Layout role="recipient">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-black">Available Food</h1>
                    </div>
                    <div className="relative mb-8">
                        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search for food nearby..."
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow text-black"
                        />
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredFood.length === 0 ? (
                            <div className="col-span-full text-center text-black">No available food found.</div>
                        ) : filteredFood.map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden flex flex-col hover:bg-green-50 transition-colors">
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="font-semibold text-black text-lg mb-1">{item.title}</div>
                                        <div className="text-sm text-black mb-2">{item.qty} • <span className="px-2 py-1 rounded-full text-xs font-semibold text-black bg-green-100">Available</span></div>
                                        <div className="text-xs text-black flex items-center gap-1"><MapPin size={14} className="inline text-black" /> {item.location}</div>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="text-xs text-black flex items-center gap-1"><Clock size={14} className="inline text-black" /> {item.time ? new Date(item.time).toLocaleString() : ''}</div>
                                        <button onClick={() => handleClaim(i)} className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">Claim</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
