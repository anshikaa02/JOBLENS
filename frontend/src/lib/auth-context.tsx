import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
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

const STORAGE_KEY = "joblens_auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * MOCK AUTH — Phase 4 scaffolding only.
 *
 * There's no backend yet (that's Phase 9), so login/signup here just
 * validate input, fabricate a token, and persist to localStorage. There is
 * NO real password checking against a database and NO cryptographic
 * signing — anyone can open devtools and forge this token. Do not treat
 * this as secure; it exists so the UI, routing, and protected-route logic
 * can be built and tested end to end.
 *
 * When Phase 9 lands: replace the bodies of login()/signup() below with
 * real `axios.post('/api/auth/login', ...)` calls that return a real
 * server-signed JWT, and delete the `fabricateToken` helper. Every
 * component that calls useAuth() stays exactly the same.
 */
function fabricateToken(email: string): string {
  const payload = { email, iat: Date.now() };
  return `mock.${btoa(JSON.stringify(payload))}.unsigned`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  function persist(nextUser: AuthUser, nextToken: string) {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: nextUser, token: nextToken }));
  }

  async function login(email: string, password: string) {
    if (!password) throw new Error("Password is required");
    await new Promise((r) => setTimeout(r, 500)); // simulate network latency
    const nextUser: AuthUser = { name: email.split("@")[0], email };
    persist(nextUser, fabricateToken(email));
  }

  async function signup(name: string, email: string, password: string) {
    if (!password) throw new Error("Password is required");
    await new Promise((r) => setTimeout(r, 500));
    const nextUser: AuthUser = { name, email };
    persist(nextUser, fabricateToken(email));
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
