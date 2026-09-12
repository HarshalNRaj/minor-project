import { useEffect, useState } from "react";
import { Package, UtensilsCrossed } from "lucide-react";
import BackButton from "../components/BackButton";
import StatusBadge from "../components/StatusBadge";
import { Card, EmptyState } from "../components/ui";
import { orders } from "../api/endpoints";

export default function OrdersPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([orders.requestedResources(), orders.requestedFood()])
      .then(([resourcesResponse, foodResponse]) => {
        const resources = resourcesResponse.data.results || resourcesResponse.data;
        const food = foodResponse.data.results || foodResponse.data;
        setItems([
          ...resources.map((item) => ({ ...item, kind: "Resource", icon: Package })),
          ...food.map((item) => ({ ...item, kind: "Food", icon: UtensilsCrossed })),
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <BackButton />
      <div className="mt-5 flex items-end justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary-500">Order tracking</p>
          <h1 className="mt-2 font-serif text-3xl font-medium text-ink">My orders</h1>
        </div>
        <span className="font-mono text-xs text-ink-muted">{items.length} active</span>
      </div>

      {loading ? (
        <p className="mt-6 text-sm font-mono text-ink-muted">Loading your requests…</p>
      ) : items.length === 0 ? (
        <div className="mt-6"><EmptyState title="No requests yet" body="Request an available resource or food listing and it will appear here." /></div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={`${item.kind}-${item.id}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="rounded-md bg-primary-50 p-2 text-primary-500"><Icon size={18} /></span>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">{item.kind}</p>
                      <h2 className="font-serif text-xl text-ink">{item.title}</h2>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-4 text-sm text-ink-soft">{item.description || "Your request is being coordinated."}</p>
                <div className="mt-4 border-t border-line pt-3 font-mono text-[11px] text-ink-muted">
                  <p>Provider: {item.owner_username || item.provider_username || "—"}</p>
                  {(item.owner_phone || item.provider_phone) && (
                    <p>Contact: {item.owner_phone || item.provider_phone}</p>
                  )}
                  {item.address_text && <p>Pickup: {item.address_text}</p>}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
