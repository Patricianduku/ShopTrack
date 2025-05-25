import React from 'react';
import Link from 'next/link';
import { Store } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  altLink: {
    text: string;
    href: string;
    linkText: string;
  };
}

export default function AuthLayout({ 
  children, 
  title, 
  description, 
  altLink 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white">
            <Store className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {altLink.text}
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href={altLink.href} className="font-medium text-orange-500 hover:text-orange-400 transition-colors duration-200">
                {altLink.linkText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}