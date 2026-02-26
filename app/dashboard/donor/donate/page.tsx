
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { addDonation } from '@/lib/donationService';

export default function DonateFood() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        item: '',
        quantity: '',
        expiration: '',
        foodType: 'Fresh Produce',
        location: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.item || !formData.quantity || !formData.expiration || !formData.location) {
            alert('Please fill in all fields');
            return;
        }

        const newDonation = {
            item: formData.item,
            quantity: formData.quantity,
            expiration: formData.expiration,
            foodType: formData.foodType,
            location: formData.location,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        addDonation(newDonation);
        alert('Donation listed successfully!');
        router.push('/dashboard/donor/history');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Layout role="donor">
            <div className="mb-6">
                <Link href="/dashboard/donor" className="text-gray-500 hover:text-green-600 flex items-center gap-2 mb-4">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold">List Surplus Food</h1>
                <p className="text-gray-500">Provide details about the food you wish to donate.</p>
            </div>

            <div className="max-w-2xl bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Food Item Name</label>
                            <input
                                name="item"
                                value={formData.item}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. Fresh Apples"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <input
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                type="text"
                                placeholder="e.g. 50 kg"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                            <input
                                name="expiration"
                                value={formData.expiration}
                                onChange={handleChange}
                                type="date"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Food Type</label>
                            <select
                                name="foodType"
                                value={formData.foodType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option>Fresh Produce</option>
                                <option>Cooked Meal</option>
                                <option>Canned/Packaged</option>
                                <option>Baked Goods</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pickup/Location Details</label>
                        <textarea
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            rows={3}
                            placeholder="e.g. Pickup from back entrance between 2-4 PM"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <button type="submit" className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        Submit Donation
                    </button>
                </form>
            </div>
        </Layout>
    );
}
