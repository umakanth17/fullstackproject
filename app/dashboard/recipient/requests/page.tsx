"use client";

import Layout from '@/components/Layout';
import { useState, useEffect } from 'react';
import { FileQuestion, Clock, Trash2 } from 'lucide-react';

export default function MyRequests() {
    const [requests, setRequests] = useState<any[]>([]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        const all = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
        setRequests(all.filter((r: any) => r.recipient === user.email));
    }, []);

    const handleCancel = (idx: number) => {
        if (!window.confirm('Cancel this request?')) return;
        const user = JSON.parse(localStorage.getItem('foodseeker_current_user') || '{}');
        let all = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
        all = all.filter((r: any, i: number) => !(r.recipient === user.email && i === idx));
        localStorage.setItem('foodseeker_requests', JSON.stringify(all));
        setRequests(all.filter((r: any) => r.recipient === user.email));
    };

    return (
        <Layout role="recipient">
            <div className="min-h-screen bg-gray-50 py-10">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-black">My Requests</h1>
                    </div>
                    {requests.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center">
                            <div className="inline-flex p-4 bg-gray-50 rounded-full text-gray-400 mb-4">
                                <FileQuestion size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-black">No Active Requests</h3>
                            <p className="text-black max-w-sm mx-auto mt-2">
                                You haven't made any specific requests recently. Browse available food to claim donations directly.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requests.map((req, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-between p-6 hover:bg-green-50 transition-colors">
                                    <div>
                                        <div className="font-semibold text-black text-lg mb-1">{req.title}</div>
                                        <div className="text-sm text-black mb-2">
                                            {req.qty} • <span className={`px-2 py-1 rounded-full text-xs font-semibold text-black ${req.status === 'Claimed' ? 'bg-blue-100' : 'bg-yellow-100'}`}>{req.status}</span> • <Clock size={14} className="inline text-black" /> <span className="text-black">{req.claimedAt ? new Date(req.claimedAt).toLocaleString() : ''}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => handleCancel(i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
