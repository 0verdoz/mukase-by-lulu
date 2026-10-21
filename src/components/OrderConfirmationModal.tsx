import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, MessageSquare, ArrowRight, ShieldCheck, AlertCircle, UploadCloud, RefreshCw, Eye } from 'lucide-react';
import { Order } from '../types';
import { useOrder } from '../context/OrderContext';
import { getWhatsAppUrl, getSmsUrl, isApplePlatform, formatOrderMessage, LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT } from '../utils/checkout';

interface Props {
  order: Order;
  onClose: () => void;
}

export const OrderConfirmationModal: React.FC<Props> = ({ order, onClose }) => {
  const { submitPaymentProof, setCurrentView, setTrackingOrderId } = useOrder();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Verification state
  const [transactionId, setTransactionId] = useState('');
  const [memoEntered, setMemoEntered] = useState(order.id);
  const [amountPaid, setAmountPaid] = useState<number>(order.total);
  const [senderHandle, setSenderHandle] = useState(order.customer.paymentIdentifier);
  const [verificationFeedback, setVerificationFeedback] = useState<{
    status: 'idle' | 'success' | 'flagged' | 'error';
    message: string;
    score?: number;
  }>({ status: 'idle', message: '' });

  const isApple = isApplePlatform();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(order.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyMessage = () => {
    const formatted = formatOrderMessage(order);
    navigator.clipboard.writeText(formatted);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      setVerificationFeedback({
        status: 'error',
        message: 'Please enter your Transaction Reference # from your Cash App or Bank confirmation.',
      });
      return;
    }

    const result = submitPaymentProof(order.id, {
      transactionId: transactionId.trim(),
      memoEntered: memoEntered.trim(),
      amountPaid: Number(amountPaid),
      senderHandle: senderHandle.trim(),
      rawText: `${senderHandle} sent $${amountPaid} to Mukase by Lulu with memo ${memoEntered}`,
    });

    if (result.success) {
      setVerificationFeedback({
        status: 'success',
        message: result.message,
        score: result.score,
      });
    } else {
      setVerificationFeedback({
        status: 'flagged',
        message: result.message,
        score: result.score,
      });
    }
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
            Your unique order code has been created for Chef Lulu's staff to verify your meal and payment.
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
          
          {/* Step 1: Dispatch to Messaging */}
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">1</span>
              <span>Send Pre-Filled Order via Direct Message</span>
            </h3>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              Click below to send your item breakdown, total (${order.total.toFixed(2)}), delivery address, and unique memo directly to Chef Lulu's kitchen line.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href={getWhatsAppUrl(order)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open in WhatsApp</span>
              </a>

              <a
                href={getSmsUrl(order, isApple)}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-medium text-xs shadow-sm transition-colors"
              >
                <span>{isApple ? 'Open in iMessage' : 'Open in SMS'}</span>
              </a>
            </div>

            <button
              onClick={handleCopyMessage}
              className="text-xs text-stone-500 hover:text-amber-800 flex items-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedMsg ? 'Full order text copied!' : 'Copy formatted text to clipboard'}</span>
            </button>
          </div>

          {/* Step 2: Anti-Fraud Payment Instructions */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <h3 className="font-bold text-stone-900 font-display flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">2</span>
              <span>Send Payment with Mandatory Memo</span>
            </h3>

            <div className="text-xs space-y-1 text-stone-600">
              <p>
                <strong>Destination:</strong>{' '}
                {order.customer.preferredPayment === 'cashapp'
                  ? `Cash App to ${LULU_CASHAPP_TAG}`
                  : `Zelle to ${LULU_ZELLE_CONTACT}`}
              </p>
              <p>
                <strong>Exact Amount:</strong>{' '}
                <span className="font-bold text-stone-900 tabular-nums">${order.total.toFixed(2)}</span>
              </p>
              <p className="text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium">
                ⚠️ <strong>Mandatory Note/Memo:</strong> Put <span className="font-mono font-bold text-amber-950">{order.id}</span> in the memo box so our system pairs your payment without staff confusion.
              </p>
            </div>
          </div>

          {/* Step 3: Instant Proof Verification Box */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 font-display flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center">3</span>
                <span>Anti-Scam Automated Verification</span>
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>

            <p className="text-xs text-stone-500">
              To thwart fake screenshot edits and reused receipts, paste your Cash App Web Receipt URL or bank Transaction Reference # below.
            </p>

            <form onSubmit={handleVerify} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Transaction Reference # / Receipt ID
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={e => setTransactionId(e.target.value)}
                    placeholder="e.g. TX-9482104 or Web Receipt URL"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Memo Included in Payment
                  </label>
                  <input
                    type="text"
                    value={memoEntered}
                    onChange={e => setMemoEntered(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                  />
                </div>
              </div>

              {/* Verification Feedback Banner */}
              {verificationFeedback.status !== 'idle' && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    verificationFeedback.status === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : verificationFeedback.status === 'flagged'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {verificationFeedback.status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-semibold">{verificationFeedback.message}</p>
                    {verificationFeedback.score && (
                      <p className="text-[11px] opacity-80">
                        Anti-Fraud Security Score: {verificationFeedback.score}/100
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verify Payment Proof</span>
                </button>

                {/* Quick Demo fill for convenience */}
                <button
                  type="button"
                  onClick={() => {
                    setTransactionId(`TX-CASH-${Math.floor(100000 + Math.random() * 900000)}`);
                    setMemoEntered(order.id);
                  }}
                  className="py-2 px-3 border border-stone-200 hover:bg-stone-100 text-stone-600 rounded-xl text-[11px] transition-colors"
                >
                  Fill Sample TxID
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Close Window
          </button>

          <button
            onClick={goToTracking}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            <span>Track Order & Delivery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
