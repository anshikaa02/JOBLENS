import { Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/components/layout/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* Authenticated app shell — real auth guard arrives in Phase 4 */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Dashboard />} handle={{ title: "Dashboard" }} />
      </Route>
    </Routes>
  );
}
