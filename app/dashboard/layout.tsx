'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthProvider, useAuth } from '@/components/ui/auth-provider';
import { supabase } from '@/lib/supabase/client';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [shopName, setShopName] = useState('My Shop');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Fetch shop name from business_details
    const fetchShopName = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('business_details')
          .select('shop_name')
          .eq('user_id', user.id)
          .single();
          
        if (data && !error) {
          setShopName(data.shop_name);
        }
      }
    };
    
    fetchShopName();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-white"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar navigation */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 truncate">
                {shopName}
              </span>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { href: '/dashboard', label: 'Dashboard', active: pathname === '/dashboard' },
              // Add more navigation items as needed
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? 'bg-orange-100 text-orange-500'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={signOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </AuthProvider>
  );
}