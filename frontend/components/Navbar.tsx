'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { removeToken } from '@/lib/auth';
import { isAdmin } from '@/lib/admin';
import CareSureLogo from './CareSureLogo';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
  }, [pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    removeToken();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  // Don't show navbar on login, signup, landing page, or patient routes
  if (pathname === '/login' || pathname === '/signup' || pathname === '/' || pathname?.startsWith('/patient')) {
    return null;
  }

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', active: isActive('/dashboard') },
    { href: '/patients', label: 'Patients', active: pathname?.startsWith('/patients') },
    { href: '/alerts', label: 'Alerts', active: isActive('/alerts') },
    { href: '/hardware', label: 'Hardware', active: isActive('/hardware') },
    { href: '/settings', label: 'Settings', active: isActive('/settings') },
    ...(admin ? [{ href: '/admin', label: 'Admin', active: isActive('/admin') }] : []),
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#e8dccb] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo: Unified CareSure Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <CareSureLogo variant="dark" size="sm" href="/dashboard" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex items-center px-2 lg:px-3 pt-1 border-b-2 text-sm font-semibold transition-all duration-300 min-h-[44px] ${
                  link.active
                    ? 'border-[#8c4a35] text-[#8c4a35] shadow-sm'
                    : 'border-transparent text-[#5c4d43] hover:text-[#8c4a35] hover:border-[#8c4a35]/40'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Logout */}
          <div className="hidden md:flex items-center">
            <button
              onClick={handleLogout}
              className="text-[#5c4d43] hover:text-[#8c4a35] px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-[#faf6f0] border border-transparent hover:border-[#e8dccb] min-h-[44px]"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-[#5c4d43] hover:text-[#8c4a35] hover:bg-[#faf6f0] focus:outline-none focus:ring-2 focus:ring-[#8c4a35] min-w-[44px] min-h-[44px]"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#e8dccb] px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                link.active
                  ? 'bg-[#f5ebe1] text-[#8c4a35] font-semibold'
                  : 'text-[#5c4d43] hover:bg-[#faf6f0] hover:text-[#8c4a35]'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-[#8c4a35] hover:bg-[#faf6f0] transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
