import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
  profiles: {
    name: string;
    employee_id: string;
    department: string;
  } | null;
}

interface Employee {
  id: string;
  name: string;
  employee_id: string;
}

const Reports = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, name, employee_id')
        .order('name');

      setEmployees(data || []);
    };

    fetchEmployees();
  }, []);

  const fetchReport = async () => {
    setLoading(true);

    let query = supabase
      .from('attendance')
      .select(`
        *,
        profiles (
          name,
          employee_id,
          department
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (selectedEmployee !== 'all') {
      query = query.eq('user_id', selectedEmployee);
    }

    const { data } = await query;
    setRecords((data || []) as AttendanceRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, selectedEmployee]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Employee', 'Employee ID', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'],
      ...records.map((r) => [
        r.date,
        r.profiles?.name || '',
        r.profiles?.employee_id || '',
        r.profiles?.department || '',
        r.check_in_time ? format(new Date(r.check_in_time), 'h:mm a') : '',
        r.check_out_time ? format(new Date(r.check_out_time), 'h:mm a') : '',
        r.total_hours?.toFixed(1) || '',
        r.status || '',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

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
      title="Reports"
      subtitle="Generate and export attendance reports"
    >
      {/* Filters */}
      <div className="mb-6 rounded-xl border border-border bg-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-accent" />
          <h3 className="font-display text-lg font-semibold text-foreground">Report Filters</h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button onClick={handleExport} className="w-full gap-2">
              <Download size={16} />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Records', value: records.length, color: 'text-foreground' },
          { label: 'Present', value: summary.present, color: 'text-success' },
          { label: 'Absent', value: summary.absent, color: 'text-destructive' },
          { label: 'Late', value: summary.late, color: 'text-warning' },
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

      {/* Results */}
      <AttendanceTable records={records} showEmployee />
    </DashboardLayout>
  );
};

export default Reports;
