import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { initSocket, getSocket, disconnectSocket } from "@/lib/socket";

/**
 * Component that establishes socket connection once user is logged in
 * and listens for real-time events to invalidate react-query caches.
 *
 * This component should be mounted at the root of the app (e.g. in App.jsx)
 * inside a QueryClientProvider so that queryClient is available.
 */
function SocketListener() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUser) {
      // disconnect if user logs out (clears instance so login can reconnect)
      disconnectSocket();
      return;
    }

    const token = localStorage.getItem("token");
    const socket = initSocket(token);

    // if the backend reuses the same socket instance, make sure listeners are not attached twice
    socket.off("newLeaveRequest");
    socket.off("leaveRequestUpdated");

    // manager should refresh teamRequests when someone in team creates a new request
    socket.on("newLeaveRequest", (leave) => {
      if (currentUser.role === "manager" && leave.managerId === currentUser._id) {
        queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      }
    });

    // status of a leave changed (approved/rejected) – notify employee and manager
    socket.on("leaveRequestUpdated", (leave) => {
      // Always refresh calendar since approvals affect calendar display
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
      
      // update team view if manager of that employee
      if (currentUser.role === "manager" && leave.managerId === currentUser._id) {
        queryClient.invalidateQueries({ queryKey: ["teamRequests"] });
      }
      // update personal data for employee
      if (currentUser.role === "employee" && leave.employeeId === currentUser._id) {
        queryClient.invalidateQueries({ queryKey: ["myRequests"] });
        queryClient.invalidateQueries({ queryKey: ["leaveBalance"] });
      }
    });

    return () => {
      socket.off("newLeaveRequest");
      socket.off("leaveRequestUpdated");
    };
  }, [currentUser, queryClient]);

  return null;
}

export default SocketListener;