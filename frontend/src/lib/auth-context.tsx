import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

const STORAGE_KEY = "joblens_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * REAL AUTH — Phase 9.
 *
 * Replaces the Phase 4 mock (unsigned localStorage token, no server
 * verification). login()/signup() now call the real FastAPI backend
 * (POST /api/auth/login, /api/auth/signup), which returns a real
 * server-signed JWT. On mount, instead of blindly trusting whatever is in
 * localStorage, this calls GET /api/auth/me to confirm the token is still
 * valid server-side — a token could have expired, or the backend could
 * have restarted with a different JWT_SECRET, invalidating old tokens.
 *
 * Every component using useAuth() is completely unchanged from Phase 4 —
 * this is the "swap the implementation, keep the interface" idea
 * mentioned back when the mock was built.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setIsLoading(false);
      return;
    }

    let storedToken: string;
    try {
      storedToken = (JSON.parse(raw) as { token: string }).token;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setIsLoading(false);
      return;
    }

    api
      .get<AuthUser>("/auth/me")
      .then((res) => {
        setUser(res.data);
        setToken(storedToken);
      })
      .catch(() => {
        // Token rejected server-side (expired, or backend restarted with a
        // new secret) — clear it rather than keep showing a "logged in"
        // state the backend disagrees with.
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function persist(response: TokenResponse) {
    setUser(response.user);
    setToken(response.access_token);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: response.access_token }));
  }

  async function login(email: string, password: string) {
    const response = await api.post<TokenResponse>("/auth/login", { email, password });
    persist(response.data);
  }

  async function signup(name: string, email: string, password: string) {
    const response = await api.post<TokenResponse>("/auth/signup", { name, email, password });
    persist(response.data);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
