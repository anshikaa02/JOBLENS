import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

/**
 * Maps a route prefix to the page title shown in the top navbar.
 * We do this with a plain lookup (rather than react-router's `useMatches`)
 * because `useMatches` only works with the newer data-router setup
 * (`createBrowserRouter`) — this app uses the classic <BrowserRouter>/<Routes>
 * pattern, where `useMatches` throws at runtime.
 */
const ROUTE_TITLES: { prefix: string; title: string }[] = [
  { prefix: "/app/analyzer", title: "Resume Analyzer" },
  { prefix: "/app/matcher", title: "Job Matcher" },
  { prefix: "/app/career-ai", title: "Career AI" },
  { prefix: "/app/history", title: "History" },
  { prefix: "/app/settings", title: "Settings" },
  { prefix: "/app", title: "Dashboard" },
];

function titleForPath(pathname: string): string {
  const match = ROUTE_TITLES.find((r) => pathname.startsWith(r.prefix));
  return match?.title ?? "Dashboard";
}

export default function AppLayout() {
  const location = useLocation();
  const title = titleForPath(location.pathname);

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
