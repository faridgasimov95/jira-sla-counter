import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthContextProvider from "./context/AuthContext";
import UploadPage from "./pages/Upload";
import HistoryPage from "./pages/History";
import RootLayout from "./pages/Root";
import ProtectedRoute from "./components/ProtectedRoute";
import SettingsPage from "./pages/Settings";
import SettingsContextProvider from "./context/SettingsContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <AuthContextProvider>
      <SettingsContextProvider>
        <RouterProvider router={router} />
      </SettingsContextProvider>
    </AuthContextProvider>
  );
}

export default App;
