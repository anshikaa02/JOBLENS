import { Outlet, useMatches, type UIMatch } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface RouteHandle {
  title?: string;
}

export default function AppLayout() {
  const matches = useMatches() as UIMatch<unknown, RouteHandle>[];
  const current = [...matches].reverse().find((m) => m.handle?.title);
  const title = current?.handle?.title ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-ink-950">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar title={title} />
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
