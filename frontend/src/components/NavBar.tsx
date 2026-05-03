import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-nav-bg border-b border-divider px-6 flex items-stretch h-14">
      <span className="text-xl text-nav-text font-bold flex items-center px-4">
        Jira SLA Counter
      </span>

      {user && (
        <div className="flex items-stretch ml-auto">
          <span className="text-sm text-nav-text-muted flex items-center px-4">
            {user.email}
          </span>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold  bg-surface text-primary flex items-center px-4"
                : "text-sm text-nav-text hover:text-nav-text-muted hover:bg-nav-hover flex items-center px-4 transition-colors"
            }
          >
            Upload
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold  bg-surface text-primary flex items-center px-4"
                : "text-sm text-nav-text hover:text-nav-text-muted hover:bg-nav-hover flex items-center px-4 transition-colors"
            }
          >
            History
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold  bg-surface text-primary flex items-center px-4"
                : "text-sm text-nav-text hover:text-nav-text-muted hover:bg-nav-hover flex items-center px-4 transition-colors"
            }
          >
            Settings
          </NavLink>

          <button
            onClick={signOut}
            className="text-sm text-nav-text hover:bg-red-600 flex items-center px-4 transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
