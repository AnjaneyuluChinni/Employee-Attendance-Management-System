import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Users, UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodayStats {
  totalEmployees: number;
  present: number;
  absent: number;
  late: number;
}

interface AbsentEmployee {
  id: string;
  name: string;
  employee_id: string;
  department: string;
}

const ManagerDashboard = () => {
  const [stats, setStats] = useState<TodayStats>({
    totalEmployees: 0,
    present: 0,
    absent: 0,
    late: 0,
  });
  const [absentToday, setAbsentToday] = useState<AbsentEmployee[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const today = format(new Date(), 'yyyy-MM-dd');

      // Fetch total employees
      const { count: totalCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch today's attendance with profile info
      const { data: todayAttendance } = await supabase
        .from('attendance')
        .select(`
          *,
          profiles (
            name,
            employee_id,
            department
          )
        `)
        .eq('date', today);

      const presentCount = todayAttendance?.filter(
        (a) => a.status === 'present' || a.status === 'late' || a.status === 'half-day'
      ).length || 0;

      const lateCount = todayAttendance?.filter((a) => a.status === 'late').length || 0;

      // Get all employee IDs who checked in today
      const checkedInIds = new Set(todayAttendance?.map((a) => a.user_id) || []);

      // Fetch all employees to find absent ones
      const { data: allEmployees } = await supabase
        .from('profiles')
        .select('id, name, employee_id, department');

      const absent = allEmployees?.filter((e) => !checkedInIds.has(e.id)) || [];

      setStats({
        totalEmployees: totalCount || 0,
        present: presentCount,
        absent: absent.length,
        late: lateCount,
      });

      setAbsentToday(absent.slice(0, 5));

      // Recent check-ins
      const sortedActivity = todayAttendance
        ?.filter((a) => a.check_in_time)
        .sort((a, b) => 
          new Date(b.check_in_time!).getTime() - new Date(a.check_in_time!).getTime()
        )
        .slice(0, 5);

      setRecentActivity(sortedActivity || []);
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout
      title="Manager Dashboard"
      subtitle={format(new Date(), 'EEEE, MMMM d, yyyy')}
    >
      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={<Users size={24} />}
          variant="default"
        />
        <StatCard
          title="Present Today"
          value={stats.present}
          subtitle={`${((stats.present / stats.totalEmployees) * 100 || 0).toFixed(0)}% attendance`}
          icon={<UserCheck size={24} />}
          variant="success"
        />
        <StatCard
          title="Absent Today"
          value={stats.absent}
          icon={<UserX size={24} />}
          variant="destructive"
        />
        <StatCard
          title="Late Arrivals"
          value={stats.late}
          icon={<Clock size={24} />}
          variant="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Absent Today */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Absent Today
            </h3>
          </div>
          <div className="divide-y divide-border">
            {absentToday.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                All employees are present today! 🎉
              </div>
            ) : (
              absentToday.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 font-semibold text-destructive">
                      {employee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{employee.name}</p>
                      <p className="text-xs text-muted-foreground">{employee.employee_id}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                    {employee.department}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-2 border-b border-border p-4">
            <Clock className="h-5 w-5 text-accent" />
            <h3 className="font-display text-lg font-semibold text-foreground">
              Recent Check-ins
            </h3>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No check-ins yet today
              </div>
            ) : (
              recentActivity.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full font-semibold',
                        record.status === 'late'
                          ? 'bg-warning/10 text-warning'
                          : 'bg-success/10 text-success'
                      )}
                    >
                      {record.profiles?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {record.profiles?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {record.profiles?.employee_id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
                      {format(new Date(record.check_in_time), 'h:mm a')}
                    </p>
                    <span
                      className={cn(
                        'text-xs',
                        record.status === 'late' ? 'text-warning' : 'text-success'
                      )}
                    >
                      {record.status === 'late' ? 'Late' : 'On time'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
