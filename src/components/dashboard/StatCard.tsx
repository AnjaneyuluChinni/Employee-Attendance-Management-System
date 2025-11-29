import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'accent';
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) => {
  const variantStyles = {
    default: 'bg-card border-border',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    destructive: 'bg-destructive/5 border-destructive/20',
    accent: 'bg-accent/5 border-accent/20',
  };

  const iconStyles = {
    default: 'bg-secondary text-secondary-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    destructive: 'bg-destructive/10 text-destructive',
    accent: 'bg-accent/10 text-accent',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-6 shadow-card transition-all duration-300 hover:shadow-card-hover',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-display text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 pt-1">
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.positive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            iconStyles[variant]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
