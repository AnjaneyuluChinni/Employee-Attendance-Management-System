import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Users,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const employeeNavItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/attendance', label: 'Mark Attendance', icon: Clock },
  { path: '/history', label: 'My History', icon: Calendar },
  { path: '/profile', label: 'Profile', icon: User },
];

const managerNavItems = [
  { path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/manager/employees', label: 'All Employees', icon: Users },
  { path: '/manager/calendar', label: 'Team Calendar', icon: Calendar },
  { path: '/manager/reports', label: 'Reports', icon: FileText },
];

export const Sidebar = () => {
  const { profile, role, signOut } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = role === 'manager' ? managerNavItems : employeeNavItems;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-display text-xl font-bold text-sidebar-foreground">
                AttendX
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                {role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* User Info */}
        <div className={cn('border-b border-sidebar-border p-4', collapsed && 'px-2')}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground font-semibold">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!collapsed && (
              <div className="animate-fade-in overflow-hidden">
                <p className="truncate font-medium text-sidebar-foreground">
                  {profile?.name || 'User'}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {profile?.employee_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  collapsed && 'justify-center px-2'
                )}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            onClick={signOut}
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground',
              collapsed && 'justify-center px-2'
            )}
          >
            <LogOut size={20} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
};
