import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { signUp as apiSignUp, signIn as apiSignIn } from "../api/authApi";
import { AuthCredentials } from "../types/auth.ts";

enum ActiveTab {
  SignUp = "SIGNUP",
  SignIn = "SIGNIN",
}

export default function AuthModal() {
  const [activeTab, setActiveTab] = useState(ActiveTab.SignIn);
  const [authData, setAuthData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  function changeActiveTab(tab: ActiveTab) {
    setActiveTab(tab);
    if (activeTab !== tab) {
      setError("");
      setAuthData({
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!authData.email || !authData.password) {
      setError("Email and password are required.");
      console.error("Email and password are required.");
      return;
    } else if (activeTab === ActiveTab.SignUp && authData.password.length < 8) {
      setError("Password should be at least 8 characters long.");
      console.error("Password should be at least 8 characters long.");
      return;
    } else if (
      activeTab === ActiveTab.SignUp &&
      authData.password !== authData.confirmPassword
    ) {
      setError("Passwords do not match.");
      console.error("Passwords do not match.");
      return;
    }

    const credentials: AuthCredentials = {
      email: authData.email,
      password: authData.password,
    };

    setIsLoading(true);

    try {
      if (activeTab === ActiveTab.SignUp) {
        const data = await apiSignUp(credentials);
        signIn(data.email, data.token);
      } else if (activeTab === ActiveTab.SignIn) {
        const data = await apiSignIn(credentials);
        signIn(data.email, data.token);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex items-center justify-center bg-background">
      <div className="bg-surface rounded-2xl shadow-sm border border-divider p-8 w-96 ">
        <div className="flex border border-divider rounded-lg p-1 mb-6">
          <button
            onClick={() => changeActiveTab(ActiveTab.SignIn)}
            className={`flex-1 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              activeTab === ActiveTab.SignIn
                ? "bg-primary text-white hover:bg-primary-hover hover:text-gray-100 "
                : "text-text-muted hover:text-text-base"
            }`}
          >
            Sign-In
          </button>
          <button
            onClick={() => changeActiveTab(ActiveTab.SignUp)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === ActiveTab.SignUp
                ? "bg-primary text-white hover:bg-primary-hover hover:text-gray-100 "
                : "text-text-muted hover:text-text-base"
            }`}
          >
            Sign-Up
          </button>
        </div>
        {error && (
          <p className="text-error text-sm bg-error-bg rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={authData.email}
              placeholder="you@company.com"
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={authData.password}
              placeholder="Min. 8 characters"
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent"
            />
          </div>
          <div
            className={`flex flex-col gap-1 ${
              activeTab === ActiveTab.SignIn ? "invisible" : ""
            }`}
          >
            <label className="text-xs font-medium text-text-muted uppercase tracking-wide">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={authData.confirmPassword}
              onChange={(e) =>
                setAuthData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              placeholder="Repeat your password"
              className="border border-divider rounded-lg px-3 py-2 text-sm text-text-base outline-none focus:border-primary transition-colors bg-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-1 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors disabled:opacity-50 "
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
