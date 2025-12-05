import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, Table } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
}

const AttendanceHistory = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      const threeMonthsAgo = format(startOfMonth(subMonths(new Date(), 3)), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', threeMonthsAgo)
        .lte('date', today)
        .order('date', { ascending: false });

      setRecords(data || []);
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  // Calculate summary
  const summary = records.reduce(
    (acc, record) => {
      if (record.status === 'present') acc.present++;
      else if (record.status === 'absent') acc.absent++;
      else if (record.status === 'late') acc.late++;
      else if (record.status === 'half-day') acc.halfDay++;
      
      acc.totalHours += record.total_hours || 0;
      return acc;
    },
    { present: 0, absent: 0, late: 0, halfDay: 0, totalHours: 0 }
  );

  return (
    <DashboardLayout
      title="Attendance History"
      subtitle="View your attendance records"
    >
      {/* Summary cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Present', value: summary.present, color: 'text-success' },
          { label: 'Absent', value: summary.absent, color: 'text-destructive' },
          { label: 'Late', value: summary.late, color: 'text-warning' },
          { label: 'Half Days', value: summary.halfDay, color: 'text-orange-500' },
          { label: 'Total Hours', value: `${summary.totalHours.toFixed(1)}h`, color: 'text-accent' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 text-center shadow-card"
          >
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`font-display text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays size={16} />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="table" className="gap-2">
            <Table size={16} />
            Table View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <AttendanceCalendar records={records} />
        </TabsContent>

        <TabsContent value="table">
          <AttendanceTable records={records} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AttendanceHistory;
