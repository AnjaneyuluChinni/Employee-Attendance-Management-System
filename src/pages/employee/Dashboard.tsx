import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { CheckInCard } from '@/components/dashboard/CheckInCard';
import { RecentAttendance } from '@/components/dashboard/RecentAttendance';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
}

interface MonthlyStats {
  present: number;
  absent: number;
  late: number;
  totalHours: number;
}

const EmployeeDashboard = () => {
  const { user, profile } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({
    present: 0,
    absent: 0,
    late: 0,
    totalHours: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

      // Fetch today's attendance
      const { data: todayData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      setTodayAttendance(todayData);

      // Fetch recent records (last 7 days)
      const { data: recentData } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekAgo)
        .lte('date', today)
        .order('date', { ascending: false });

      setRecentRecords(recentData || []);

      // Fetch monthly stats
      const { data: monthlyData } = await supabase
        .from('attendance')
        .select('status, total_hours')
        .eq('user_id', user.id)
        .gte('date', monthStart)
        .lte('date', monthEnd);

      if (monthlyData) {
        const stats = monthlyData.reduce(
          (acc, record) => {
            if (record.status === 'present') acc.present++;
            else if (record.status === 'absent') acc.absent++;
            else if (record.status === 'late') {
              acc.late++;
              acc.present++;
            } else if (record.status === 'half-day') acc.present += 0.5;
            
            acc.totalHours += record.total_hours || 0;
            return acc;
          },
          { present: 0, absent: 0, late: 0, totalHours: 0 }
        );
        setMonthlyStats(stats);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <DashboardLayout
      title={`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, ${profile?.name?.split(' ')[0] || 'User'}!`}
      subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Check In Card */}
        <div className="lg:col-span-1">
          <CheckInCard todayAttendance={todayAttendance} onUpdate={fetchData} />
        </div>

        {/* Right column - Stats and Recent */}
        <div className="space-y-6 lg:col-span-2">
          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Present Days"
              value={monthlyStats.present}
              subtitle="This month"
              icon={<CheckCircle2 size={24} />}
              variant="success"
            />
            <StatCard
              title="Absent Days"
              value={monthlyStats.absent}
              subtitle="This month"
              icon={<AlertCircle size={24} />}
              variant="destructive"
            />
            <StatCard
              title="Late Arrivals"
              value={monthlyStats.late}
              subtitle="This month"
              icon={<Clock size={24} />}
              variant="warning"
            />
            <StatCard
              title="Hours Worked"
              value={monthlyStats.totalHours.toFixed(1)}
              subtitle="This month"
              icon={<Calendar size={24} />}
              variant="accent"
            />
          </div>

          {/* Recent Attendance */}
          <RecentAttendance records={recentRecords} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
