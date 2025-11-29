import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  id: string;
  name: string;
  employee_id: string;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
}

const TeamCalendar = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, employee_id')
        .order('name');

      setEmployees(data || []);
      if (data && data.length > 0) {
        setSelectedEmployee(data[0].id);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!selectedEmployee) return;

      const threeMonthsAgo = format(startOfMonth(subMonths(new Date(), 3)), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data } = await supabase
        .from('attendance')
        .select('date, status')
        .eq('user_id', selectedEmployee)
        .gte('date', threeMonthsAgo)
        .lte('date', today);

      setRecords(data || []);
    };

    fetchAttendance();
  }, [selectedEmployee]);

  const selectedEmployeeData = employees.find((e) => e.id === selectedEmployee);

  return (
    <DashboardLayout
      title="Team Calendar"
      subtitle="View individual employee attendance calendars"
    >
      {/* Employee selector */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Select Employee:</label>
        <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select an employee" />
          </SelectTrigger>
          <SelectContent>
            {employees.map((employee) => (
              <SelectItem key={employee.id} value={employee.id}>
                {employee.name} ({employee.employee_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Employee info */}
      {selectedEmployeeData && (
        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-lg font-bold text-accent">
              {selectedEmployeeData.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {selectedEmployeeData.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedEmployeeData.employee_id}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <AttendanceCalendar records={records} />
    </DashboardLayout>
  );
};

export default TeamCalendar;
