"use client";

import { useEffect } from 'react';

const SAMPLE_DONATIONS = [
    { title: 'Fresh Produce Box', qty: '20 kg', status: 'Available', donor: 'Green Valley Farms', donorEmail: 'farm@example.com', time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), location: 'Downtown Market' },
    { title: 'Bakery Surplus', qty: '15 loaves', status: 'Available', donor: 'Sunrise Bakery', donorEmail: 'bakery@example.com', time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), location: 'Westside Avenue' },
    { title: 'Catered Meals (Unserved)', qty: '50 meals', status: 'Claimed', donor: 'Elite Catering', donorEmail: 'catering@example.com', time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), location: 'Grand Hotel', claimedBy: 'shelter@example.com', claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
    { title: 'Dairy Products', qty: '10 L Milk', status: 'Available', donor: 'City Mart', donorEmail: 'mart@example.com', time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), location: 'North Square' },
    { title: 'Packaged Snacks', qty: '30 boxes', status: 'Distributed', donor: 'SnackCo', donorEmail: 'snack@example.com', time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), location: 'East Plaza', claimedBy: 'ngo@example.com', claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString() },
];

const SAMPLE_USERS = [
    { fullName: 'Green Valley Farms', email: 'farm@example.com', role: 'donor', mobile: '9876543210' },
    { fullName: 'Sunrise Bakery', email: 'bakery@example.com', role: 'donor', mobile: '9876543211' },
    { fullName: 'Hope Shelter', email: 'shelter@example.com', role: 'recipient', mobile: '9876543212' },
    { fullName: 'City Food Bank', email: 'ngo@example.com', role: 'recipient', mobile: '9876543213' },
    { fullName: 'Admin User', email: 'admin@foodsaver.com', role: 'admin', mobile: '9000000000' }
];

const SAMPLE_REQUESTS = [
    { title: 'Catered Meals (Unserved)', qty: '50 meals', recipient: 'shelter@example.com', status: 'Claimed', claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString() },
    { title: 'Packaged Snacks', qty: '30 boxes', recipient: 'ngo@example.com', status: 'Distributed', claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString() },
    { title: 'Rice and Lentils', qty: '100 kg', recipient: 'ngo@example.com', status: 'Pending', time: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString() }, // Example of a request rather than a claim
];


export default function SeedData() {
    useEffect(() => {
        // Only run on client side
        if (typeof window !== 'undefined') {
            // Check if we already seeded to avoid overwriting real user data unnecessarily
            // If the user hasn't added anything, inject the seeds.

            const existingDonations = JSON.parse(localStorage.getItem('foodseeker_donations') || '[]');
            if (existingDonations.length === 0) {
                localStorage.setItem('foodseeker_donations', JSON.stringify(SAMPLE_DONATIONS));
            }

            const existingUsers = JSON.parse(localStorage.getItem('foodseeker_users') || '[]');
            if (existingUsers.length === 0) {
                localStorage.setItem('foodseeker_users', JSON.stringify(SAMPLE_USERS));
            }

            const existingRequests = JSON.parse(localStorage.getItem('foodseeker_requests') || '[]');
            if (existingRequests.length === 0) {
                localStorage.setItem('foodseeker_requests', JSON.stringify(SAMPLE_REQUESTS));
            }
        }
    }, []);

    return null; // This component does not render anything
}
