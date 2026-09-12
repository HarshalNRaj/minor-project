import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { FieldLabel, PasswordInput, TextInput } from "../components/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitingForServer, setWaitingForServer] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const waitTimer = window.setTimeout(() => setWaitingForServer(true), 2000);
    try {
      await login(form.username, form.password);
      navigate("/app");
    } catch (err) {
      setError(err.code === "ECONNABORTED"
        ? "The server is waking up. Please try again in a moment."
        : err.response?.data?.detail || "Couldn't sign in. Check your username and password.");
    } finally {
      window.clearTimeout(waitTimer);
      setWaitingForServer(false);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2 mb-3">
            <span className="font-serif text-3xl font-semibold tracking-tight text-ink lowercase">
              resqlink
            </span>
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#6B1F1F]">
            Member Authentication
          </span>
          <h1 className="mt-2 font-serif text-3xl font-medium text-ink">Welcome back</h1>
          <p className="mt-1 text-sm font-serif text-ink-muted">Sign in to your mutual aid console.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-line bg-surface p-7 shadow-[0_4px_20px_rgba(26,20,16,0.05)]">
          {error && (
            <div className="rounded-md bg-urgent-50 border border-urgent-100 px-3 py-2 text-xs font-mono text-urgent-500">{error}</div>
          )}
          <div>
            <FieldLabel>Username</FieldLabel>
            <TextInput
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <PasswordInput
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-mono text-xs uppercase tracking-[0.2em] py-2.5">
            {loading ? "Signing in…" : "Sign in →"}
          </Button>
          {waitingForServer && (
            <p className="text-center text-[11px] font-mono text-ink-muted">
              Connecting to the community server…
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-xs font-mono text-ink-soft">
          New to ResQLink?{" "}
          <Link to="/register" className="font-medium text-[#2C3A2C] underline hover:text-[#6B1F1F]">
            Register as neighbor or organization
          </Link>
        </p>

        <div className="mt-6 rounded-xl border border-line bg-surface-soft/60 p-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-muted mb-2.5">Quick Sign-in (Demo Roles):</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {[
              { label: "Admin", user: "admin" },
              { label: "Donor (Asha)", user: "asha_donor" },
              { label: "Volunteer (Ravi)", user: "ravi_volunteer" },
              { label: "NGO (Hope)", user: "hope_ngo" },
              { label: "Blood Bank", user: "citycare_bloodbank" },
              { label: "Neighbor (Meera)", user: "meera" },
            ].map(({ label, user }) => (
              <button
                key={user}
                type="button"
                onClick={() => setForm({ username: user, password: "password123" })}
                className="rounded border border-line bg-surface px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft hover:border-[#2C3A2C] hover:text-[#2C3A2C] transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-2.5 font-mono text-[10px] text-ink-muted/80">Demo Password: password123</p>
        </div>
      </div>
    </div>
  );
}
