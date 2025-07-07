"use client"

import { TrendingUp, Github, Twitter, Mail, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <h3 className="text-xl font-bold">SmartInvest</h3>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered portfolio insights for the Indian stock market. 
              Make smarter investment decisions with real-time news and analysis.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-white transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Real-time Market News</li>
              <li>AI-Powered Insights</li>
              <li>Portfolio Management</li>
              <li>Smart Notifications</li>
              <li>Market Analysis</li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Stay updated with the latest market trends and investment opportunities.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 SmartInvest. All rights reserved.
          </p>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <span className="text-gray-400 text-sm">Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-gray-400 text-sm">for smart investors</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
