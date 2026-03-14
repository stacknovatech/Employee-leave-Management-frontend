import api from "./api";

export const applyForLeave = async (leaveData) => {
  const response = await api.post("/leave/request", leaveData);
  return response.data;
};

export const getMyLeaveRequests = async () => {
  const response = await api.get("/leave/my-requests");
  return response.data;
};

export const getLeaveBalance = async () => {
  const response = await api.get("/leave/balance");
  return response.data;
};

export const getCalendarEvents = async () => {
  const response = await api.get("/leave/calendar");
  return response.data?.data?.calendar ?? [];
};
