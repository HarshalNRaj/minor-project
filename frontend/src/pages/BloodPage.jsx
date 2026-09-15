import { useEffect, useState } from "react";
import { blood } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";
import { Card, EmptyState, FieldLabel, Select, TextArea, TextInput } from "../components/ui";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import UrgencyBadge from "../components/UrgencyBadge";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const DEFAULT_FORM = { blood_group: "", units_needed: 1, urgency: "medium", hospital_name: "", address_text: "", notes: "" };

export default function BloodPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await blood.list();
      setItems(data.results || data);
      setError("");
    } catch {
      setError("Blood requests could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await blood.create(form);
      setForm(DEFAULT_FORM);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.detail || "The blood request could not be posted.");
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
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Blood coordination</h1>
          <p className="mt-1 text-sm text-ink-soft">Find, request, and fulfill blood units for patients in need.</p>
        </div>
        {["receiver", "general", "admin"].includes(user?.role) && (
          <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancel" : "+ New request"}</Button>
        )}
      </div>

      {error && (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-urgent-500/30 bg-urgent-50 px-4 py-3 text-sm text-urgent-600">
          <span>{error}</span>
          <button type="button" className="font-semibold underline" onClick={load}>Retry</button>
        </div>
      )}

      {showForm && (
        <Card className="mt-4">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Blood group</FieldLabel>
              <Select value={form.blood_group} onChange={(e) => setForm({ ...form, blood_group: e.target.value })} required>
                <option value="" disabled>Select…</option>
                {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel>Units needed</FieldLabel>
              <TextInput type="number" min="1" value={form.units_needed} onChange={(e) => setForm({ ...form, units_needed: e.target.value })} required />
            </div>
            <div>
              <FieldLabel>Urgency</FieldLabel>
              <Select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Select>
            </div>
            <div>
              <FieldLabel>Hospital name</FieldLabel>
              <TextInput value={form.hospital_name} onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Location</FieldLabel>
              <TextInput value={form.address_text} onChange={(e) => setForm({ ...form, address_text: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Notes</FieldLabel>
              <TextArea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Post request</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : items.length === 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <EmptyState title="No open blood requests" body="When someone posts a request, it'll show up here." />
          </div>
        ) : (
          items.map((r, index) => {
            const isRequester = r.requester === user.id;
            const isDonor = user.role === "donor";
            const isBloodBankUser = user.role === "blood_bank";
            return (
              <Card key={r.id} className="animate-rise-in" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-bold text-primary-700">{r.blood_group}</h3>
                  <div className="flex flex-col items-end gap-1.5">
                    <StatusBadge status={r.status} />
                    <UrgencyBadge urgency={r.urgency} />
                  </div>
                </div>
                <p className="mt-1.5 text-sm text-ink">{r.units_needed} unit(s) · {r.hospital_name}</p>
                {r.address_text && <p className="text-xs text-ink-soft">{r.address_text}</p>}
                {r.notes && <p className="mt-1.5 text-sm text-ink-soft">{r.notes}</p>}
                <p className="mt-2 text-xs text-ink-soft">Requested by {r.requester_username}</p>
                {r.matched_donor_username && <p className="text-xs text-ink-soft">Matched donor: {r.matched_donor_username}</p>}
                {r.matched_blood_bank_name && <p className="text-xs text-ink-soft">Matched bank: {r.matched_blood_bank_name}</p>}

                <div className="mt-3 flex flex-wrap gap-2">
                  {r.status === "open" && isDonor && (
                    <Button variant="outline" disabled={busyId === r.id} onClick={() => act(blood.offerToDonate, r.id)}>
                      Offer to donate
                    </Button>
                  )}
                  {r.status === "open" && isBloodBankUser && (
                    <Button variant="outline" disabled={busyId === r.id} onClick={() => act(blood.matchBloodBank, r.id)}>
                      Commit units
                    </Button>
                  )}
                  {r.status === "matched" && isRequester && (
                    <Button disabled={busyId === r.id} onClick={() => act(blood.fulfill, r.id)}>
                      Mark fulfilled
                    </Button>
                  )}
                  {isRequester && r.status !== "fulfilled" && r.status !== "cancelled" && (
                    <Button variant="ghost" disabled={busyId === r.id} onClick={() => act(blood.cancel, r.id)}>
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
