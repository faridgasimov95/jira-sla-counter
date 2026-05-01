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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <dialog
        className="bg-[rgb(255,255,245)] rounded-3xl shadow-2xl p-8 w-96"
        open
      >
        <div className="flex border-2 border-gray-200 rounded-xl p-1 mb-6">
          <button
            onClick={() => changeActiveTab(ActiveTab.SignIn)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === ActiveTab.SignIn
                ? "bg-yellow-500 text-white hover:text-gray-100 hover:bg-yellow-400"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign-In
          </button>
          <button
            onClick={() => changeActiveTab(ActiveTab.SignUp)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === ActiveTab.SignUp
                ? "bg-yellow-500 text-white hover:text-gray-100 hover:bg-yellow-400"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign-Up
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={authData.email}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition-colors bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={authData.password}
              onChange={(e) =>
                setAuthData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition-colors bg-transparent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Confirm Password
            </label>
            {activeTab === ActiveTab.SignUp && (
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
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-yellow-500 transition-colors bg-transparent"
              />
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-1 rounded-xl bg-yellow-500 font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </dialog>
    </div>
  );
}
