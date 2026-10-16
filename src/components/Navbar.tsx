import React from 'react';
import { ShoppingBag, Search, Sparkles, ChefHat, ShieldCheck, MapPin, MessageSquare } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const Navbar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen, currentView, setCurrentView, setIsChatOpen } = useOrder();

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('menu')}
            className="group flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-sm shadow-amber-600/20 group-hover:bg-amber-700 transition-colors">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900 font-display whitespace-nowrap">
              Mukase by Lulu
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => setCurrentView('menu')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              currentView === 'menu' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
            }`}
          >
            Kitchen Menu
          </button>
          <button
            onClick={() => setCurrentView('track')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              currentView === 'track' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => setIsChatOpen(true)}
            className="transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Lulu Concierge</span>
          </button>
          <a
            href="#story-section"
            className="transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5"
          >
            Our Kitchen Story
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all rounded-xl shadow-sm shadow-amber-600/25 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Order Bag</span>
            <span className="bg-amber-700/80 px-2 py-0.5 rounded-md text-xs font-bold tabular-nums">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
              {cartTotal > 0 && ` · $${cartTotal.toFixed(2)}`}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
