import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download } from 'lucide-react';
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

const AllEmployees = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');

      const { data } = await supabase
        .from('attendance')
        .select(`
          *,
          profiles (
            name,
            employee_id,
            department
          )
        `)
        .gte('date', weekAgo)
        .lte('date', today)
        .order('date', { ascending: false });

      const attendanceRecords = (data || []) as AttendanceRecord[];
      setRecords(attendanceRecords);
      setFilteredRecords(attendanceRecords);

      // Extract unique departments
      const depts = [...new Set(attendanceRecords.map((r) => r.profiles?.department).filter(Boolean))] as string[];
      setDepartments(depts);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = records;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.profiles?.name.toLowerCase().includes(query) ||
          r.profiles?.employee_id.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Department filter
    if (departmentFilter !== 'all') {
      filtered = filtered.filter((r) => r.profiles?.department === departmentFilter);
    }

    setFilteredRecords(filtered);
  }, [searchQuery, statusFilter, departmentFilter, records]);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Employee', 'Employee ID', 'Department', 'Check In', 'Check Out', 'Hours', 'Status'],
      ...filteredRecords.map((r) => [
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
    a.download = `attendance-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
  };

  return (
    <DashboardLayout
      title="All Employees Attendance"
      subtitle="View and manage team attendance records"
    >
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="half-day">Half Day</SelectItem>
            </SelectContent>
          </Select>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filteredRecords.length} of {records.length} records
      </p>

      {/* Table */}
      <AttendanceTable records={filteredRecords} showEmployee />
    </DashboardLayout>
  );
};

export default AllEmployees;
