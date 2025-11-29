import { useState } from 'react';
import { Clock, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface CheckInCardProps {
  todayAttendance: {
    check_in_time: string | null;
    check_out_time: string | null;
    status: string | null;
  } | null;
  onUpdate: () => void;
}

export const CheckInCard = ({ todayAttendance, onUpdate }: CheckInCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const isCheckedIn = !!todayAttendance?.check_in_time;
  const isCheckedOut = !!todayAttendance?.check_out_time;
  const currentTime = new Date();

  const handleCheckIn = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const now = new Date();
      const nineAM = new Date();
      nineAM.setHours(9, 0, 0, 0);
      
      const status = now > nineAM ? 'late' : 'present';

      const { error } = await supabase.from('attendance').insert({
        user_id: user.id,
        date: format(now, 'yyyy-MM-dd'),
        check_in_time: now.toISOString(),
        status,
      });

      if (error) throw error;

      toast({
        title: 'Checked In!',
        description: `You checked in at ${format(now, 'h:mm a')}${status === 'late' ? ' (Late)' : ''}`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !todayAttendance) return;
    setLoading(true);

    try {
      const now = new Date();
      const checkInTime = new Date(todayAttendance.check_in_time!);
      const hoursWorked = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
      
      const status = hoursWorked < 4 ? 'half-day' : todayAttendance.status;

      const { error } = await supabase
        .from('attendance')
        .update({
          check_out_time: now.toISOString(),
          status,
        })
        .eq('user_id', user.id)
        .eq('date', format(now, 'yyyy-MM-dd'));

      if (error) throw error;

      toast({
        title: 'Checked Out!',
        description: `You worked ${hoursWorked.toFixed(1)} hours today`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative">
        {/* Current time */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">Current Time</p>
          <p className="font-display text-5xl font-bold text-foreground">
            {format(currentTime, 'h:mm')}
            <span className="text-2xl text-muted-foreground">{format(currentTime, ' a')}</span>
          </p>
          <p className="mt-1 text-muted-foreground">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
        </div>

        {/* Status indicator */}
        <div className="mb-6 flex justify-center">
          <div
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium',
              isCheckedOut
                ? 'bg-muted text-muted-foreground'
                : isCheckedIn
                ? 'bg-success/10 text-success'
                : 'bg-warning/10 text-warning'
            )}
          >
            {isCheckedOut ? (
              <>
                <CheckCircle2 size={16} />
                <span>Day Complete</span>
              </>
            ) : isCheckedIn ? (
              <>
                <Clock size={16} className="animate-pulse-soft" />
                <span>Currently Working</span>
              </>
            ) : (
              <>
                <Clock size={16} />
                <span>Not Checked In</span>
              </>
            )}
          </div>
        </div>

        {/* Check in/out times */}
        {isCheckedIn && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Check In</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {todayAttendance?.check_in_time
                  ? format(new Date(todayAttendance.check_in_time), 'h:mm a')
                  : '--:--'}
              </p>
            </div>
            <div className="rounded-lg bg-secondary/50 p-4 text-center">
              <p className="text-xs text-muted-foreground">Check Out</p>
              <p className="font-display text-lg font-semibold text-foreground">
                {todayAttendance?.check_out_time
                  ? format(new Date(todayAttendance.check_out_time), 'h:mm a')
                  : '--:--'}
              </p>
            </div>
          </div>
        )}

        {/* Action button */}
        {!isCheckedOut && (
          <Button
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            disabled={loading}
            variant={isCheckedIn ? 'destructive' : 'success'}
            size="xl"
            className="w-full"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : isCheckedIn ? (
              <>
                <LogOut size={20} />
                Check Out
              </>
            ) : (
              <>
                <LogIn size={20} />
                Check In
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
