import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CheckInCard } from '@/components/dashboard/CheckInCard';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { MapPin, Wifi, Clock } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
}

const MarkAttendance = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);

  const fetchTodayAttendance = async () => {
    if (!user) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    setTodayAttendance(data);
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, [user]);

  return (
    <DashboardLayout
      title="Mark Attendance"
      subtitle="Record your daily attendance"
    >
      <div className="mx-auto max-w-2xl">
        <CheckInCard todayAttendance={todayAttendance} onUpdate={fetchTodayAttendance} />

        {/* Info cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
              <Clock className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-medium text-foreground">Office Hours</h4>
            <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
              <MapPin className="h-5 w-5 text-warning" />
            </div>
            <h4 className="font-medium text-foreground">Late After</h4>
            <p className="text-sm text-muted-foreground">9:00 AM</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <Wifi className="h-5 w-5 text-success" />
            </div>
            <h4 className="font-medium text-foreground">Min Hours</h4>
            <p className="text-sm text-muted-foreground">8 hours/day</p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
            Attendance Guidelines
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Check in when you arrive at work and check out when leaving
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Arrivals after 9:00 AM will be marked as late
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Working less than 4 hours counts as a half-day
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              Contact your manager for any attendance corrections
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MarkAttendance;
