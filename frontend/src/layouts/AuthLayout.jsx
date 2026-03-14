
import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-12 w-18 rounded-xl flex items-center justify-center mx-auto mb-3 overflow-hidden">
            <img
              src="/src/assets/HyScaler_-_Careers_and_Job_Opportunities-removebg-preview.png"
              alt="HYSCALER"
              className="h-full w-auto"
            />
          </div>
          {/* removed product name, logo will represent app */}
          <h1 className="text-2xl font-bold text-[var(--text-primary)] sr-only">
            Employee Leave Management
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Employee Leave Management System
          </p>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
