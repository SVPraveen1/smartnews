"use client"

import { TrendingUp, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <Link href={user ? "/dashboard" : "/"}>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              SmartInvest
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link 
                href="/dashboard" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/portfolio" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive('/portfolio') ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                Portfolio
              </Link>
              <Link 
                href="/news" 
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isActive('/news') ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                News
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  Welcome, {user.name}
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {user ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`block text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/portfolio" 
                  className={`block text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/portfolio') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link 
                  href="/news" 
                  className={`block text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive('/news') ? 'text-blue-600' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  News
                </Link>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-700 mb-3">Welcome, {user.name}</p>
                  <Button variant="outline" size="sm" onClick={logout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
