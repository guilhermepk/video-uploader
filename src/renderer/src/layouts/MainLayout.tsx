import { routes } from "@renderer/common/routes";
import BackButton from "@renderer/components/BackButton";
import Navbar from "@renderer/components/Navbar";
import { Outlet, useLocation } from "react-router-dom";

export default function MainLayout(): React.JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <LocalNavbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

function LocalNavbar(): React.JSX.Element | null {
  const location = useLocation();

  if (location.pathname === routes.homePage.path) return null;

  const pageRoute = Object.values(routes).find(item => item.path == location.pathname);

  return (
    <div className="bg-[#1b1b1f] shadow-md w-full h-[60px] flex items-center gap-7 py-2 px-4">
      <BackButton />

      <h1 className="text-[25px]! text-white"> {pageRoute?.['name'] ?? ''} </h1>
    </div>
  );
}