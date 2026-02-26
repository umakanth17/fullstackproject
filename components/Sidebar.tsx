
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Users,
    BarChart3,
    Gift,
    History,
    MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    role: 'admin' | 'donor' | 'recipient' | 'analyst';
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    const pathname = usePathname();

    const getLinks = (role: string) => {
        switch (role) {
            case 'admin':
                return [
                    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
                    { href: '/dashboard/admin/users', label: 'Users', icon: Users },
                    { href: '/dashboard/admin/content', label: 'Content', icon: Package },
                ];
            case 'donor':
                return [
                    { href: '/dashboard/donor', label: 'Overview', icon: LayoutDashboard },
                    { href: '/dashboard/donor/donate', label: 'Donate Food', icon: Gift },
                    { href: '/dashboard/donor/history', label: 'History', icon: History },
                ];
            case 'recipient':
                return [
                    { href: '/dashboard/recipient', label: 'Overview', icon: LayoutDashboard },
                    { href: '/dashboard/recipient/browse', label: 'Browse Food', icon: MapPin },
                    { href: '/dashboard/recipient/requests', label: 'My Requests', icon: History },
                ];
            case 'analyst':
                return [
                    { href: '/dashboard/analyst', label: 'Overview', icon: LayoutDashboard },
                    { href: '/dashboard/analyst/reports', label: 'Reports', icon: BarChart3 },
                ];
            default:
                return [];
        }
    };

    const links = getLinks(role);

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col h-[calc(100vh-65px)] sticky top-[65px]">
            <div className="p-4 space-y-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon size={18} />
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
};

export default Sidebar;
