import { ChefHat, ShieldCheck, Phone, MapPin, Clock } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { LULU_PHONE_NUMBER, LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT } from '../utils/checkout';

export const Footer: React.FC = () => {
  const { setCurrentView, openLegalModal } = useOrder();

  return (
    <footer className="bg-stone-900 text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800 text-xs">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold font-display">Mukase by Lulu</span>
            </div>
            <p className="text-stone-400 leading-relaxed">
              "Mukase" means the kitchen. We craft artisanal Ghanaian and West African homestyle dishes using whole spices, woodsmoke notes, and heritage recipes.
            </p>
          </div>

          {/* Service Hours & Kitchen Location */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Kitchen & Dispatch</h4>
            <div className="flex items-start gap-2 text-stone-400">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Midtown Atlanta Cloud Kitchen & Delivery Hub, GA 30308</span>
            </div>
            <div className="flex items-start gap-2 text-stone-400">
              <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Mon – Sun: 11:30 AM – 10:00 PM EST</span>
            </div>
          </div>

          {/* Verified Payment & Anti-Scam */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Anti-Scam Protocol</h4>
            <p className="text-stone-400 leading-relaxed">
              We do not use confusing unverified threads. Orders receive an automated unique memo ID. Transactions are matched against our duplicate-check registry.
            </p>
            <div className="text-stone-400 space-y-0.5">
              <p>Cash App: <strong className="text-white">{LULU_CASHAPP_TAG}</strong></p>
              <p>WhatsApp: <strong className="text-white">+233 {LULU_PHONE_NUMBER}</strong></p>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider">Kitchen & Policies</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="hover:text-white transition-colors"
                >
                  Daily Kitchen Menu
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-white transition-colors"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('story');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 text-stone-400 transition-colors text-left"
                >
                  Our Kitchen Story & Shito
                </button>
              </li>
              <li className="pt-1 border-t border-stone-800/80">
                <button
                  onClick={() => openLegalModal('privacy')}
                  className="hover:text-amber-400 text-stone-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegalModal('terms')}
                  className="hover:text-amber-400 text-stone-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>Terms & Conditions</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Quiet copyright & legal links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-xs">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© {new Date().getFullYear()} Mukase by Lulu. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openLegalModal('privacy')}
                className="hover:text-stone-300 transition-colors underline decoration-stone-700 underline-offset-2"
              >
                Privacy
              </button>
              <span>·</span>
              <button
                onClick={() => openLegalModal('terms')}
                className="hover:text-stone-300 transition-colors underline decoration-stone-700 underline-offset-2"
              >
                Terms of Service
              </button>
            </div>
          </div>
          <p>Hand-crafted Ghanaian Comfort Food · WhatsApp & iMessage Delivery System</p>
        </div>

      </div>
    </footer>
  );
};
