
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, Sun, Moon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

function Navbar({ onToggleSidebar }) {
  const { currentUser, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const toggleTheme = () => {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains("dark")) {
      htmlEl.classList.remove("dark");
      setIsDarkMode(false);
    } else {
      htmlEl.classList.add("dark");
      setIsDarkMode(true);
    }
  };

  const firstName = currentUser?.name?.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-main)] bg-[var(--bg-card)]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onToggleSidebar}
            id="sidebar-toggle-btn"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            {/* app logo coming from assets folder */}
            <img
              src="/src/assets/HyScaler_-_Careers_and_Job_Opportunities-removebg-preview.png"
              alt="HYSCALER"
              className="h-8 w-auto"
            />
            {/* application name removed; logo only */}
            <span className="sr-only">Employee Leave Management</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            id="theme-toggle-btn"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-main)]">
            <div className="h-7 w-7 rounded-full bg-brand-500/20 flex items-center justify-center">
              <span className="text-brand-400 text-xs font-semibold">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[var(--text-primary)] leading-tight">
                {firstName}
              </span>
              <span className="text-[10px] text-[var(--text-secondary)] capitalize leading-tight">
                {currentUser?.role}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            title="Logout"
            id="logout-btn"
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
