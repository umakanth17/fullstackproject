"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface NavbarProps {
    role?: string;
}

const Navbar: React.FC<NavbarProps> = ({ role }) => {
    const router = useRouter();

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        FoodSaver
                    </span>
                </Link>

                <div className="flex items-center gap-2 text-gray-400">
                    <button
                        onClick={() => router.back()}
                        className="p-1 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                        title="Go Back"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => router.forward()}
                        className="p-1 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors"
                        title="Go Forward"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {role ? (
                    <>
                        <span className="text-sm text-gray-600 capitalize px-3 py-1 bg-gray-100 rounded-full">
                            {role}
                        </span>
                        <button
                            onClick={() => router.push('/')}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                        <button
                            onClick={() => alert(`Logged in as ${role}`)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                            title="User Profile"
                        >
                            <User size={20} />
                        </button>
                    </>
                ) : (
                    <Link
                        href="/login"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
