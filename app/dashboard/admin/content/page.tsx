
"use client";

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Package, Edit, Trash2 } from 'lucide-react';

interface Post {
    id: number;
    title: string;
    date: string;
    status: string;
}

export default function ContentManagement() {
    const [posts, setPosts] = useState<Post[]>([
        { id: 1, title: 'Ways to Reduce Kitchen Waste', date: '2023-10-25', status: 'Published' },
        { id: 2, title: 'Community Impact Report Q3', date: '2023-11-01', status: 'Draft' },
        { id: 3, title: 'Partner Highlight: Local Farms', date: '2023-11-10', status: 'Published' },
    ]);

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setPosts(posts.filter(post => post.id !== id));
        }
    };

    const handleEdit = (post: Post) => {
        const newTitle = window.prompt('Edit Title:', post.title);
        if (newTitle) {
            setPosts(posts.map(p => p.id === post.id ? { ...p, title: newTitle } : p));
        }
    };

    return (
        <Layout role="admin">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Content Management</h1>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Create New Post
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                            <Package size={18} />
                                        </div>
                                        <span className="font-medium text-gray-900">{post.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                        title="Edit Post"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
