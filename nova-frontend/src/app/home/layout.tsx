'use client';

import { FC, ReactNode } from 'react';
import { FaHome, FaExchangeAlt, FaPiggyBank, FaUser } from 'react-icons/fa';
import Link from 'next/link';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="pb-16 md:pb-0">
                {children}
            </div>

            {/* Bottom Navigation (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
                <div className="flex justify-around items-center p-3">
                    <Link href="/dashboard" className="text-indigo-600 flex flex-col items-center">
                        <FaHome className="text-xl" />
                        <span className="text-xs mt-1">Home</span>
                    </Link>
                    <Link href="/dashboard/transfer" className="text-gray-500 hover:text-indigo-600 flex flex-col items-center">
                        <FaExchangeAlt className="text-xl" />
                        <span className="text-xs mt-1">Transfer</span>
                    </Link>
                    <Link href="/dashboard/savings" className="text-gray-500 hover:text-indigo-600 flex flex-col items-center">
                        <FaPiggyBank className="text-xl" />
                        <span className="text-xs mt-1">Savings</span>
                    </Link>
                    <Link href="/dashboard/profile" className="text-gray-500 hover:text-indigo-600 flex flex-col items-center">
                        <FaUser className="text-xl" />
                        <span className="text-xs mt-1">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
