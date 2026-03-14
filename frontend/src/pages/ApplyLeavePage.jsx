
import LeaveForm from "@/components/LeaveForm";

function ApplyLeavePage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Apply for Leave 📝
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Submit a new leave request to your manager
        </p>
      </div>

      <LeaveForm />
    </div>
  );
}

export default ApplyLeavePage;
