import api from "./api";

export const getTeamLeaveRequests = async () => {
  const response = await api.get("/manager/team-requests");
  return response.data;
};

export const approveLeaveRequest = async (leaveId, comment = "") => {
  const response = await api.put(`/manager/leave/${leaveId}/approve`, { comment });
  return response.data;
};

export const rejectLeaveRequest = async (leaveId, comment = "") => {
  const response = await api.put(`/manager/leave/${leaveId}/reject`, { comment });
  return response.data;
};
