import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, ChefHat, Bike, MapPin, Phone, ShieldCheck, AlertCircle, Copy, Check, MessageSquare } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { OrderStatus } from '../types';
import { LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT } from '../utils/checkout';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'pending_payment', label: 'Order Placed', desc: 'Awaiting payment verification' },
  { key: 'payment_verified', label: 'Payment Confirmed', desc: 'Memo verified by staff' },
  { key: 'preparing_in_kitchen', label: 'In Lulu’s Kitchen', desc: 'Simmering & grilling fresh' },
  { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Courier en route to address' },
  { key: 'delivered', label: 'Delivered', desc: 'Meal enjoyed hot' },
];

export const OrderTracker: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, submitPaymentProof, setIsChatOpen } = useOrder();
  const [searchInput, setSearchInput] = useState(trackingOrderId || '');
  const [copiedCode, setCopiedCode] = useState(false);

  // Quick verification in tracker
  const [txIdInput, setTxIdInput] = useState('');
  const [verifyNotice, setVerifyNotice] = useState<string | null>(null);

  const currentOrder = orders.find(
    o => o.id.toLowerCase() === (trackingOrderId || searchInput).toLowerCase().trim()
  ) || orders[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTrackingOrderId(searchInput.trim().toUpperCase());
    }
  };

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment': return 0;
      case 'payment_verified': return 1;
      case 'preparing_in_kitchen': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = currentOrder ? getStepIndex(currentOrder.status) : 0;

  const handleQuickProof = () => {
    if (!currentOrder || !txIdInput.trim()) return;
    const res = submitPaymentProof(currentOrder.id, {
      transactionId: txIdInput.trim(),
      memoEntered: currentOrder.id,
      amountPaid: currentOrder.total,
      senderHandle: currentOrder.customer.paymentIdentifier,
      rawText: `Auto verification submitted via order tracker`,
    });
    setVerifyNotice(res.message);
    setTxIdInput('');
    setTimeout(() => setVerifyNotice(null), 5000);
  };

  const copyOrderCode = () => {
    if (!currentOrder) return;
    navigator.clipboard.writeText(currentOrder.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="py-10 sm:py-14 bg-[#faf8f5] min-h-[80vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Tracker Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Real-Time Kitchen Dispatch
            </span>
            <h1 className="text-3xl font-extrabold text-stone-900 font-display">
              Live Order Status
            </h1>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Enter Order Code (e.g. MUK-4821)"
                className="pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors"
            >
              Lookup
            </button>
          </form>
        </div>

        {!currentOrder ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-stone-500 text-sm">No order found matching your inquiry.</p>
            <p className="text-xs text-stone-400 mt-1">Try entering one of our active demo codes: MUK-4821 or MUK-6190</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Top Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold font-mono text-stone-900">
                      {currentOrder.id}
                    </span>
                    <button
                      onClick={copyOrderCode}
                      className="p-1 text-stone-400 hover:text-amber-800 transition-colors"
                      title="Copy code"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Placed at {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {currentOrder.items.length} items
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Total Due</span>
                    <span className="text-lg font-bold text-stone-900 tabular-nums">
                      ${currentOrder.total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>Inquire via Chat</span>
                  </button>
                </div>
              </div>

              {/* Progress Stepper Bar */}
              <div className="py-2">
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-stone-200 hidden sm:block -z-0" />
                  <div
                    className="absolute top-4 left-6 h-1 bg-amber-600 hidden sm:block transition-all duration-500 -z-0"
                    style={{ width: `${(currentStep / 4) * 100}%` }}
                  />

                  {/* Step circles */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                    {STATUS_STEPS.map((step, idx) => {
                      const isCompleted = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                              isCompleted
                                ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                                : 'bg-stone-100 text-stone-400 border border-stone-300'
                            }`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <div>
                            <div className={`text-xs font-bold ${isCurrent ? 'text-amber-800' : 'text-stone-800'}`}>
                              {step.label}
                            </div>
                            <div className="text-[11px] text-stone-500 hidden sm:block">
                              {step.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status Specific Notification Banner */}
              {currentOrder.status === 'pending_payment' && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        Awaiting Payment Proof & Memo Verification
                      </h4>
                      <p className="text-xs text-amber-900 leading-relaxed">
                        Please send <strong>${currentOrder.total.toFixed(2)}</strong> to{' '}
                        {currentOrder.customer.preferredPayment === 'cashapp' ? LULU_CASHAPP_TAG : LULU_ZELLE_CONTACT} with mandatory memo <span className="font-mono font-bold bg-amber-200/60 px-1 py-0.5 rounded">{currentOrder.id}</span>.
                      </p>
                    </div>
                  </div>

                  {/* Inline Verification Input */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <input
                      type="text"
                      value={txIdInput}
                      onChange={e => setTxIdInput(e.target.value)}
                      placeholder="Paste CashApp or Bank Transaction ID (e.g. TX-98421)"
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      onClick={handleQuickProof}
                      className="px-4 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors"
                    >
                      Verify Proof Now
                    </button>
                  </div>

                  {verifyNotice && (
                    <p className="text-xs text-amber-950 font-medium">{verifyNotice}</p>
                  )}
                </div>
              )}

              {currentOrder.paymentProof && currentOrder.paymentProof.isVerified && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>
                      <strong>Payment Verified:</strong> Memo matched {currentOrder.id} · Ref: {currentOrder.paymentProof.transactionId}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-800">
                    Verified {new Date(currentOrder.paymentProof.verifiedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

            </div>

            {/* Courier & Delivery Visual Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Courier Card & Map Route Mock */}
              <div className="md:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bike className="w-5 h-5 text-amber-700" />
                    <h3 className="font-bold text-stone-900 font-display">Courier & Dispatch Info</h3>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                    ETA: ~{currentOrder.estimatedDeliveryMinutes} mins
                  </span>
                </div>

                {/* Simulated Street Route Map */}
                <div className="relative h-44 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#d6c7b2_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* Visual Route Path SVG */}
                  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M 60 120 Q 180 50 280 90 T 420 60"
                      fill="none"
                      stroke="#d97706"
                      strokeWidth="3"
                      strokeDasharray="6 6"
                    />
                  </svg>

                  {/* Kitchen Location Pin */}
                  <div className="absolute left-12 bottom-8 flex items-center gap-1.5 bg-stone-900 text-white px-2.5 py-1 rounded-lg text-xs shadow-md">
                    <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                    <span>Lulu's Mukase</span>
                  </div>

                  {/* Destination Pin */}
                  <div className="absolute right-12 top-6 flex items-center gap-1.5 bg-amber-600 text-white px-2.5 py-1 rounded-lg text-xs shadow-md">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span>Your Address</span>
                  </div>

                  {/* Animated Rider Icon along route */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-amber-600 p-2 rounded-full shadow-lg animate-bounce">
                    <Bike className="w-5 h-5 text-amber-700" />
                  </div>
                </div>

                {/* Courier contact details */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
                  <div>
                    <span className="font-bold text-stone-900 block">{currentOrder.riderName || 'Kwame Asante'}</span>
                    <span className="text-stone-500">Dedicated Thermal Bag Courier</span>
                  </div>
                  <a
                    href={`tel:${currentOrder.riderPhone || '4045550144'}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver</span>
                  </a>
                </div>

                <div className="text-xs text-stone-600 space-y-1">
                  <p>
                    <strong>Destination:</strong> {currentOrder.customer.address}
                    {currentOrder.customer.apartmentSuite ? `, Apt ${currentOrder.customer.apartmentSuite}` : ''}, {currentOrder.customer.city}
                  </p>
                  {currentOrder.customer.deliveryNotes && (
                    <p className="italic text-stone-500">
                      <strong>Delivery note:</strong> "{currentOrder.customer.deliveryNotes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Ordered Items Receipt Summary */}
              <div className="md:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-bold text-stone-900 font-display border-b border-stone-100 pb-2">
                  Order Summary
                </h3>

                <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto space-y-2 pr-1">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="pt-2 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>
                          {item.quantity}x{' '}
                          {item.customization?.isOffMenuCustom && item.customization?.offMenuDishName
                            ? item.customization.offMenuDishName
                            : item.menuItem.name}
                        </span>
                        <span className="tabular-nums">${item.itemTotalPrice.toFixed(2)}</span>
                      </div>
                      {item.customization && (
                        <div className="text-[11px] text-stone-500 space-y-0.5">
                          {item.customization.selectedSideOrSwallow && <div>• Side/Swallow: {item.customization.selectedSideOrSwallow}</div>}
                          {item.customization.protein && <div>• Protein: {item.customization.protein}</div>}
                          <div>• Heat: {item.customization.spiceLevel}</div>
                          {item.customization.selectedAddOns.map(a => (
                            <div key={a.id}>• +{a.name}</div>
                          ))}
                          {item.customization.offMenuDetails && <div>• Custom Prep: {item.customization.offMenuDetails}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-200 space-y-1 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold tabular-nums text-stone-900">${currentOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="font-semibold tabular-nums text-stone-900">${currentOrder.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging & Tax</span>
                    <span className="font-semibold tabular-nums text-stone-900">${currentOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-100">
                    <span>Total Paid</span>
                    <span className="text-amber-800 tabular-nums">${currentOrder.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
