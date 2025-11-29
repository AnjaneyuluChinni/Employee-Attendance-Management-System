import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout = ({ children, title, subtitle }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-20 lg:ml-64 min-h-screen transition-all duration-300">
        <div className="p-6 lg:p-8">
          {(title || subtitle) && (
            <div className="mb-8 animate-slide-up">
              {title && (
                <h1 className="font-display text-3xl font-bold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="mt-1 text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
