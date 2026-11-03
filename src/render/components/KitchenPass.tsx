import React from 'react';
import { Clock, UtensilsCrossed, Flame, CheckCircle, Bike, MapPin, ChefHat, Sparkles } from 'lucide-react';
import { KitchenOrder } from '../mukaseData';

interface KitchenPassProps {
  orders: KitchenOrder[];
  onUpdateStatus: (id: string) => void;
  onSimulateOrder: () => void;
}

export const KitchenPass: React.FC<KitchenPassProps> = ({
  orders,
  onUpdateStatus,
  onSimulateOrder,
}) => {
  return (
    <section className="mx-auto max-w-5xl w-full mt-10">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-orange-600" />
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Live Kitchen Pass & Order Dispatch Line
            </h2>
            <span className="text-xs font-mono text-stone-500">
              ({orders.filter((o) => o.status !== 'dispatched').length} Active Tickets)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time bi-directional pipeline: Kitchen terminal updates broadcast instantly back to customer order status.
          </p>
        </div>

        <button
          onClick={onSimulateOrder}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5 text-orange-400" />
          <span>Simulate Storefront Order</span>
        </button>
      </div>

      {/* Ticket Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => {
          let statusBadge = (
            <span className="text-amber-800 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded text-[11px] font-mono">
              In Prep & Cooking
            </span>
          );
          if (order.status === 'ready') {
            statusBadge = (
              <span className="text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded text-[11px] font-mono">
                Plated · Ready on Pass
              </span>
            );
          } else if (order.status === 'dispatched') {
            statusBadge = (
              <span className="text-stone-500 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded text-[11px] font-mono">
                Dispatched · Handed Over
              </span>
            );
          }

          return (
            <div
              key={order.id}
              className={`rounded-xl bg-white border p-5 transition-all shadow-[0_2px_12px_rgb(0,0,0,0.03)] hover:shadow-md ${
                order.status === 'ready'
                  ? 'border-emerald-300/80 ring-1 ring-emerald-400/30'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              {/* Ticket Top bar */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                    {order.ticketNumber}
                  </span>
                  <span className="text-xs font-semibold text-stone-800">
                    {order.customerName}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3 text-stone-400" />
                    {order.createdAt}
                  </span>
                </div>
                {statusBadge}
              </div>

              {/* Order Meta details */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-3 font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" />
                  {order.tableOrAddress} ({order.orderType})
                </span>
                <span className="text-orange-700 font-medium">
                  Spice: {order.spiceLevel}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2 mb-4 bg-stone-50/70 rounded-lg p-3 border border-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs">
                    <div>
                      <span className="font-semibold text-stone-900 font-mono mr-1.5">
                        {item.quantity}x
                      </span>
                      <span className="text-stone-800 font-medium">{item.name}</span>
                      {item.notes && (
                        <span className="block text-[11px] text-stone-500 italic mt-0.5">
                          "{item.notes}"
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white border border-stone-200 text-stone-600 shrink-0 ml-2">
                      {item.station} Station
                    </span>
                  </div>
                ))}
              </div>

              {/* Ticket Action Bottom */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                <span className="font-mono font-bold text-stone-900">
                  Total: {order.totalPrice}
                </span>

                {order.status === 'cooking' && (
                  <button
                    onClick={() => onUpdateStatus(order.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <UtensilsCrossed className="h-3.5 w-3.5" />
                    <span>Mark as Plated on Pass</span>
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => onUpdateStatus(order.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-colors shadow-sm cursor-pointer"
                  >
                    <Bike className="h-3.5 w-3.5" />
                    <span>Dispatch to Rider / Guest</span>
                  </button>
                )}

                {order.status === 'dispatched' && (
                  <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    Completed & Synced
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
