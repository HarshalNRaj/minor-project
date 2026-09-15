import { useEffect, useState } from "react";
import { Card, EmptyState, FieldLabel, Select, TextArea, TextInput } from "./ui";
import Button from "./Button";
import StatusBadge from "./StatusBadge";
import { useAuth } from "../context/AuthContext";

/**
 * One generic page for any module that follows available -> requested ->
 * assigned -> completed (Resources, Food). Pass in the api object and
 * field config; behavior/actions are identical across both modules.
 */
export default function LifecycleListingPage({ title, api, ownerField, fields, createDefaults, canCreate = true, canRequest = true, canAssign = false }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(createDefaults);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    api.list()
      .then(({ data }) => setItems(data.results || data))
      .catch((err) => setError(err.response?.data?.detail || "Couldn't load listings. Please try again."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) payload.append(key, value);
      });
      await api.create(payload);
      setForm(createDefaults);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create the listing. Please check the form and try again.");
    }
  };

  const act = async (fn, id) => {
    setBusyId(id);
    try {
      await fn(id);
      load();
    } catch (err) {
      alert(err.response?.data?.detail || "That action isn't available right now.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {canCreate && <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "+ New listing"}</Button>}
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-urgent-500/20 bg-urgent-50 px-4 py-3 text-sm text-urgent-600">
          <span>{error}</span>
          <button type="button" onClick={load} className="font-semibold underline">Retry</button>
        </div>
      )}

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
                <FieldLabel>{f.label}</FieldLabel>
                {f.type === "select" ? (
                  <Select
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.required}
                  >
                    <option value="" disabled>Select…</option>
                    {f.options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </Select>
                ) : f.type === "textarea" ? (
                  <TextArea
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.required}
                    rows={3}
                  />
                ) : (
                  <TextInput
                    type={f.type || "text"}
                    value={form[f.name] ?? ""}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    required={f.required}
                  />
                )}
              </div>
            ))}
            <div className="sm:col-span-2">
              <FieldLabel>Photo (optional)</FieldLabel>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || "" })}
                className="block w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-primary-700"
              />
              <p className="mt-1 text-xs text-ink-soft">Add a clear photo so receivers know what to expect.</p>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Post listing</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="sm:col-span-2 lg:col-span-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((placeholder) => (
              <div key={placeholder} className="h-40 animate-pulse rounded-2xl border border-line bg-surface/70" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title="Nothing here yet" body="Be the first to post — every listing helps someone nearby." />
          </div>
        ) : (
          items.map((it) => {
            const isOwner = it[ownerField] === user.id;
            const isRequester = it.requester === user.id;
            const isVolunteer = it.volunteer === user.id;
            return (
              <Card key={it.id}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-ink">{it.title}</h3>
                  <StatusBadge status={it.status} />
                </div>
                {it.description && <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft">{it.description}</p>}
                {it.photo && <img src={it.photo} alt={it.title} className="mt-3 h-36 w-full rounded-xl object-cover" />}
                <p className="mt-2 text-xs text-ink-soft">
                  Posted by {it[`${ownerField}_username`] || "—"}
                  {it.address_text ? ` · ${it.address_text}` : ""}
                </p>
                {it.contact_phone && <p className="text-xs text-ink-soft">Contact: {it.contact_phone}</p>}
                {it.requester_username && (
                  <p className="mt-1 text-xs text-ink-soft">Requested by {it.requester_username}</p>
                )}
                {it.volunteer_username && (
                  <p className="mt-0.5 text-xs text-ink-soft">Volunteer: {it.volunteer_username}</p>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {canRequest && it.status === "available" && !isOwner && (
                    <Button variant="outline" disabled={busyId === it.id} onClick={() => act(api.requestItem, it.id)}>
                      Request
                    </Button>
                  )}
                  {canAssign && it.status === "requested" && !isRequester && (
                    <Button variant="outline" disabled={busyId === it.id} onClick={() => act(api.assign, it.id)}>
                      I'll deliver this
                    </Button>
                  )}
                  {it.status === "assigned" && (isOwner || isVolunteer) && (
                    <Button disabled={busyId === it.id} onClick={() => act(api.complete, it.id)}>
                      Mark complete
                    </Button>
                  )}
                  {isOwner && it.status !== "completed" && it.status !== "cancelled" && (
                    <Button variant="ghost" disabled={busyId === it.id} onClick={() => act(api.cancel, it.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
