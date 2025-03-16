"use client";
import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, Layers, Image, Users, Settings, Menu, X, LogOut, Plus, ArrowLeft, ChevronRight } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/Auth';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Main Admin Layout with enhanced mint green theme
const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Define theme colors
  const themeColors = {
    primary: '#22c55e', // Base mint green
    primaryLight: '#4ade80', // Lighter mint green
    primaryDark: '#16a34a', // Darker mint green
    accent: '#e0f2f1', // Very light mint for hover states
    text: '#0f172a', // Dark text for contrast
    textLight: '#f8fafc', // Light text for dark backgrounds
    border: '#86efac', // Light border color
    hover: '#dcfce7', // Hover background
  };

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { data: session, status } = useSession();
  const router = useRouter();
  const { checkSession, isAuthenticated, isLoading, user } = useAuthStore();
  
  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);
  
  useEffect(() => {
    checkSession();
  }, [checkSession]);
    
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="p-8 rounded-lg bg-white shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-lg font-medium text-green-800">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="p-8 rounded-lg bg-white shadow-lg">
          <div className="text-lg font-semibold text-green-800 mb-4">Please log in</div>
          <button 
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Prevent rendering the admin dashboard for customers
  if (user && user.role === "customer") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="p-8 rounded-lg bg-white shadow-lg">
          <div className="text-lg font-semibold text-red-500 mb-4">
            You don't have permission to access this page.
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Navigation items with their respective paths
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <ShoppingBag size={20} />, label: "Add Category", path: "/admin/addcategory" },
    { icon: <Plus size={20} />, label: "Add Product", path: "/admin/newProduct" },
   
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-gradient-to-r from-green-500 to-green-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mr-2">
            <span className="font-bold text-green-500">E</span>
          </div>
          <h1 className="text-xl font-bold">Elastica Admin</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 rounded-md hover:bg-green-600 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <ArrowLeft size={20} />}
        </button>
      </div>

      {/* Sidebar - overlay on mobile, side-by-side on desktop */}
      <div
        className={`
          ${isMobile ? 'fixed inset-0 z-40' : 'relative'} 
          ${sidebarOpen ? 'block' : 'hidden md:block'} 
          md:relative 
        `}
      >
        {/* Dark overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className={`
          bg-gradient-to-b from-green-500 to-green-600 text-white 
          ${isMobile ? 'fixed h-full w-72 z-50' : sidebarOpen ? 'w-72' : 'w-20'} 
          transition-all duration-300 flex flex-col h-screen shadow-lg
        `}>
          <div className="flex items-center justify-between p-5 border-b border-green-400">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <span className="font-bold text-green-500 text-lg">E</span>
              </div>
              <h1 className={`text-xl font-bold ml-3 ${sidebarOpen || isMobile ? 'block' : 'hidden'}`}>Elastica</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`p-1 ml-2 hover:bg-green-600 transition-colors rounded-full bg-green-500 border ${isMobile ? 'hidden' : 'block'}`}
            >
              {sidebarOpen ? <X size={18} /> : <ChevronRight size={18}  />}
            </button>
          </div>

          <nav className="flex-1 py-6 px-3">
            {navItems.map((item, index) => (
              <NavItem 
                key={index}
                icon={item.icon} 
                label={item.label} 
                path={item.path}
                active={pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))}
                expanded={sidebarOpen || isMobile} 
                collapsed={!sidebarOpen && !isMobile} 
                themeColors={themeColors}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-green-400">
            <div className={`flex items-center ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                <span className="font-bold text-green-500">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              {(sidebarOpen || isMobile) && (
                <div className="ml-3">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-green-100">{user?.email}</p>
                </div>
              )}
            </div>
            {(sidebarOpen || isMobile) && (
              <button 
              onClick={() =>{ toast.success('Logging out...'); signOut({ callbackUrl: "/login" })}}
                className="mt-4 w-full flex items-center justify-center py-2 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md text-sm transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white shadow-sm items-center justify-end px-6">
          <div className="flex items-center">
            <div className="text-right mr-4">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="font-bold text-green-500">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Enhanced Sidebar Nav Item Component
const NavItem = ({ icon, label, path, active = false, expanded, collapsed = false, themeColors }) => {
  return (
    <Link
      href={path}
      className={`
        flex items-center py-3 mb-3 
        ${collapsed ? 'justify-center mx-auto w-12 h-12' : 'px-4'} 
        ${active 
          ? 'bg-white bg-opacity-15 text-white font-medium' 
          : 'text-green-50 hover:bg-white hover:bg-opacity-10'} 
        rounded-md transition-all duration-200
      `}
    >
      <div className={`
        ${active ? 'bg-white bg-opacity-20' : 'bg-transparent'} 
        p-2 rounded-md
      `}>
        {icon}
      </div>
      {expanded && <span className="text-sm ml-3">{label}</span>}
    </Link>
  );
};

export default AdminLayout;