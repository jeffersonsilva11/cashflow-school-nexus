
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppLayout from './AppLayout';

/**
 * MainLayout serves as a wrapper for all protected routes
 * It uses the AppLayout component to render the sidebar and main content area
 */
const MainLayout: React.FC = () => {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default MainLayout;
