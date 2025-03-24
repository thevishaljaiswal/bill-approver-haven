
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t py-4 text-center text-sm text-muted-foreground">
      <div className="container">
        <p>© {new Date().getFullYear()} BillApprover. All rights reserved.</p>
        <p className="mt-1">Version 1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;
