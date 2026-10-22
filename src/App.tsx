/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { OrderProvider, useOrder } from './context/OrderContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTracker } from './components/OrderTracker';
import { LuluConciergeChat } from './components/LuluConciergeChat';
import { Footer } from './components/Footer';
import { LegalModal } from './components/LegalModal';
import { KitchenStoryPage } from './components/KitchenStoryPage';
import { Flame, ShieldCheck, ChefHat } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    customizingItem,
    setCustomizingItem,
    orderConfirmationModal,
    setOrderConfirmationModal,
    setIsChatOpen,
    legalModalState,
    closeLegalModal,
  } = useOrder();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900 selection:bg-amber-200 selection:text-amber-900">
      <Navbar />

      <main className="flex-1">
        {currentView === 'menu' && (
          <>
            <Hero />
            <MenuSection />

            {/* Authentic Heritage & Craftsmanship Section */}
            <section id="story-section" className="py-16 bg-stone-900 text-stone-100 overflow-hidden relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  {/* Left Column: Visual Collage */}
                  <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-800 aspect-[4/3]">
                      <img
                        src="/assets/images/banku_wings_real_1792537777301.jpg"
                        alt="Authentic Ghanaian Banku with wings"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-800 aspect-[4/3] mt-6">
                      <img
                        src="/assets/images/suya_skewer_real_1792537797687.jpg"
                        alt="Char-grilled spicy beef suya skewers street style"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Right Column: Culinary Philosophy & Anti-Scam Innovation */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      <span>Our Culinary Standard</span>
                      <span aria-hidden="true">·</span>
                      <span>Zero Shortcuts</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
                      From Lulu's Mukase to your dining table.
                    </h2>

                    <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                      In the Akan language of Ghana, <em>Mukase</em> is where family gathers—the kitchen where whole ginger, scotch bonnet peppers, cloves, and tomatoes simmer together until the aroma fills the compound.
                    </p>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-display">6-Hour Slow-Cooked Shito</h4>
                          <p className="text-xs text-stone-400">Dried coastal shrimp, smoked fish, and fiery peppers caramelized into deep black gold.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white font-display">Fraud-Proof Direct Checkout</h4>
                          <p className="text-xs text-stone-400">Order via WhatsApp or iMessage. Unique transaction reference IDs eliminate payment scam confusion.</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          const menuEl = document.getElementById('menu-section');
                          menuEl?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Order Today’s Batch
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView('story');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="px-5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Our Kitchen Story</span>
                      </button>

                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Ask Lulu Concierge
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            </section>
          </>
        )}

        {currentView === 'story' && <KitchenStoryPage />}

        {currentView === 'track' && <OrderTracker />}
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />

      {customizingItem && (
        <ItemCustomizeModal
          item={customizingItem}
          onClose={() => setCustomizingItem(null)}
        />
      )}

      {orderConfirmationModal && (
        <OrderConfirmationModal
          order={orderConfirmationModal}
          onClose={() => setOrderConfirmationModal(null)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      <LegalModal
        isOpen={legalModalState.isOpen}
        initialTab={legalModalState.tab}
        onClose={closeLegalModal}
      />

      {/* Interactive Concierge Chatbot */}
      <LuluConciergeChat />
    </div>
  );
};

export default function App() {
  return (
    <OrderProvider>
      <AppContent />
    </OrderProvider>
  );
}
