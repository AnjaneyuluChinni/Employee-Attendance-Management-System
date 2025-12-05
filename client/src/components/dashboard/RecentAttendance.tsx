import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'present' | 'absent' | 'late' | 'half-day' | null;
  total_hours: number | null;
}

interface RecentAttendanceProps {
  records: AttendanceRecord[];
}

const statusConfig = {
  present: { label: 'Present', class: 'status-present' },
  absent: { label: 'Absent', class: 'status-absent' },
  late: { label: 'Late', class: 'status-late' },
  'half-day': { label: 'Half Day', class: 'status-half-day' },
};

export const RecentAttendance = ({ records }: RecentAttendanceProps) => {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="border-b border-border p-4">
        <h3 className="font-display text-lg font-semibold text-foreground">Recent Attendance</h3>
        <p className="text-sm text-muted-foreground">Last 7 days</p>
      </div>
      <div className="divide-y divide-border">
        {records.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No attendance records found
          </div>
        ) : (
          records.map((record) => {
            const config = record.status ? statusConfig[record.status] : null;
            
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-display text-2xl font-bold text-foreground">
                      {format(new Date(record.date), 'd')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(record.date), 'EEE')}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {format(new Date(record.date), 'MMMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {record.check_in_time
                          ? format(new Date(record.check_in_time), 'h:mm a')
                          : '--:--'}
                      </span>
                      <span>→</span>
                      <span>
                        {record.check_out_time
                          ? format(new Date(record.check_out_time), 'h:mm a')
                          : '--:--'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {record.total_hours && (
                    <span className="text-sm text-muted-foreground">
                      {record.total_hours.toFixed(1)}h
                    </span>
                  )}
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
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
