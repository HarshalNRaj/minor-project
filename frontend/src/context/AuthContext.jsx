import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { auth as authApi } from "../api/endpoints";

const AuthContext = createContext(null);

function applyRoleAlias(user) {
  if (!user?.username) return user;
  const alias = localStorage.getItem(`resqlink_role_alias:${user.username}`);
  if (alias && user.role === "general") return { ...user, role: alias };
  return user.role === "general" ? { ...user, role: "receiver" } : user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("resqlink_user");
    return raw ? applyRoleAlias(JSON.parse(raw)) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("resqlink_access");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(({ data }) => {
        const resolvedUser = applyRoleAlias(data);
        setUser(resolvedUser);
        localStorage.setItem("resqlink_user", JSON.stringify(resolvedUser));
      })
      .catch(() => {
        localStorage.removeItem("resqlink_access");
        localStorage.removeItem("resqlink_refresh");
        localStorage.removeItem("resqlink_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const normalizedUsername = username.trim().toLowerCase();
    const { data } = await authApi.login(normalizedUsername, password);
    const resolvedUser = applyRoleAlias(data.user);
    localStorage.setItem("resqlink_access", data.access);
    localStorage.setItem("resqlink_refresh", data.refresh);
    localStorage.setItem("resqlink_user", JSON.stringify(resolvedUser));
    setUser(resolvedUser);
    return resolvedUser;
  };

  const register = async (payload) => {
    try {
      const normalizedPayload = {
        ...payload,
        username: payload.username.trim().toLowerCase(),
      };
      const apiPayload = payload.role === "receiver"
        ? { ...normalizedPayload, role: "general" }
        : normalizedPayload;
      const { data } = await authApi.register(apiPayload);
      if (payload.role === "receiver") {
        localStorage.setItem(`resqlink_role_alias:${normalizedPayload.username}`, "receiver");
      }
      return data;
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        throw new Error("The server took too long to respond. Please try again in a moment.");
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("resqlink_access");
    localStorage.removeItem("resqlink_refresh");
    localStorage.removeItem("resqlink_user");
    setUser(null);
  };

  const refreshProfile = useCallback(async () => {
    const { data } = await authApi.me();
    const resolvedUser = applyRoleAlias(data);
    setUser(resolvedUser);
    localStorage.setItem("resqlink_user", JSON.stringify(resolvedUser));
    return resolvedUser;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile, refreshUser: refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
