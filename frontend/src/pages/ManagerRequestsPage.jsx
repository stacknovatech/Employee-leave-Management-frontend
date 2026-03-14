

import { useState } from "react";
import { getTeamLeaveRequests, approveLeaveRequest, rejectLeaveRequest } from "@/services/managerService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  ClipboardList,
  CheckCircle2,
  XCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// filter options
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function ManagerRequestsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const queryClient = useQueryClient();

  const {
    data: teamRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["teamRequests"],
    queryFn: getTeamLeaveRequests,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });

  const teamRequests = teamRes?.data?.requests || [];

  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    type: "",
    requestId: "",
    employeeName: "",
    comment: "",
    isProcessing: false,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }) => approveLeaveRequest(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      toast.success(`Leave approved for ${actionDialog.employeeName} ✅`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }) => rejectLeaveRequest(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      toast.success(`Leave rejected for ${actionDialog.employeeName}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Action failed.");
    },
  });

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
        Failed to load team requests.
      </div>
    );
  }

  const filteredRequests =
    activeFilter === "all"
      ? teamRequests
      : teamRequests.filter((r) => r.status === activeFilter);

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

  // loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Team Leave Requests 📋
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Review and manage leave requests from your team members
        </p>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(option.value)}
            className={cn(
              "transition-all",
              activeFilter === option.value && "shadow-md shadow-brand-500/20"
            )}
          >
            {option.label}
            <span className="ml-1.5 text-xs opacity-70">
              ({option.value === "all"
                ? teamRequests.length
                : teamRequests.filter((r) => r.status === option.value).length})
            </span>
          </Button>
        ))}
      </div>

      {/* Requests table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-brand-400" />
            {activeFilter === "all" ? "All Requests" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Requests`}
            <span className="text-sm font-normal text-[var(--text-secondary)]">
              ({filteredRequests.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveTable
            leaveRequests={filteredRequests}
            showEmployeeName={true}
            renderActions={renderRequestActions}
          />
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
              {actionDialog.type === "approve" ? "Approve" : "Reject"} Leave
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === "approve"
                ? `You are about to approve ${actionDialog.employeeName}'s leave request.`
                : `You are about to reject ${actionDialog.employeeName}'s leave request.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Label htmlFor="manager-comment-page">
              <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />
              Comment (optional)
            </Label>
            <Textarea
              id="manager-comment-page"
              placeholder={
                actionDialog.type === "approve"
                  ? "e.g. Approved. Take care!"
                  : "e.g. Sorry, we need you this week for the release."
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
    </div>
  );
}

export default ManagerRequestsPage;
