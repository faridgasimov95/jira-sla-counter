import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import HelpButton from "../components/HelpButton";

function RootLayout() {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      {user && <HelpButton />}
    </div>
  );
}

export default RootLayout;
