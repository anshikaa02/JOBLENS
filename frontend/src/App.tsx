import { Routes, Route } from "react-router-dom";
import { Sparkles, History, Settings } from "lucide-react";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import JobMatcher from "@/pages/JobMatcher";
import ComingSoon from "@/pages/ComingSoon";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="analyzer" element={<ResumeAnalyzer />} />
        <Route path="matcher" element={<JobMatcher />} />
        <Route
          path="career-ai"
          element={
            <ComingSoon
              icon={Sparkles}
              title="Career AI"
              description="AI-generated resume improvements, cover letters, and interview questions, powered by Gemini."
              phase="Phase 8"
            />
          }
        />
        <Route
          path="history"
          element={
            <ComingSoon
              icon={History}
              title="History"
              description="Every resume you've analyzed and every job you've matched against, in one place."
              phase="Phase 10"
            />
          }
        />
        <Route
          path="settings"
          element={
            <ComingSoon
              icon={Settings}
              title="Settings"
              description="Manage your profile, notification preferences, and account details."
              phase="Phase 11"
            />
          }
        />
      </Route>
    </Routes>
  );
}
