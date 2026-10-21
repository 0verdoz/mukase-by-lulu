import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, MessageSquare, ArrowRight, ShieldCheck, Phone, MapPin, User, CreditCard } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { getWhatsAppUrl, getSmsUrl, isApplePlatform, LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT } from '../utils/checkout';
import { PaymentMethod } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
    customer,
    updateCustomer,
    createOrder,
    setIsChatOpen,
<<<<<<< HEAD
=======
    openLegalModal,
>>>>>>> main
  } = useOrder();

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const isApple = isApplePlatform();

  if (!isCartOpen) return null;

  const deliveryFee = cart.length > 0 ? 4.99 : 0;
  const tax = cart.length > 0 ? +(cartTotal * 0.08).toFixed(2) : 0;
  const finalTotal = cart.length > 0 ? +(cartTotal + deliveryFee + tax).toFixed(2) : 0;

  const validateCustomer = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = 'Full name is required';
    if (!customer.phone.trim()) errors.phone = 'Valid phone number is required';
    if (!customer.address.trim()) errors.address = 'Delivery street address is required';
    if (!customer.paymentIdentifier.trim()) {
      errors.paymentIdentifier = customer.preferredPayment === 'cashapp' ? 'Your CashApp $tag is required' : 'Sender Zelle name or phone is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (channel: 'whatsapp' | 'imessage' | 'sms' | 'concierge_chat') => {
    if (!validateCustomer()) {
      return;
    }

    const order = createOrder(channel);

    if (channel === 'whatsapp') {
      const url = getWhatsAppUrl(order);
      window.open(url, '_blank');
    } else if (channel === 'imessage' || channel === 'sms') {
      const url = getSmsUrl(order, channel === 'imessage' || isApple);
      window.location.href = url;
    } else if (channel === 'concierge_chat') {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-stone-900 font-display">Your Order Bag</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 tabular-nums">
              {cartCount} {cartCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-500 flex items-center justify-center transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body: Items + Customer Info */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {cart.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <p className="text-stone-500 text-sm">Your order bag is currently empty.</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-semibold text-amber-700 hover:underline"
              >
                Browse our smoky jollof and waakye
              </button>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Selected Dishes
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl bg-white overflow-hidden">
                  {cart.map(item => (
                    <div key={item.id} className="p-3.5 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-stone-900 font-display">
<<<<<<< HEAD
                            {item.menuItem.name}
                          </h4>
                          <span className="text-xs font-semibold text-amber-800 tabular-nums">
=======
                            {item.customization?.isOffMenuCustom && item.customization?.offMenuDishName
                              ? item.customization.offMenuDishName
                              : item.menuItem.name}
                          </h4>
                          {item.customization?.isOffMenuCustom && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Off-Menu Special
                            </span>
                          )}
                          <span className="text-xs font-semibold text-amber-800 tabular-nums block mt-0.5">
>>>>>>> main
                            ${item.itemTotalPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Stepper & Delete */}
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-l-lg"
                              aria-label="Reduce"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-200 rounded-r-lg"
                              aria-label="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-stone-400 hover:text-red-600 transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Customization Details */}
                      {item.customization && (
                        <div className="text-xs text-stone-500 bg-stone-50 p-2 rounded-lg space-y-0.5">
<<<<<<< HEAD
=======
                          {item.customization.selectedSideOrSwallow && (
                            <p>
                              <strong className="text-stone-700">Side / Swallow:</strong> {item.customization.selectedSideOrSwallow}
                            </p>
                          )}
>>>>>>> main
                          {item.customization.protein && (
                            <p>
                              <strong className="text-stone-700">Protein:</strong> {item.customization.protein}
                            </p>
                          )}
                          <p>
                            <strong className="text-stone-700">Spice:</strong> {item.customization.spiceLevel}
                          </p>
                          {item.customization.selectedAddOns.length > 0 && (
                            <p>
                              <strong className="text-stone-700">Add-ons:</strong>{' '}
                              {item.customization.selectedAddOns.map(a => a.name).join(', ')}
                            </p>
                          )}
<<<<<<< HEAD
=======
                          {item.customization.offMenuDetails && (
                            <p>
                              <strong className="text-stone-700">Custom Prep:</strong> {item.customization.offMenuDetails}
                            </p>
                          )}
                          {item.customization.customizationFee && item.customization.customizationFee > 0 ? (
                            <p className="text-amber-800 font-semibold">
                              + Custom Chef Prep Surcharge (${item.customization.customizationFee.toFixed(2)})
                            </p>
                          ) : null}
>>>>>>> main
                          {item.customization.specialInstructions && (
                            <p className="italic text-stone-600">
                              Note: "{item.customization.specialInstructions}"
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="space-y-4 pt-2 border-t border-stone-200">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Delivery & Contact Details
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={e => updateCustomer({ name: e.target.value })}
                      placeholder="Kwame Mensah"
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        formErrors.name ? 'border-red-400 bg-red-50' : 'border-stone-200'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                    />
                    {formErrors.name && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={e => updateCustomer({ phone: e.target.value })}
                      placeholder="404-555-0199"
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        formErrors.phone ? 'border-red-400 bg-red-50' : 'border-stone-200'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                    />
                    {formErrors.phone && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Street Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customer.address}
                    onChange={e => updateCustomer({ address: e.target.value })}
                    placeholder="742 Piedmont Ave NE"
                    className={`w-full px-3 py-2 text-xs rounded-xl border ${
                      formErrors.address ? 'border-red-400 bg-red-50' : 'border-stone-200'
                    } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                  />
                  {formErrors.address && <p className="text-[11px] text-red-600 mt-0.5">{formErrors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Apt / Suite</label>
                    <input
                      type="text"
                      value={customer.apartmentSuite || ''}
                      onChange={e => updateCustomer({ apartmentSuite: e.target.value })}
                      placeholder="Apt 4B"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={e => updateCustomer({ city: e.target.value })}
                      placeholder="Atlanta"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Payment Method (No 3rd-Party Gateway Needed)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cashapp' as PaymentMethod, label: 'Cash App', sub: LULU_CASHAPP_TAG },
                      { id: 'zelle' as PaymentMethod, label: 'Zelle', sub: 'Instant' },
                      { id: 'apple_cash' as PaymentMethod, label: 'Apple Cash', sub: 'iMessage' },
                    ].map(pm => {
                      const isSelected = customer.preferredPayment === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => updateCustomer({ preferredPayment: pm.id })}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                              : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                          }`}
                        >
                          <div className="text-xs font-bold">{pm.label}</div>
                          <div className="text-[10px] text-stone-500 truncate">{pm.sub}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Customer Payment Tag/Name */}
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      {customer.preferredPayment === 'cashapp'
                        ? 'Your CashApp $Cashtag'
                        : 'Your Zelle / Apple Sender Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customer.paymentIdentifier}
                      onChange={e => updateCustomer({ paymentIdentifier: e.target.value })}
                      placeholder={customer.preferredPayment === 'cashapp' ? '$YourTag' : 'First & Last Name'}
                      className={`w-full px-3 py-2 text-xs rounded-xl border ${
                        formErrors.paymentIdentifier ? 'border-red-400 bg-red-50' : 'border-stone-200'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/20`}
                    />
                    {formErrors.paymentIdentifier && (
                      <p className="text-[11px] text-red-600 mt-0.5">{formErrors.paymentIdentifier}</p>
                    )}
                  </div>
                </div>

                {/* Anti-Scam Assurance Box */}
                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-bold">Anti-Scam Memo Verification</p>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      A unique code (e.g. MUK-8492) will be generated. You must include this code in your CashApp/Zelle memo so Lulu's staff can verify your receipt instantly without confusion.
                    </p>
                  </div>
                </div>

              </div>
            </>
          )}

        </div>

        {/* Drawer Footer & Checkout Buttons */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-3 shrink-0">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Food Subtotal</span>
                <span className="font-semibold tabular-nums text-stone-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct Courier Delivery</span>
                <span className="font-semibold tabular-nums text-stone-900">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging & Local Tax (8%)</span>
                <span className="font-semibold tabular-nums text-stone-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                <span>Total Due</span>
                <span className="text-base text-amber-800 tabular-nums">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Direct Messaging Dispatch Buttons */}
            <div className="space-y-2 pt-1">
              
              {/* WhatsApp Primary Button */}
              <button
                type="button"
                onClick={() => handleCheckout('whatsapp')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>Order via WhatsApp (Instant Dispatch)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* iMessage / SMS Button (Adapts to iOS or Android) */}
              <button
                type="button"
                onClick={() => handleCheckout(isApple ? 'imessage' : 'sms')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>{isApple ? 'Order via iMessage (Apple Users)' : 'Order via Universal SMS'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* In-App Concierge Chat Alternative */}
              <button
                type="button"
                onClick={() => handleCheckout('concierge_chat')}
                className="w-full text-center py-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition-colors"
              >
                Or check out via Lulu Concierge Assistant in-app
              </button>

<<<<<<< HEAD
=======
              {/* Legal Notice */}
              <p className="text-[11px] text-center text-stone-400 pt-1">
                By placing an order, you agree to our{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('terms')}
                  className="text-stone-600 hover:text-amber-800 underline underline-offset-2 font-medium"
                >
                  Terms & Conditions
                </button>
                {' '}and{' '}
                <button
                  type="button"
                  onClick={() => openLegalModal('privacy')}
                  className="text-stone-600 hover:text-amber-800 underline underline-offset-2 font-medium"
                >
                  Privacy Policy
                </button>.
              </p>

>>>>>>> main
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
