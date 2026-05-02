import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, signOut } = useAuth();
  function openSettings() {}
  return (
    <nav className="bg-nav-bg border-b border-divider px-6 py-3 flex items-center">
      <span className="text-nav-text text-lg font-bold">Jira SLA Counter</span>

      {user && (
        <div className="flex items-center gap-6 ml-auto">
          <span className="text-sm text-nav-text-muted">{user.email}</span>

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-nav-active"
                : "text-sm text-nav-text hover:text-nav-text-muted transition-colors"
            }
          >
            Upload
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold text-nav-active"
                : "text-sm text-nav-text hover:text-nav-text-muted transition-colors"
            }
          >
            History
          </NavLink>

          <button
            onClick={openSettings}
            className="text-sm text-nav-text hover:text-nav-text-muted transition-colors"
          >
            Settings
          </button>

          <button
            onClick={signOut}
            className="text-sm px-3 py-1.5 rounded-lg border border-nav-text-muted text-nav-text hover:bg-nav-hover transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
