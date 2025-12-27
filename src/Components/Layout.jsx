import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { Menu } from 'lucide-react';

const Layout = ({ children, className = '', hideFooter = false, isScrollable = true }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
            {/* Mobile Header */}
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#09090b] border-b border-white/5 flex items-center justify-between px-4 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white flex items-center justify-center">
                        <div className="w-3 h-3 bg-black rounded-sm" />
                    </div>
                    <span className="font-semibold text-white tracking-wide">Tasker</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -mr-2 text-zinc-400 hover:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content */}
            <main className={`flex-1 ${isScrollable ? 'overflow-y-auto' : 'overflow-hidden'} pt-16 lg:pt-0 w-full scrollbar-hide ${className}`}>
                <div className="min-h-full flex flex-col">
                    <div className="flex-1">
                        {children}
                    </div>
                    {!hideFooter && <Footer />}
                </div>
            </main>
        </div>
    );
};

export default Layout;
