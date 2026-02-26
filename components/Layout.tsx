
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    role?: 'admin' | 'donor' | 'recipient' | 'analyst';
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar role={role} />
            <div className="flex flex-1">
                {role && <Sidebar role={role} />}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
