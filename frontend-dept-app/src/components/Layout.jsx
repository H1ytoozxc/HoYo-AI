import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-background-primary overflow-hidden">
      <Sidebar />
      <MainContent>
        {children}
      </MainContent>
    </div>
  );
};

export default Layout;
