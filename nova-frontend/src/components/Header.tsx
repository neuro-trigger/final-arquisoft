'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import apiClient from "@/services/api";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="gradient-bg text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-24">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <Image src="/NOVAw.png" alt="Nova" width={100} height={100} />
              </div>
            </Link>
            {isAuthenticated && (
              <nav className="hidden md:flex space-x-6">
                <Link href="/home" className="hover:text-gray-200 font-medium">
                  Home
                </Link>
                <Link
                  href="#pockets-section"
                  className="hover:text-gray-200 font-medium"
                >
                  Bolsillos
                </Link>
                <Link
                  href="#transactions-section"
                  className="hover:text-gray-200 font-medium"
                >
                  Transacciones
                </Link>
                
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-white font-medium">
                  Hola, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 h-10 w-25 px-4 py-2 rounded-full font-medium hover:bg-gray-100 text-center"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="bg-white text-indigo-600 h-10 w-25 px-4 py-2 rounded-full font-medium hover:bg-gray-100 text-center"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-800 text-white h-10 w-25 px-4 py-2 rounded-full font-medium hover:bg-indigo-700 text-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
