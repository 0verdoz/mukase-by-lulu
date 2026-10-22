import React from 'react';
import { Flame, ShieldCheck, MessageCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const Hero: React.FC = () => {
  const { setCurrentView, setIsChatOpen } = useOrder();

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-[#faf8f5] via-[#f7f2eb] to-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Brand Story & Call to Actions */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Subtle Text Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <span>Authentic West African Kitchen</span>
              <span aria-hidden="true">·</span>
              <span>Accra to Atlanta</span>
              <span aria-hidden="true">·</span>
              <span>Fresh Daily Batches</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] font-display text-balance">
              The heat of the Ghanaian kitchen, delivered to your door.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              Smoky jollof with goat meat or wings, authentic banku with rich okro soup, pounded fufu with goat light soup, and fried yam with crispy peppered fish. Custom foods and off-menu orders prepared fresh to order.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#menu-section"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-amber-600 hover:bg-amber-700 active:scale-[0.98] transition-all rounded-xl shadow-md shadow-amber-600/20 whitespace-nowrap"
              >
                <span>Browse Kitchen Menu</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setCurrentView('track')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 transition-colors rounded-xl shadow-sm whitespace-nowrap"
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Track Active Order</span>
              </button>

              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-stone-600 hover:text-amber-700 hover:bg-amber-50/60 transition-colors rounded-xl whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Chat with Lulu Bot</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCurrentView('story');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-amber-800 bg-amber-100/70 hover:bg-amber-100 transition-colors rounded-xl whitespace-nowrap"
              >
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Our Kitchen Story</span>
              </button>
            </div>

            {/* Anti-Scam Assurance Note */}
            <div className="pt-2 flex items-center gap-3 text-xs text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Unique Order Code System:</strong> Every order receives a unique memo code to verify Cash App & Zelle payments instantly without fraud.
              </span>
            </div>

          </div>

          {/* Right Column: High Fidelity Hero Platter Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-stone-900/15 border border-stone-200 bg-stone-100 group">
              <img
                src="/assets/images/jollof_goat_real_1792537753380.jpg"
                alt="Mukase by Lulu Authentic West African Smoky Party Jollof with slow-braised goat meat"
                className="w-full h-[360px] sm:h-[440px] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              {/* Photo Caption Strip */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">Today's Star Entree</span>
                    <h2 className="text-xl font-bold font-display">Jollof with Goat Meat</h2>
                    <p className="text-xs text-stone-200">Smoky Ghanaian jollof with tender slow-braised goat meat</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-stone-300 block">From</span>
                    <span className="text-2xl font-bold font-display tabular-nums text-white">$30.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column Proof & Service Strip */}
        <div className="mt-12 pt-8 border-t border-stone-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-stone-700 text-sm">
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block font-display">Authentic Woodsmoke Stew</span>
            <p className="text-xs text-stone-500">Slow-roasted plum tomatoes, scotch bonnet, and traditional spices.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block font-display">Customizable Add-ons</span>
            <p className="text-xs text-stone-500">Add boiled egg, grilled sausage, extra kelewele, or spicy shito.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block font-display">Conversational Direct Checkout</span>
            <p className="text-xs text-stone-500">Seamless transition to WhatsApp, iMessage, or universal SMS.</p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-stone-900 block font-display">Verified Anti-Scam Protection</span>
            <p className="text-xs text-stone-500">Zero duplicate receipts or fake screenshots with unique order IDs.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
