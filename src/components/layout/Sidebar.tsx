
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  CreditCard,
  FileText,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Building,
  HardHat,
  ShoppingCart,
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: '/',
    },
    {
      title: 'All Bills',
      icon: <FileText className="h-5 w-5" />,
      path: '/bills',
    },
    {
      title: 'Department',
      icon: <Building className="h-5 w-5" />,
      path: '/bills/department',
    },
    {
      title: 'Construction',
      icon: <HardHat className="h-5 w-5" />,
      path: '/bills/construction',
    },
    {
      title: 'Purchase',
      icon: <ShoppingCart className="h-5 w-5" />,
      path: '/bills/purchase',
    },
    {
      title: 'Advance',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/bills/advance',
    },
    {
      title: 'Payments',
      icon: <CreditCard className="h-5 w-5" />,
      path: '/payments',
    },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-20 flex h-full flex-col border-r bg-sidebar transition-all duration-300 ease-in-out',
        collapsed ? 'w-[70px]' : 'w-[250px]'
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">
              <span className="text-primary">Bill</span>Approver
            </span>
          </Link>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <FileText className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              isActive(item.path)
                ? 'bg-primary text-primary-foreground font-medium'
                : 'hover:bg-primary/10 text-sidebar-foreground'
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </div>

      <div className="mt-auto p-2 border-t">
        <Link
          to="/settings"
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
            isActive('/settings')
              ? 'bg-primary text-primary-foreground font-medium'
              : 'hover:bg-primary/10 text-sidebar-foreground'
          )}
        >
          <Settings className="h-5 w-5" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-red-100 hover:text-red-700 text-sidebar-foreground transition-colors mt-1">
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-sidebar shadow-sm text-sidebar-foreground"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
