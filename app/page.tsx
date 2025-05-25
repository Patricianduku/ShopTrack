import Link from 'next/link';
import { Store, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-6">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-orange-500 rounded-full flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">ShopTrack</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/sign-in"
              className="text-gray-600 hover:text-orange-500 transition-colors"
            >
              Sign in
            </Link>
            <Button 
              asChild
              className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              <Link href="/auth/sign-up">
                Get started
              </Link>
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Simplify your shop management
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              ShopTrack helps shopkeepers manage inventory, track sales, and grow their business with a simple, mobile-friendly app.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                <Link href="/auth/sign-up" className="flex items-center">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                asChild
                size="lg"
                variant="outline"
                className="border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <Link href="/auth/sign-in">
                  Sign in to your account
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-100">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Designed for shopkeepers
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your physical store, accessible from any device.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Simple Inventory Management',
                description: 'Track stock levels, receive low stock alerts, and manage suppliers in one place.'
              },
              {
                title: 'Sales & Performance Tracking',
                description: 'Monitor daily sales, identify trends, and understand your business performance.'
              },
              {
                title: 'Works Offline & Online',
                description: 'Keep working even with unstable internet connection. Data syncs when you're back online.'
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 md:py-24 border-t border-gray-100">
          <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to grow your business?
              </h2>
              <p className="mt-4 text-xl text-orange-50">
                Join thousands of shopkeepers who trust ShopTrack to manage their business.
              </p>
              <Button 
                asChild
                size="lg"
                className="mt-8 bg-white text-orange-500 hover:bg-orange-50 transition-colors"
              >
                <Link href="/auth/sign-up">
                  Create your free account
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">ShopTrack</span>
            </div>
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} ShopTrack. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}