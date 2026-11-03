import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, MessageSquare, ArrowRight, ShieldCheck, Clock, Phone, AlertCircle } from 'lucide-react';
import { Order } from '../types';
import { useOrder } from '../context/OrderContext';
import { getWhatsAppUrl, getSmsUrl, isApplePlatform, isMobileDevice, formatOrderMessage, LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT } from '../utils/checkout';

interface Props {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<Props> = ({ order, onClose }) => {
  const { submitPaymentProof, setCurrentView, setTrackingOrderId } = useOrder();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedTag, setCopiedTag] = useState(false);
  const [copiedZelle, setCopiedZelle] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [notifiedKitchen, setNotifiedKitchen] = useState(false);

  const isApple = isApplePlatform();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyTag = () => {
    navigator.clipboard.writeText(LULU_CASHAPP_TAG);
    setCopiedTag(true);
    setTimeout(() => setCopiedTag(false), 2000);
  };

  const handleCopyZelle = () => {
    navigator.clipboard.writeText(LULU_ZELLE_CONTACT);
    setCopiedZelle(true);
    setTimeout(() => setCopiedZelle(false), 2000);
  };

  const handleCopyMessage = () => {
    const formatted = formatOrderMessage(order);
    navigator.clipboard.writeText(formatted);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleNotifySent = () => {
    submitPaymentProof(order.id, {
      memoEntered: order.id,
      amountPaid: order.total,
      senderHandle: order.customer.paymentIdentifier,
    });
    setNotifiedKitchen(true);
  };

  const goToTracking = () => {
    setTrackingOrderId(order.id);
    setCurrentView('track');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 text-center shrink-0">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-3">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold font-display">Order Code Generated!</h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-md mx-auto">
            Your unique order code has been logged with Chef Lulu's kitchen line.
          </p>

          {/* Unique Order Code Pill */}
          <div className="mt-4 inline-flex items-center gap-3 bg-stone-950/40 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/20">
            <span className="text-xs uppercase tracking-widest text-amber-200">Unique Order ID</span>
            <span className="text-xl font-mono font-bold tracking-wider text-white">{order.id}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 text-white hover:text-amber-300 transition-colors"
              title="Copy Order Code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1 text-sm text-stone-700">
          
          {/* Step 1: Send Payment */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 font-display flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-xs flex items-center justify-center">1</span>
                <span>Send Payment to Chef Lulu</span>
              </h3>
              <span className="text-base font-bold text-amber-900 font-mono">${order.total.toFixed(2)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* CashApp Card */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Cash App</span>
                  <span className="text-sm font-bold font-mono text-emerald-700">{LULU_CASHAPP_TAG}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyTag}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  {copiedTag ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {/* Zelle Card */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Zelle Phone</span>
                  <span className="text-xs font-bold font-mono text-stone-800">{LULU_ZELLE_CONTACT}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyZelle}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                >
                  {copiedZelle ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Memo Note */}
            <div className="bg-amber-100/60 p-2.5 rounded-xl border border-amber-300/80 text-xs text-amber-950 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold">⚠️ Put Memo in Transfer:</span>
                <span className="font-mono font-bold bg-amber-200/80 px-2 py-0.5 rounded text-amber-900">{order.id}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs font-semibold text-amber-800 hover:underline"
              >
                {copiedCode ? 'Copied!' : 'Copy Memo'}
              </button>
            </div>
          </div>

          {/* Step 2: Confirm / Notify Kitchen */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">2</span>
              <span>Notify Kitchen to Verify &amp; Start Cooking</span>
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              To guarantee that food is fresh and never unfulfilled, Chef Lulu personally verifies incoming transfers before firing up the kitchen.
            </p>

            {/* Action 1: WhatsApp (Recommended) */}
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fastest: Send Receipt on WhatsApp</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-200/60 px-2 py-0.5 rounded">Instant Chat</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Opens Chef Lulu's WhatsApp with your order details and memo pre-filled so she can confirm your transfer instantly.
              </p>
              <a
                href={getWhatsAppUrl(order)}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm via WhatsApp with Chef Lulu</span>
              </a>
            </div>

            {/* Action 2: In-App Transfer Notification */}
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-600" />
                  <span>Don't Have WhatsApp? Notify Directly</span>
                </span>
              </div>
              <p className="text-[11px] text-stone-600">
                Click below after sending your CashApp/Zelle transfer. Chef Lulu will verify the transfer in her banking app and accept your order in the kitchen terminal.
              </p>

              {notifiedKitchen ? (
                <div className="p-2.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Kitchen notified! Chef Lulu is verifying receipt of ${order.total.toFixed(2)}.</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNotifySent}
                  className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>I've Sent the Transfer — Notify Chef Lulu</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close
          </button>

          <button
            onClick={goToTracking}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <span>Track Order Status</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
