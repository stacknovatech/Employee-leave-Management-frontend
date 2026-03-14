
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getTeamLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "@/services/managerService";
import DashboardCard from "@/components/DashboardCard";
import LeaveTable from "@/components/LeaveTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
  Copy,
  Check,
  CalendarDays,
} from "lucide-react";

function ManagerDashboard() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State for copy feedback
  const [copiedId, setCopiedId] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState(null);

  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    type: "",
    requestId: "",
    employeeName: "",
    comment: "",
    isProcessing: false,
  });

  const {
    data: teamRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teamRequests"],
    queryFn: getTeamLeaveRequests,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // poll every 5 seconds as fallback
  });

  // Mutations for approve/reject
  const approveMutation = useMutation({
    mutationFn: ({ id, comment }) => approveLeaveRequest(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      toast.success(`Leave approved for ${actionDialog.employeeName} ✅`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }) => rejectLeaveRequest(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      toast.success(`Leave rejected for ${actionDialog.employeeName}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed. Please try again.");
    },
  });

  const teamRequests = teamRes?.data?.requests || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Failed to load team requests. Please refresh.
      </div>
    );
  }

  // open dialog for approve or reject
  const openActionDialog = (type, request) => {
    setActionDialog({
      isOpen: true,
      type,
      requestId: request._id,
      employeeName: request.employeeId?.name || "Employee",
      comment: "",
      isProcessing: false,
    });
  };

  // process the approve/reject action
  const handleAction = () => {
    setActionDialog((prev) => ({ ...prev, isProcessing: true }));
    if (actionDialog.type === "approve") {
      approveMutation.mutate({ id: actionDialog.requestId, comment: actionDialog.comment }, {
        onSettled: () => {
          setActionDialog((prev) => ({ ...prev, isOpen: false, isProcessing: false }));
        },
      });
    } else {
      rejectMutation.mutate({ id: actionDialog.requestId, comment: actionDialog.comment }, {
        onSettled: () => {
          setActionDialog((prev) => ({ ...prev, isOpen: false, isProcessing: false }));
        },
      });
    }
  };

  // Dashboard stats
  const pendingRequests = teamRequests.filter((r) => r.status === "pending");
  const today = new Date();
  const upcomingTeamLeaves = teamRequests.filter(
    (r) => r.status === "approved" && new Date(r.startDate) > today
  );

  // Copy manager ID to clipboard
  const handleCopyId = () => {
    navigator.clipboard.writeText(currentUser?._id || "");
    setCopiedId(true);
    toast.success("Manager ID copied!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  // render actions for each table row (approve/reject buttons)
  const renderRequestActions = (request) => {
    if (request.status !== "pending") return null;

    return (
      <div className="flex items-center gap-2 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openActionDialog("approve", request)}
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
        >
          <CheckCircle2 className="h-4 w-4" />
          Approve
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openActionDialog("reject", request)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Manager Dashboard 🎯
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Welcome back, {currentUser?.name?.split(" ")[0]}. Here&apos;s your team overview.
        </p>
      </div>

      {/* Manager ID Card - Share with employees */}
      <Card className="border-brand-500/30 bg-brand-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                Your Manager ID
              </p>
              <p className="text-lg font-mono font-bold text-[var(--text-primary)] mt-2 break-all">
                {currentUser?._id}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                Share this ID with employees during registration
              </p>
            </div>
            <Button
              onClick={handleCopyId}
              variant="outline"
              size="sm"
              className="shrink-0 ml-4"
            >
              {copiedId ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <DashboardCard
          title="Pending Requests"
          value={pendingRequests.length}
          subtitle="Awaiting your action"
          icon={Clock}
          iconColor="text-amber-400"
        />
        <DashboardCard
          title="Approved Requests"
          value={teamRequests.filter((r) => r.status === "approved").length}
          subtitle="Completed leaves"
          icon={CheckCircle2}
          iconColor="text-green-400"
        />
        <DashboardCard
          title="Rejected Requests"
          value={teamRequests.filter((r) => r.status === "rejected").length}
          subtitle="Declined leaves"
          icon={XCircle}
          iconColor="text-red-400"
        />
      </div>

      {/* Upcoming team leaves */}
      {upcomingTeamLeaves.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-brand-400" />
              Upcoming Team Leaves
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {upcomingTeamLeaves.map((leave) => (
                <button
                  key={leave._id}
                  onClick={() => setSelectedLeave(leave)}
                  className="w-full text-left flex items-start justify-between rounded-lg border border-[var(--border-main)] bg-[var(--bg-hover)] px-4 py-3 hover:bg-[var(--bg-hover)]/80 hover:border-brand-400/50 transition-all cursor-pointer group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)] whitespace-normal break-words">
                        {leave.employeeId?.name || "Employee"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-brand-500/20 text-brand-400 capitalize">
                        {leave.leaveType}
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

      {/* Pending requests - highlighted */}
      {pendingRequests.length > 0 && (
        <Card className="border-amber-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              Pending Requests ({pendingRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto">
              <LeaveTable
                leaveRequests={pendingRequests}
                showEmployeeName={true}
                renderActions={renderRequestActions}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* All team requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">All Team Requests</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/manager/requests")}
            className="text-brand-400"
          >
            View All →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="max-h-[400px] overflow-y-auto">
            <LeaveTable
              leaveRequests={teamRequests.slice(0, 8)}
              showEmployeeName={true}
              renderActions={renderRequestActions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Approve/Reject Dialog */}
      <Dialog
        open={actionDialog.isOpen}
        onOpenChange={(open) => setActionDialog((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actionDialog.type === "approve" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              {actionDialog.type === "approve" ? "Approve" : "Reject"} Leave Request
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve"
                ? `Approve leave request for ${actionDialog.employeeName}?`
                : `Reject leave request for ${actionDialog.employeeName}?`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="manager-comment">
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
              Comment (optional)
            </Label>
            <Textarea
              id="manager-comment"
              placeholder={
                actionDialog.type === "approve"
                  ? "e.g. Approved, enjoy your break!"
                  : "e.g. Sorry, team has a deadline this week."
              }
              value={actionDialog.comment}
              onChange={(e) =>
                setActionDialog((prev) => ({ ...prev, comment: e.target.value }))
              }
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === "approve" ? "default" : "destructive"}
              onClick={handleAction}
              disabled={actionDialog.isProcessing}
            >
              {actionDialog.isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionDialog.type === "approve" ? (
                "Approve"
              ) : (
                "Reject"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Details Modal */}
      <Dialog open={!!selectedLeave} onOpenChange={(open) => !open && setSelectedLeave(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1">
                  Employee Name
                </p>
                <p className="text-sm font-medium text-[var(--text-primary)] whitespace-normal break-words">
                  {selectedLeave.employeeId?.name || "N/A"}
                </p>
              </div>

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

              {selectedLeave.reason && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                    Reason
                  </p>
                  <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-lg p-3 whitespace-normal break-words">
                    {selectedLeave.reason}
                  </p>
                </div>
              )}

              {selectedLeave.comment && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
                    Manager Comment
                  </p>
                  <p className="text-sm text-[var(--text-primary)] bg-[var(--bg-hover)] rounded-lg p-3 whitespace-normal break-words">
                    {selectedLeave.comment}
                  </p>
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

export default ManagerDashboard;
