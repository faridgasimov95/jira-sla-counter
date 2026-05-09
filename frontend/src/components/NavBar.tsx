import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

export default function NavBar() {
  const { user, signOut } = useAuth();
  const { settingsComplete } = useSettings();
  const navigate = useNavigate();

  return (
    <nav className="bg-nav-bg border-b border-divider px-6 flex items-stretch h-14 z-50">
      <span className="text-xl text-nav-text font-bold flex items-center px-4">
        Jira SLA Counter
      </span>

      {user && (
        <div className="flex items-stretch ml-auto">
          <span className="text-sm text-nav-text-muted flex items-center px-4">
            {user.email}
          </span>
          <div className="relative group flex items-stretch">
            <NavLink
              to="/"
              onClick={(e) => !settingsComplete && e.preventDefault()}
              className={({ isActive }) =>
                isActive && settingsComplete
                  ? "text-sm font-semibold bg-surface text-primary flex items-center px-4"
                  : `text-sm font-medium flex items-center px-4 transition-colors ${
                      settingsComplete
                        ? " text-nav-text hover:text-nav-text-muted hover:bg-nav-hover"
                        : "text-nav-text-muted cursor-not-allowed"
                    }  `
              }
            >
              Upload
            </NavLink>
            {!settingsComplete && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-surface border border-divider text-text-base text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Fill out your settings first
              </div>
            )}
          </div>

          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold  bg-surface text-primary flex items-center px-4"
                : "text-sm font-medium text-nav-text hover:text-nav-text-muted hover:bg-nav-hover flex items-center px-4 transition-colors"
            }
          >
            History
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              isActive
                ? "text-sm font-semibold  bg-surface text-primary flex items-center px-4"
                : "text-sm font-medium text-nav-text hover:text-nav-text-muted hover:bg-nav-hover flex items-center px-4 transition-colors"
            }
          >
            Settings
          </NavLink>

          <button
            onClick={() => {
              signOut();
              navigate("/");
            }}
            className="text-sm text-nav-text hover:bg-red-600 flex items-center px-4 transition-colors"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}
