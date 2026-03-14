
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const statusVariantMap = {
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

const leaveTypeLabels = {
  vacation: "Vacation",
  sick: "Sick Leave",
  casual: "Casual Leave",
};

/**
 * @param {Array} leaveRequests - Array of leave request objects
 * @param {boolean} showEmployeeName - true for manager view (shows who applied)
 * @param {Function} renderActions - optional render function for action buttons (manager approval)
 */
function LeaveTable({ leaveRequests = [], showEmployeeName = false, renderActions }) {
  if (leaveRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="h-16 w-16 rounded-full bg-[var(--bg-hover)] flex items-center justify-center mb-4">
          <span className="text-2xl">📋</span>
        </div>
        <p className="text-[var(--text-secondary)] text-sm">No leave requests found.</p>
        <p className="text-[var(--text-secondary)] text-xs mt-1">When you apply for leave, it will appear here.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {showEmployeeName && <TableHead>Employee</TableHead>}
          <TableHead>Leave Type</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Status</TableHead>
          {renderActions && <TableHead className="text-right">Actions</TableHead>}
        </TableRow>
      </TableHeader>

      <TableBody>
        {leaveRequests.map((request) => (
          <TableRow key={request._id}>
            {showEmployeeName && (
              <TableCell className="font-medium">
                {request.employeeId?.name || "Unknown"}
              </TableCell>
            )}

            <TableCell>
              <span className="font-medium">
                {leaveTypeLabels[request.leaveType] || request.leaveType}
              </span>
            </TableCell>

            <TableCell>{formatDate(request.startDate)}</TableCell>
            <TableCell>{formatDate(request.endDate)}</TableCell>

            <TableCell className="max-w-[200px]">
              <p className="truncate" title={request.reason}>
                {request.reason}
              </p>
            </TableCell>

            <TableCell>
              <Badge variant={statusVariantMap[request.status] || "outline"}>
                {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
              </Badge>
            </TableCell>

            {renderActions && (
              <TableCell className="text-right">
                {renderActions(request)}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default LeaveTable;
