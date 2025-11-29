import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
  profiles?: {
    name: string;
    employee_id: string;
    department: string;
  } | null;
}

interface AttendanceTableProps {
  records: AttendanceRecord[];
  showEmployee?: boolean;
}

const statusConfig = {
  present: { label: 'Present', class: 'status-present' },
  absent: { label: 'Absent', class: 'status-absent' },
  late: { label: 'Late', class: 'status-late' },
  'half-day': { label: 'Half Day', class: 'status-half-day' },
};

export const AttendanceTable = ({ records, showEmployee = false }: AttendanceTableProps) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="font-semibold">Date</TableHead>
            {showEmployee && (
              <>
                <TableHead className="font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
              </>
            )}
            <TableHead className="font-semibold">Check In</TableHead>
            <TableHead className="font-semibold">Check Out</TableHead>
            <TableHead className="font-semibold">Hours</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showEmployee ? 7 : 5}
                className="h-32 text-center text-muted-foreground"
              >
                No attendance records found
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => {
              const config = record.status ? statusConfig[record.status] : null;

              return (
                <TableRow key={record.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium">
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </TableCell>
                  {showEmployee && record.profiles && (
                    <>
                      <TableCell>
                        <div>
                          <p className="font-medium">{record.profiles.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {record.profiles.employee_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.profiles.department}
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    {record.check_in_time
                      ? format(new Date(record.check_in_time), 'h:mm a')
                      : '--:--'}
                  </TableCell>
                  <TableCell>
                    {record.check_out_time
                      ? format(new Date(record.check_out_time), 'h:mm a')
                      : '--:--'}
                  </TableCell>
                  <TableCell>
                    {record.total_hours ? `${record.total_hours.toFixed(1)}h` : '-'}
                  </TableCell>
                  <TableCell>
                    {config && (
                      <span
                        className={cn(
                          'rounded-full border px-3 py-1 text-xs font-medium',
                          config.class
                        )}
                      >
                        {config.label}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
