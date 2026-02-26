"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { History, CheckCircle2, Clock } from 'lucide-react'; // Added Clock for pending items
import { getDonationsByRole, Donation } from '@/lib/donationService';

export default function DonationHistory() {
    const [history, setHistory] = useState<Donation[]>([]);

    useEffect(() => {
        const items = getDonationsByRole('donor');
        setHistory(items);
    }, []);

    return (
        <Layout role="donor">
            <h1 className="text-2xl font-bold mb-6">Donation History</h1>

            <div className="space-y-4">
                {history.map((record, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${record.status === 'Completed' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                                {record.status === 'Completed' ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{record.item}</h3>
                                <p className="text-gray-500 text-sm">Donated on {record.date} • {record.quantity}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-medium text-gray-900">{record.requestor || 'Pending Pickup'}</span>
                            <span className={`text-sm font-medium ${record.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>{record.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
