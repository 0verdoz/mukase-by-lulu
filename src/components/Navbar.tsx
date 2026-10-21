import React, { useState } from 'react';
import { ShoppingBag, ChefHat, MessageSquare, Menu, X, BookOpen, Clock, Utensils } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const Navbar: React.FC = () => {
  const { cartCount, cartTotal, setIsCartOpen, currentView, setCurrentView, setIsChatOpen } = useOrder();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigateTo = (view: 'menu' | 'story' | 'track') => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#faf8f5]/90 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 py-3.5">
        
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigateTo('menu')}
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

        {/* Zone 2: Desktop clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={() => navigateTo('menu')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              currentView === 'menu' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : ''
            }`}
          >
            Kitchen Menu
          </button>
          <button
            type="button"
            onClick={() => navigateTo('story')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 pb-0.5 ${
              currentView === 'story' ? 'text-amber-700 font-semibold border-b-2 border-amber-600' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Our Kitchen Story
          </button>
          <button
            onClick={() => navigateTo('track')}
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
        </nav>

        {/* Zone 3: Actions (Order Bag & Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all rounded-xl shadow-sm shadow-amber-600/25 whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Order Bag</span>
            <span className="bg-amber-700/80 px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-bold tabular-nums">
              {cartCount}
              {cartTotal > 0 && <span className="hidden xs:inline"> · ${cartTotal.toFixed(2)}</span>}
            </span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-stone-700 hover:text-stone-900 hover:bg-stone-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f5] border-b border-stone-200/90 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => navigateTo('menu')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              currentView === 'menu' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Utensils className="w-4 h-4 text-amber-600" />
            <span>Kitchen Menu</span>
          </button>

          <button
            onClick={() => navigateTo('story')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              currentView === 'story' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-600" />
            <span>Our Kitchen Story</span>
          </button>

          <button
            onClick={() => navigateTo('track')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              currentView === 'track' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Live Order Tracker</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsChatOpen(true);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100 transition-colors text-left"
          >
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <span>Lulu Concierge AI</span>
          </button>
        </div>
      )}
    </header>
  );
};

