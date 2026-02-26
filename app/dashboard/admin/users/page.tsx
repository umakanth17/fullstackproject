
"use client";

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { MoreHorizontal, Shield, User, Trash2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        // Load users from local storage via authService
        // We also keep some demo users for visualization if needed, or just replace.
        // Let's combine demo users with real registered users for a better admin experience during dev.
        const demoUsers: User[] = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'Active' },
            { id: 2, name: 'Alice Smith', email: 'alice@bistro.com', role: 'donor', status: 'Active' },
            { id: 3, name: 'Community Center', email: 'help@center.org', role: 'recipient', status: 'Pending Verification' },
            { id: 4, name: 'Sarah Analyst', email: 'sarah@data.org', role: 'analyst', status: 'Active' },
        ];

        // Dynamic import to avoid SSR issues with localStorage if not handled by helper
        import('@/lib/authService').then(({ getUsers }) => {
            const registeredUsers = getUsers().map((u, index) => ({
                id: 100 + index, // Offset ID to avoid collision
                name: u.fullName,
                email: u.email,
                role: u.role || 'user', // Default role
                status: 'Active' // Default status
            }));
            setUsers([...demoUsers, ...registeredUsers]);
        });
    }, []);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(user => user.id !== id));
        }
    };

    const handleView = (user: User) => {
        window.alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}\nStatus: ${user.status}`);
    };

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Invite New User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center text-sm text-gray-900">
                                        <Shield size={16} className="mr-2 text-gray-400" />
                                        <span className="capitalize">{user.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleView(user)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                            title="View Details"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
