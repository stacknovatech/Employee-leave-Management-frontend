

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyForLeave } from "@/services/leaveService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

function LeaveForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const mutation = useMutation({
    mutationFn: applyForLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRequests"] });
      queryClient.invalidateQueries({ queryKey: ["leaveBalance"] });
      toast.success("Leave request submitted successfully! 🎉");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      navigate("/employee/my-leaves");
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.message || "Failed to submit leave request.";
      toast.error(errorMsg);
    },
  });

  const isSubmitting = mutation.isPending;

  // form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    // basic validation
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      toast.error("Please fill all the fields.");
      return;
    }

    // check ki end date start date ke baad ho
    if (new Date(endDate) < new Date(startDate)) {
      toast.error("End date cannot be before start date.");
      return;
    }

    mutation.mutate({ leaveType, startDate, endDate, reason });
  };

  return (
    <Card className="max-w-2xl mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5 text-brand-400" />
          Apply for Leave
        </CardTitle>
        <CardDescription>
          Fill out the form below to submit your leave request. Your manager will review it.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
            >
              <option value="" disabled>Select leave type...</option>
              <option value="vacation">🏖️ Vacation Leave</option>
              <option value="sick">🤒 Sick Leave</option>
              <option value="casual">📝 Casual Leave</option>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Leave</Label>
            <Textarea
              id="reason"
              placeholder="E.g. Going to family wedding in Jaipur..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
            id="submit-leave-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Leave Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default LeaveForm;
