"use client";

import Layout from '@/components/Layout';
import Link from 'next/link';
import { Search, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDonationsByRole, Donation } from '@/lib/donationService';

// Using similar content to the main recipient dashboard for the "Browse" view
export default function BrowseFood() {
    const [availableFood, setAvailableFood] = useState<Donation[]>([]);

    useEffect(() => {
        // In a real app this would be an API call
        const items = getDonationsByRole('recipient');
        setAvailableFood(items);
    }, []);

    return (
        <Layout role="recipient">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Browse Donations</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for specific items..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableFood.map((item, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gray-100 w-full relative flex items-center justify-center text-gray-400">
                            {item.foodType}
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg mb-1">{item.item}</h3>
                            <p className="text-gray-600 text-sm mb-4">{item.donor} • {item.quantity}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <MapPin size={16} /> {item.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock size={16} /> Exp: {item.expiration}
                                </div>
                            </div>

                            <div className="mt-auto">
                                <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    Claim
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
