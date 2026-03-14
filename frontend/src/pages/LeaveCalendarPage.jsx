// =============================================
// Leave Calendar Page
// Shows team leaves on a FullCalendar view
// Available to both employees and managers
// =============================================

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getCalendarEvents } from "@/services/leaveService";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";

// leave type ke hisaab se color assign karo
const leaveTypeColors = {
  vacation: "#6366f1", // brand indigo
  sick: "#ef4444",     // red
  casual: "#f59e0b",   // amber
};

function LeaveCalendarPage() {
  const [calendarEvents, setCalendarEvents] = useState([]);

  const { isLoading, isError } = useQuery({
    queryKey: ["calendarEvents"],
    queryFn: getCalendarEvents,
    refetchOnWindowFocus: true,
    refetchInterval: 30000, // refetch every 30 seconds as backup
    onSuccess: (calendar) => {
      // getCalendarEvents now returns the raw array of leave requests
      const rawEvents = calendar || [];
      const formattedEvents = rawEvents.map((event) => ({
        id: event._id,
        title: `${event.employeeId?.name || "Employee"} - ${event.leaveType}`,
        start: event.startDate,
        end: event.endDate,
        backgroundColor: leaveTypeColors[event.leaveType] || "#6366f1",
        borderColor: "transparent",
        textColor: "#ffffff",
        extendedProps: {
          leaveType: event.leaveType,
          employeeName: event.employeeId?.name,
        },
      }));
      setCalendarEvents(formattedEvents);
    },
    onError: (error) => {
      console.error("Failed to load calendar:", error.message);
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
        Failed to load calendar data.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Leave Calendar 📅
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          View your team's approved leaves on the calendar
        </p>
      </div>

      {/* Color legend */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-500" />
          <span className="text-sm text-[var(--text-secondary)]">Vacation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-[var(--text-secondary)]">Sick Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-[var(--text-secondary)]">Casual Leave</span>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-400" />
            Team Leave Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="leave-calendar-wrapper">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={calendarEvents}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,dayGridWeek",
              }}
              height="auto"
              eventDisplay="block"
              eventBorderColor="transparent"
              dayMaxEvents={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom FullCalendar styles to match our theme */}
      <style>{`
        .leave-calendar-wrapper .fc {
          font-family: 'Poppins', sans-serif;
        }
        .leave-calendar-wrapper .fc-toolbar-title {
          font-size: 1.1rem !important;
          font-weight: 600;
          color: var(--text-primary);
        }
        .leave-calendar-wrapper .fc-button {
          background-color: var(--bg-hover) !important;
          border-color: var(--border-main) !important;
          color: var(--text-primary) !important;
          font-size: 0.8rem !important;
          padding: 4px 12px !important;
          border-radius: 6px !important;
          font-weight: 500;
          text-transform: capitalize;
        }
        .leave-calendar-wrapper .fc-button:hover {
          background-color: var(--bg-card) !important;
        }
        .leave-calendar-wrapper .fc-button-active {
          background-color: #6366f1 !important;
          border-color: #6366f1 !important;
          color: #fff !important;
        }
        .leave-calendar-wrapper .fc-daygrid-day {
          border-color: var(--border-main) !important;
        }
        .leave-calendar-wrapper .fc-col-header-cell {
          background-color: var(--bg-hover);
          border-color: var(--border-main) !important;
          padding: 8px 0;
        }
        .leave-calendar-wrapper .fc-col-header-cell-cushion {
          color: var(--text-secondary);
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }
        .leave-calendar-wrapper .fc-daygrid-day-number {
          color: var(--text-primary);
          font-size: 0.8rem;
          padding: 4px 8px;
        }
        .leave-calendar-wrapper .fc-event {
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 0.7rem !important;
          font-weight: 500;
        }
        .leave-calendar-wrapper .fc-day-today {
          background-color: rgba(99, 102, 241, 0.05) !important;
        }
        .leave-calendar-wrapper .fc-scrollgrid {
          border-color: var(--border-main) !important;
        }
        .leave-calendar-wrapper th {
          border-color: var(--border-main) !important;
        }
      `}</style>
    </div>
  );
}

export default LeaveCalendarPage;
