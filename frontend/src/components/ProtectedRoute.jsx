
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/**
 * Wrap any route with this to protect it.
 * @param {string} allowedRole - "employee" or "manager" (optional)
 * @param {React.ReactNode} children - the page to render if authorized
 */
function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser?.role !== allowedRole) {
    const redirectPath = currentUser?.role === "manager"
      ? "/manager/dashboard"
      : "/employee/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default ProtectedRoute;
