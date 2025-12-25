
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Settings, Menu } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <BookOpen size={24} />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">Pinoy<span className="text-blue-600">HowTo</span></span>
            </Link>
            
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium text-sm">Guides</Link>
              <Link to="/automation" className="text-gray-600 hover:text-blue-600 font-medium text-sm flex items-center gap-1">
                <Settings size={16} /> Automation
              </Link>
            </nav>

            <button className="md:hidden text-gray-500">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">&copy; 2024 PinoyHowTo AI. All rights reserved.</p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">About</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
