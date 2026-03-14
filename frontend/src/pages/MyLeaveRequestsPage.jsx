

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyLeaveRequests } from "@/services/leaveService";
import LeaveTable from "@/components/LeaveTable";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

// filter buttons config
const filterOptions = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function MyLeaveRequestsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const {
    data: requestsRes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myRequests"],
    queryFn: getMyLeaveRequests,
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });

  const allRequests = requestsRes?.data?.requests || [];

  const filteredRequests =
    activeFilter === "all"
      ? allRequests
      : allRequests.filter((r) => r.status === activeFilter);

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
          My Leave Requests 📋
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Track all your submitted leave requests here
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
            {/* count badge */}
            <span className="ml-1.5 text-xs opacity-70">
              ({option.value === "all"
                ? allRequests.length
                : allRequests.filter((r) => r.status === option.value).length})
            </span>
          </Button>
        ))}
      </div>

      {/* Requests table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-brand-400" />
            {activeFilter === "all" ? "All Requests" : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Requests`}
            <span className="text-sm font-normal text-[var(--text-secondary)]">
              ({filteredRequests.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LeaveTable leaveRequests={filteredRequests} />
        </CardContent>
      </Card>
    </div>
  );
}

export default MyLeaveRequestsPage;
