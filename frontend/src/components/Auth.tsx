import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { signUp as apiSignUp, signIn as apiSignIn } from "../api/authApi.ts";
import { AuthCredentials } from "../types/auth.ts";
import { submitButtonClass } from "../constants/styles.ts";
import FormField from "./FormField.tsx";

enum ActiveTab {
  SignUp = "SIGNUP",
  SignIn = "SIGNIN",
}

export default function Auth() {
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
    <div className="flex h-full bg-background items-center justify-center">
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
          <FormField
            label="Email"
            type="email"
            name="email"
            value={authData.email}
            placeholder="you@company.com"
            onChange={(e) =>
              setAuthData((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <FormField
            label="Password"
            type="password"
            name="password"
            value={authData.password}
            placeholder="Min. 8 characters"
            onChange={(e) =>
              setAuthData((prev) => ({ ...prev, password: e.target.value }))
            }
          />

          <FormField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={authData.confirmPassword}
            placeholder="Repeat your password"
            onChange={(e) =>
              setAuthData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            invisible={activeTab === ActiveTab.SignIn}
          />

          <button
            type="submit"
            disabled={isLoading}
            className={submitButtonClass}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
