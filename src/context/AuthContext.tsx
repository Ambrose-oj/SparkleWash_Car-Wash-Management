import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  // Token lives in memory only — not localStorage.
  // Survives re-renders but clears on tab close (intentional for security).
  const [state, setState] = useState<AuthState>({ user: null, token: null });

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const body = await res.json();

    if (!res.ok) {
      throw new Error(body.message || 'Login failed');
    }

    setState({ user: body.data.user, token: body.data.token });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, token: null });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        isAuthenticated: state.token !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
