
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Prevent scrollbar jumps when toggling sidebar
  useEffect(() => {
    // Make sure we prevent overflow when animating the sidebar
    if (sidebarOpen) {
      document.body.style.overflow = '';
    } else {
      // Short timeout to allow transition to complete before resetting overflow
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
    }
  }, [sidebarOpen]);
  
  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        location={location}
      />

      {/* Main content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 overflow-hidden",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <Header pathname={location.pathname} />
        
        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
