/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DotsBackground } from './components/DotsBackground';
import { SteamPotIcon } from './components/SteamPotIcon';
import { MukaseCard } from './components/MukaseCard';
import { KitchenPass } from './components/KitchenPass';
import { HealthModal } from './components/HealthModal';
import { OrdersApiModal } from './components/OrdersApiModal';
import { INITIAL_ORDERS, KitchenOrder } from './mukaseData';
import { Clock, Wifi, Utensils, Check, Flame, HeartHandshake } from 'lucide-react';

export default function App() {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_ORDERS);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isApiOpen, setIsApiOpen] = useState(false);
  const [latencyMs, setLatencyMs] = useState(1.4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Ping engine
  const handlePing = () => {
    const newLatency = Math.round((0.9 + Math.random() * 1.2) * 10) / 10;
    setLatencyMs(newLatency);
    showToast(`Storefront ⇄ Kitchen handshake verified in ${newLatency}ms`);
  };

  // Advance order status on the kitchen pass
  const handleUpdateOrderStatus = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          if (ord.status === 'cooking') {
            showToast(`Ticket ${ord.ticketNumber} plated & ready on the pass!`);
            return { ...ord, status: 'ready' };
          }
          if (ord.status === 'ready') {
            showToast(`Ticket ${ord.ticketNumber} dispatched to customer / rider!`);
            return { ...ord, status: 'dispatched' };
          }
        }
        return ord;
      })
    );
  };

  // Simulate new incoming order from Storefront
  const handleSimulateOrder = () => {
    const dishPresets = [
      {
        name: 'Smoky Waakye Supreme',
        station: 'Pots' as const,
        notes: 'With shito, gari, boiled egg & tender beef wele',
      },
      {
        name: 'Crispy Grilled Suya Chops',
        station: 'Grill' as const,
        notes: 'Spiced with crushed kuli-kuli yaji pepper',
      },
      {
        name: 'Hot Kelewele & Roasted Peanuts',
        station: 'Fryer' as const,
        notes: 'Ripe golden plantains, extra ginger glaze',
      },
      {
        name: 'Slow Simmered Groundnut Soup & Rice Balls',
        station: 'Pots' as const,
        notes: 'Savory roasted peanut broth with tender chicken',
      },
    ];

    const randomDish = dishPresets[Math.floor(Math.random() * dishPresets.length)];
    const names = ['Esi Mensah', 'Kwame Asante', 'Nana Yaa', 'Akosua Darko', 'Fiifi Quaye'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const ticketNum = `#${1046 + Math.floor(Math.random() * 200)}`;

    const newOrder: KitchenOrder = {
      id: `ord-${Date.now()}`,
      ticketNumber: ticketNum,
      customerName: randomName,
      orderType: Math.random() > 0.5 ? 'Delivery' : 'Dine-In',
      tableOrAddress: Math.random() > 0.5 ? 'East Legon, House 12' : 'Table 7 · Garden Terrace',
      createdAt: 'Just now',
      items: [
        {
          name: randomDish.name,
          quantity: 1,
          notes: randomDish.notes,
          station: randomDish.station,
        },
      ],
      totalPrice: `₵${(85 + Math.floor(Math.random() * 95)).toFixed(2)}`,
      status: 'cooking',
      spiceLevel: Math.random() > 0.5 ? 'Hot' : 'Medium',
    };

    setOrders((prev) => [newOrder, ...prev]);
    showToast(`🔔 New order ${ticketNum} synced from Storefront! Sent to ${randomDish.station} station.`);
  };

  const activeCount = orders.filter((o) => o.status !== 'dispatched').length;

  return (
    <div className="relative min-h-screen bg-[#fbfbf9] text-stone-900 font-sans selection:bg-orange-500/20 selection:text-orange-900">
      
      {/* Framer-inspired interactive Dots Background with gentle wave movement */}
      <DotsBackground
        gap={26}
        dotSize={1.65}
        baseColor="rgba(120, 113, 108, 0.20)"
        activeColor="rgba(234, 88, 12, 0.70)"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-stone-900 text-white px-4 py-3 text-xs font-medium shadow-2xl border border-stone-800 animate-fade-in">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        
        {/* Top Masthead */}
        <header className="w-full border-b border-stone-200/80 bg-white/70 backdrop-blur-md sticky top-0 z-30">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            
            {/* Brand Title */}
            <div className="flex items-center gap-3">
              <SteamPotIcon size={34} />
              <div>
                <span className="text-base font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  <span className="font-serif-display text-xl text-orange-600 italic">Mukase</span>
                  <span>Sync Engine</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-stone-400">
                  The Kitchen &amp; Storefront Real-Time Bridge
                </span>
              </div>
            </div>

            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex items-center gap-3 text-xs font-mono text-stone-500">
              <div className="hidden md:flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-700 font-medium">Bridge Online</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>0.0.0.0:3000</span>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span>Node 22 LTS</span>
              </div>

              <div className="flex items-center gap-1 text-stone-600 bg-stone-100/90 px-2.5 py-1 rounded-lg">
                <Clock className="h-3.5 w-3.5 text-stone-400" />
                <span>{currentTime}</span>
              </div>
            </div>

          </div>
        </header>

        {/* Hero & Centerpiece Section */}
        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-14 space-y-12">
          
          {/* Centerpiece: The Elevated Mukase Card */}
          <MukaseCard
            onOpenHealth={() => setIsHealthOpen(true)}
            onOpenApi={() => setIsApiOpen(true)}
            onSimulateOrder={handleSimulateOrder}
            activeOrderCount={activeCount}
            latencyMs={latencyMs}
          />

          {/* Kitchen Station Stations Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="rounded-xl bg-white border border-stone-200/90 p-3.5 text-center shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
              <div className="text-[10px] font-mono uppercase text-stone-400 font-semibold mb-1">
                Grill &amp; Suya Line
              </div>
              <div className="text-sm font-bold text-stone-800 flex items-center justify-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-600" />
                <span>2 Sizzling</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-stone-200/90 p-3.5 text-center shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
              <div className="text-[10px] font-mono uppercase text-stone-400 font-semibold mb-1">
                Pots &amp; Simmer
              </div>
              <div className="text-sm font-bold text-stone-800 flex items-center justify-center gap-1">
                <Utensils className="h-3.5 w-3.5 text-amber-600" />
                <span>3 Pots Boiling</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-stone-200/90 p-3.5 text-center shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
              <div className="text-[10px] font-mono uppercase text-stone-400 font-semibold mb-1">
                The Plating Pass
              </div>
              <div className="text-sm font-bold text-stone-800 flex items-center justify-center gap-1">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>1 Ready for Rider</span>
              </div>
            </div>

            <div className="rounded-xl bg-white border border-stone-200/90 p-3.5 text-center shadow-[0_2px_8px_rgb(0,0,0,0.02)]">
              <div className="text-[10px] font-mono uppercase text-stone-400 font-semibold mb-1">
                Sync Latency
              </div>
              <div className="text-sm font-bold font-mono text-emerald-700 flex items-center justify-center gap-1">
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span>{latencyMs.toFixed(1)}ms</span>
              </div>
            </div>
          </div>

          {/* Real-Time Kitchen Pass Tickets Board */}
          <KitchenPass
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
            onSimulateOrder={handleSimulateOrder}
          />

        </main>

        {/* Human, Warm Footer */}
        <footer className="w-full border-t border-stone-200/80 bg-white/80 py-8 text-xs text-stone-500">
          <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-lg text-stone-800 italic">Mukase</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-600">The Kitchen Sync Engine</span>
              <span className="text-stone-400">·</span>
              <span>Authentic Culinary Hospitality</span>
            </div>

            <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
              <span>Storefront Handshake 100%</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Zero Lost Orders</span>
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>Made with care</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Health Status Modal */}
      <HealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
        latencyMs={latencyMs}
        onPing={handlePing}
      />

      {/* Active Orders API Modal */}
      <OrdersApiModal
        isOpen={isApiOpen}
        onClose={() => setIsApiOpen(false)}
        orders={orders}
      />

    </div>
  );
}
