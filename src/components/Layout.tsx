import React, { useState } from 'react';
import { Menu, X, LogOut } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from './common/Button';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { auth, handleLogout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
              <span className="ml-2 text-lg font-semibold text-gray-800">
                Clinic Booking
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {auth.isAuthenticated && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {auth.customer?.name || auth.customer?.phoneNumber}
                  </span>
                  <Button
                    onClick={handleLogout}
                    variant="secondary"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              {auth.isAuthenticated && (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    {auth.customer?.name || auth.customer?.phoneNumber}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 mt-16">
        {children}
      </main>
    </div>
  );
}