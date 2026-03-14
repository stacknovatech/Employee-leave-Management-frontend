
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getLeaveBalance, getMyLeaveRequests } from "@/services/leaveService";
import { useQuery } from "@tanstack/react-query";
import DashboardCard from "@/components/DashboardCard";
import LeaveTable from "@/components/LeaveTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PalmtreeIcon,
  Stethoscope,
  Coffee,
  Clock,
  PlusCircle,
  CalendarDays,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function EmployeeDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedLeave, setSelectedLeave] = useState(null);

  const {
    data: balanceData,
    isLoading: balanceLoading,
    isError: balanceError,
  } = useQuery({
    queryKey: ["leaveBalance"],
    queryFn: getLeaveBalance,
    refetchOnWindowFocus: true,
  });

  const {
    data: requestsData,
    isLoading: leavesLoading,
    isError: leavesError,
  } = useQuery({
    queryKey: ["myRequests"],
    queryFn: getMyLeaveRequests,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  const isLoading = balanceLoading || leavesLoading;

  const balance = balanceData?.data?.balance;
  const allRequests = requestsData?.data?.requests || [];
  const recentLeaves = allRequests.slice(0, 5);

  const pendingCount = allRequests.filter((r) => r.status === "pending").length;
  const approvedCount = allRequests.filter((r) => r.status === "approved").length;
  const rejectedCount = allRequests.filter((r) => r.status === "rejected").length;
  const today = new Date();
  const upcomingLeaves = allRequests.filter(
    (r) => r.status === "approved" && new Date(r.startDate) > today
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (balanceError || leavesError) {
    return (
      <div className="text-center text-red-500">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Welcome, {currentUser?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here&apos;s your leave overview for today
          </p>
        </div>

        {/* Quick apply button */}
        <Button onClick={() => navigate("/employee/apply-leave")} id="quick-apply-btn">
          <PlusCircle className="h-4 w-4" />
          Apply Leave
        </Button>
      </div>

      {/* Stat cards - leave balance + counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard
          title="Vacation Days"
          value={balance?.vacationDays ?? "—"}
          subtitle="Available vacation leaves"
          icon={PalmtreeIcon}
          iconColor="text-emerald-400"
        />
        <DashboardCard
          title="Sick Leave"
          value={balance?.sickDays ?? "—"}
          subtitle="Available sick leaves"
          icon={Stethoscope}
          iconColor="text-blue-400"
        />
        <DashboardCard
          title="Casual Leave"
          value={balance?.casualDays ?? "—"}
          subtitle="Available casual leaves"
          icon={Coffee}
          iconColor="text-amber-400"
        />
        <DashboardCard
          title="Pending Requests"
          value={pendingCount}
          subtitle="Awaiting manager approval"
          icon={Clock}
          iconColor="text-orange-400"
        />
        <DashboardCard
          title="Approved Requests"
          value={approvedCount}
          subtitle="Completed by manager"
          icon={CheckCircle2}
          iconColor="text-green-400"
        />
        <DashboardCard
          title="Rejected Requests"
          value={rejectedCount}
          subtitle="Declined by manager"
          icon={XCircle}
          iconColor="text-red-400"
        />
      </div>

      {/* Upcoming leaves info */}
      {upcomingLeaves.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-400" />
              Upcoming Approved Leaves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {upcomingLeaves.map((leave) => (
                <button
                  key={leave._id}
                  onClick={() => setSelectedLeave(leave)}
                  className="w-full text-left flex items-start justify-between rounded-lg border border-[var(--border-main)] bg-[var(--bg-hover)] px-4 py-3 hover:bg-[var(--bg-hover)]/80 hover:border-brand-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium capitalize text-[var(--text-primary)]">
                        {leave.leaveType} Leave
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400">
                        {leave.status}
                      </span>
                    </div>
                    {leave.reason && (
                      <p className="text-xs text-[var(--text-secondary)] truncate break-words">
                        {leave.reason}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--text-secondary)] flex-shrink-0 ml-2 group-hover:text-brand-400">
                    {new Date(leave.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}{" "}
                    -{" "}
                    {new Date(leave.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent leave requests table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Leave Requests</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/employee/my-leaves")}
            className="text-brand-400"
          >
            View All →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <LeaveTable leaveRequests={recentLeaves} />
          </div>
        </CardContent>
      </Card>

      {/* Leave Details Modal */}
      <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    Leave Type
                  </p>
                  <p className="text-sm font-medium capitalize text-[var(--text-primary)]">
                    {selectedLeave.leaveType}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    Status
                  </p>
                  <div className="flex items-center gap-1">
                    {selectedLeave.status === "approved" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {selectedLeave.status === "pending" && <Clock className="h-4 w-4 text-amber-500" />}
                    {selectedLeave.status === "rejected" && <XCircle className="h-4 w-4 text-red-500" />}
                    <span className="text-sm capitalize text-[var(--text-primary)]">
                      {selectedLeave.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    Start Date
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {new Date(selectedLeave.startDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                    End Date
                  </p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {new Date(selectedLeave.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {(selectedLeave.reason || selectedLeave.comment) && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                    Reason & Manager Feedback
                  </p>
                  <div className="bg-[var(--bg-hover)] rounded-lg p-3 space-y-2">
                    {selectedLeave.reason && (
                      <p className="text-sm text-[var(--text-primary)] whitespace-normal break-words">
                        <strong>Employee:</strong> {selectedLeave.reason}
                      </p>
                    )}
                    {selectedLeave.comment && (
                      <p className="text-sm text-[var(--text-primary)] whitespace-normal break-words">
                        <strong>Manager:</strong> {selectedLeave.comment}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedLeave(null)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EmployeeDashboard;
