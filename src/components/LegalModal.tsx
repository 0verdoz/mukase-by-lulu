import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, AlertTriangle, Lock, Eye, RefreshCw } from 'lucide-react';
import { LULU_CASHAPP_TAG, LULU_PHONE_NUMBER, LULU_ZELLE_CONTACT } from '../utils/checkout';

interface LegalModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  initialTab = 'privacy',
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'terms'>(initialTab);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-stone-900 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tab switcher */}
        <div className="px-6 py-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
              {activeTab === 'privacy' ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions of Service'}
              </h2>
              <p className="text-xs text-stone-400">
                Mukase by Lulu · Authentic West African Kitchen · Updated October 2026
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle buttons */}
        <div className="flex border-b border-stone-800 bg-stone-900/50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-4 font-medium text-sm border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'terms'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms & Conditions
          </button>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-300 leading-relaxed max-h-[60vh]">
          {activeTab === 'privacy' ? (
            <>
              {/* Privacy Content */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex gap-3">
                <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Summary:</strong> At Mukase by Lulu, your personal details (contact number, address, payment memo) are used strictly to coordinate delicious food preparation, authentic dispatch, and protect against impersonation. We never sell, rent, or distribute your personal data.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  1. Information We Collect
                </h3>
                <p>When you browse or place an order through Mukase by Lulu, we collect:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li><strong>Contact Details:</strong> Your full name, delivery address, suite/apartment number, and mobile telephone number.</li>
                  <li><strong>Order Data:</strong> Selected dishes, protein choices, spice heat level preferences, culinary customizations, and special delivery instructions.</li>
                  <li><strong>Payment Reference Information:</strong> Your sender Cash App username/tag ($cashtag) or Zelle sender confirmation name, and order tracking code (e.g., <code>MUK-XXXX</code>).</li>
                  <li><strong>Communication Logs:</strong> Messages exchanged with Chef Lulu’s kitchen team via WhatsApp, iMessage, or SMS to confirm dispatch and delivery timing.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  2. How Your Information Is Used
                </h3>
                <p>We process your data exclusively for the following operational needs:</p>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li>To cook and assemble your artisanal meals to your exact recipe specifications.</li>
                  <li>To provide direct turn-by-turn courier delivery to your specified location.</li>
                  <li>To send real-time order status updates via WhatsApp or SMS.</li>
                  <li>To generate unique transaction codes that prevent fraudulent impersonation and verify genuine payment confirmations.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  3. Payment Security & Zero Credentials Storage
                </h3>
                <p>
                  Mukase by Lulu operates a conversational checkout model. We <strong>never</strong> ask for, view, collect, or store your bank passwords, debit/credit card CVV numbers, PINs, or sensitive banking credentials.
                </p>
                <p className="text-stone-400">
                  All transactions take place directly on trusted third-party applications (Cash App or Zelle) initiated by you, directed solely to Lulu’s verified business handles (Cash App: <strong className="text-white">{LULU_CASHAPP_TAG}</strong> or Zelle: <strong className="text-white">{LULU_ZELLE_CONTACT}</strong>).
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  4. Anti-Scam & Fraud Prevention Measures
                </h3>
                <p>
                  To combat counterfeit payment screenshots and duplicate receipt recycling, our system checks transaction references against an internal verification ledger. We verify:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li>That the payment memo matches your designated unique Order ID.</li>
                  <li>That the transaction reference has not been previously recorded for a past order.</li>
                  <li>That the transfer timestamp matches the active kitchen dispatch order session.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  5. Data Retention & Deletion
                </h3>
                <p>
                  Delivery records and contact details are archived temporarily for order fulfillment, customer resolution, and internal kitchen recordkeeping. You may request deletion of your saved customer profile by contacting Chef Lulu directly on WhatsApp at <strong>+1 {LULU_PHONE_NUMBER}</strong> or via email.
                </p>
              </section>
            </>
          ) : (
            <>
              {/* Terms Content */}
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex gap-3">
                <FileText className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Notice:</strong> By accessing Mukase by Lulu and submitting an order via WhatsApp, iMessage, or SMS, you agree to these Terms and Conditions governing order verification, custom cook requests, and food delivery.
                </p>
              </div>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  1. Order Placement & Conversational Checkout Flow
                </h3>
                <p>
                  Mukase by Lulu connects food lovers directly with our kitchen. When you assemble items in your cart and tap <em>"Send Order via WhatsApp / iMessage"</em>, a unique Order ID (e.g., <code>MUK-XXXX</code>) is generated.
                </p>
                <p className="text-stone-400">
                  The pre-formatted order summary must be sent into the message thread without modifying the items or total. The kitchen staff receives, timestamps, and confirms your ticket immediately upon message arrival.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  2. Pricing, Customizations & Off-Menu Requests
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li>All menu prices are displayed clearly in USD ($).</li>
                  <li><strong>Custom Chef Requests:</strong> Customizable items (such as Egusi Soup, Efo Riro, and Chef Lulu Off-Menu Requests) start at $28.00 and increase based on selected protein upgrades and additional sides.</li>
                  <li>Any extra ingredients, swallow additions, or specialty packaging requested outside standard recipes will incur stated add-on charges.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  3. Payment Verification & Fraud Prevention Policy
                </h3>
                <p>
                  To protect our independent kitchen from payment scams, <strong>food preparation begins only after receipt and verification of full payment</strong> via Cash App (<code className="text-amber-400">{LULU_CASHAPP_TAG}</code>) or Zelle (<code className="text-amber-400">{LULU_ZELLE_CONTACT}</code>).
                </p>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li><strong>Mandatory Memo:</strong> You must enter your unique Order Code (e.g. <code>MUK-XXXX</code>) in your payment transfer note.</li>
                  <li><strong>Anti-Fraud Verification:</strong> Submitting forged payment confirmation screenshots, altered transaction IDs, or recycling payment proofs from previous dates will result in immediate cancellation, blacklisting, and refusal of service.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  4. Delivery Window & Customer Responsibilities
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li>Standard cooking and delivery time is estimated between 35 to 60 minutes, subject to order volume and metropolitan traffic.</li>
                  <li>Customers must provide an accurate drop-off location and gate/entry code if applicable. If our courier cannot reach you after 3 contact attempts upon arrival, the order may be left at the secure building entrance or returned to the kitchen.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  5. Cancellations, Allergies & Quality Guarantee
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-stone-400">
                  <li><strong>Cancellations:</strong> Because our West African specialties are cooked fresh to order, orders cannot be cancelled once cooking has commenced in the kitchen.</li>
                  <li><strong>Food Allergies:</strong> West African dishes frequently utilize tree nuts, peanuts (groundnut paste / yaji suya spice), shellfish (dried crayfish seasoning), and spicy peppers. Please inform us of any severe allergies before ordering.</li>
                  <li><strong>Satisfaction Guarantee:</strong> If there is any missing item or packing discrepancy, please notify Chef Lulu within 60 minutes of delivery via WhatsApp with a photo for an immediate resolution or credit.</li>
                </ul>
              </section>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-stone-800 bg-stone-950/80 flex items-center justify-between">
          <div className="text-xs text-stone-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Authentic & Protected by Lulu Anti-Scam Protocol
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
