import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose, customColor }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    // Define styles and icons based on type
    const getViewConfig = () => {
        if (customColor) {
            return {
                containerClass: 'bg-zinc-900 border-l-4 shadow-[0_0_15px_rgba(255,255,255,0.1)]',
                borderColor: customColor,
                iconColor: customColor,
                icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                )
            };
        }

        switch (type) {
            case 'success':
                return {
                    containerClass: 'bg-zinc-900 border-l-4 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
                    borderColor: '#10B981',
                    iconColor: 'text-emerald-500',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )
                };
            case 'error':
                return {
                    containerClass: 'bg-zinc-900 border-l-4 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
                    borderColor: '#EF4444',
                    iconColor: 'text-red-500',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )
                };
            case 'warning':
                return {
                    containerClass: 'bg-zinc-900 border-l-4 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
                    borderColor: '#F59E0B',
                    iconColor: 'text-amber-500',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    )
                };
            case 'info':
            default:
                return {
                    containerClass: 'bg-zinc-900 border-l-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
                    borderColor: '#3B82F6',
                    iconColor: 'text-blue-500',
                    icon: (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    )
                };
        }
    };

    const config = getViewConfig();

    return (
        <div
            style={{
                borderColor: config.borderColor,
            }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-100 flex items-start gap-3 w-full max-w-md p-4 rounded-xl border border-white/10 ${config.containerClass} transition-all transform animate-in slide-in-from-top fade-in duration-300`}
            role="alert"
        >
            <div className={`shrink-0 ${config.iconColor}`}>
                {config.icon}
            </div>

            <div className="flex-1 pt-0.5">
                <p className="text-sm font-medium text-zinc-100 leading-5">
                    {message}
                </p>
            </div>

            <button
                type="button"
                className="shrink-0 -mr-2 -mt-2 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                onClick={onClose}
                aria-label="Close"
            >
                <span className="sr-only">Close</span>
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </button>
        </div>
    );
};

export default Notification;
