import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, ChefHat, Bike, 
  DollarSign, Filter, RefreshCw, XCircle, Volume2, VolumeX, LogOut, 
  Lock, Copy, Check, ExternalLink, Settings, History, Phone, MessageSquare, Trash2 
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { Order, OrderStatus } from '../types';
import { StaffSession, clearStaffSession, getSecurityLogs, setCustomStaffPin, getActiveStaffPin } from '../utils/staffAuth';
import { getWhatsAppUrl, getSmsUrl } from '../utils/checkout';
import { SteamPotIcon } from './SteamPotIcon';

interface Props {
  session: StaffSession;
  onExit: () => void;
}

export const StandaloneStaffPortal: React.FC<Props> = ({ session, onExit }) => {
  const { orders, updateOrderStatus, submitPaymentProof, checkoutMode, setCheckoutMode, clearAllOrders } = useOrder();
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [activeTab, setActiveTab] = useState<'orders' | 'logs' | 'settings'>('orders');
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // PIN settings state
  const [newPin, setNewPin] = useState('');
  const [pinFeedback, setPinFeedback] = useState<string | null>(null);

  // Security logs state
  const securityLogs = getSecurityLogs();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingCount = orders.filter(o => o.status === 'pending_payment').length;
  const cookingCount = orders.filter(o => o.status === 'preparing_in_kitchen').length;
  const deliveryCount = orders.filter(o => o.status === 'out_for_delivery').length;

  
  useEffect(() => {
    if (orders.length === 0) {
      setSelectedOrder(null);
    } else if (!selectedOrder || !orders.some(o => o.id === selectedOrder.id)) {
      setSelectedOrder(orders[0]);
    }
  }, [orders]);

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

  const handleLogout = () => {
    clearStaffSession();
    if (onExit) {
      onExit();
    }
    // Dispatch global event to ensure any listener immediately unmounts authenticated view
    window.dispatchEvent(new Event('mukase_staff_logout'));
  };

  const handleApprovePayment = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing_in_kitchen');
    if (soundEnabled) {
      playChime();
    }
  };

  const handleRejectFraud = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', `Scam flagged: ${rejectReason || 'Fake receipt or unverified memo'}`);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const handleCopyStaffUrl = () => {
    const staffUrl = window.location.origin;
    navigator.clipboard.writeText(staffUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(newPin)) {
      setPinFeedback('Error: PIN must be 4 to 6 numeric digits.');
      return;
    }
    const success = setCustomStaffPin(newPin);
    if (success) {
      setPinFeedback(`Master PIN successfully updated to ${newPin}!`);
      setNewPin('');
      setTimeout(() => setPinFeedback(null), 4000);
    } else {
      setPinFeedback('Failed to update PIN.');
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext not permitted before user gesture
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 flex flex-col font-sans selection:bg-orange-500/20 selection:text-orange-900">
      
      {/* Standalone Terminal Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/90 px-4 sm:px-6 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <SteamPotIcon size={34} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-display text-stone-900 tracking-tight">
                  Mukase Kitchen Terminal
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  STAFF ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Logged in: <strong className="text-stone-700">{session.staffName}</strong> · Auth Token Valid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Copy Secret Staff URL */}
            <button
              onClick={handleCopyStaffUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-medium border border-stone-200/90 transition-colors shadow-2xs"
              title="Copy Standalone Staff Link to bookmark on kitchen iPad or phone"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-400" />}
              <span>{copiedLink ? 'Private Link Copied!' : 'Copy Staff Link'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs border border-stone-200/90 transition-colors shadow-2xs"
              title={soundEnabled ? 'Mute Kitchen Chimes' : 'Unmute Kitchen Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            </button>

            {/* Explicit Log Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white border border-red-500 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              title="Log Out of staff portal and return immediately to PIN lock screen"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs (Orders, Security Audit Logs, Terminal Settings) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200 pb-3 gap-3">
          <div className="bg-stone-200/60 p-1 rounded-2xl border border-stone-200/80 inline-flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              Kitchen Dispatch &amp; Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Security Audit Trail</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white text-stone-900 shadow-sm border border-stone-200/60'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Security Settings</span>
            </button>
          </div>

          <div className="text-xs text-stone-400 font-mono hidden md:block">
            Direct Staff Route: <span className="text-stone-600 font-semibold">?portal=staff</span>
          </div>
        </div>

        {/* View 1: Active Orders & Dispatch */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-1">
                <span className="text-xs text-stone-500 block font-medium">Today's Total Orders</span>
                <span className="text-2xl font-bold font-display text-stone-900 tabular-nums">{orders.length}</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-1">
                <span className="text-xs text-stone-500 block font-medium">Revenue</span>
                <span className="text-2xl font-bold font-display text-orange-600 tabular-nums">${totalRevenue.toFixed(2)}</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-1">
                <span className="text-xs text-stone-500 block font-medium">Pending Memo Proof</span>
                <span className={`text-2xl font-bold font-display tabular-nums ${pendingCount > 0 ? 'text-amber-600' : 'text-stone-400'}`}>
                  {pendingCount}
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] space-y-1">
                <span className="text-xs text-stone-500 block font-medium">In Kitchen / In Transit</span>
                <span className="text-2xl font-bold font-display text-emerald-700 tabular-nums">
                  {cookingCount} prep · {deliveryCount} rider
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-stone-200/60 rounded-2xl border border-stone-200/80 scrollbar-none flex-1">
              {[
                { id: 'all', label: `All Orders (${orders.length})` },
                { id: 'pending_payment', label: `Awaiting Verification (${pendingCount})` },
                { id: 'preparing_in_kitchen', label: `Cooking in Mukase (${cookingCount})` },
                { id: 'out_for_delivery', label: `With Courier Kwame (${deliveryCount})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    filterStatus === tab.id
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 shadow-xs transition-colors shrink-0 cursor-pointer"
              title="Clear all orders and reset revenue ledger for a new shift"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Daily Orders &amp; Reset Ledger</span>
            </button>
          </div>

            {/* Split Screen Table & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Order List */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] overflow-hidden flex flex-col max-h-[660px]">
                <div className="p-3.5 border-b border-stone-200 bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center justify-between">
                  <span>Customer Message Threads</span>
                  <span className="text-[11px] font-normal text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">Live Sync Active</span>
                </div>

                <div className="divide-y divide-stone-100 overflow-y-auto flex-1">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-400">
                      No orders in this status category.
                    </div>
                  ) : (
                    filteredOrders.map(order => {
                      const isSelected = selectedOrder?.id === order.id;
                      const isPending = order.status === 'pending_payment';
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className={`p-4 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-50/80 border-l-4 border-amber-600'
                              : 'hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                              <span className="text-[10px] font-semibold text-stone-600 uppercase bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded-md">
                                {order.channel}
                              </span>
                            </div>
                            <span className="text-sm font-bold tabular-nums text-stone-900">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
                            <span className="text-stone-700 font-medium">{order.customer.name} ({order.customer.city})</span>
                            <span className="text-stone-400 font-mono text-[11px]">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            {order.paymentProof?.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Memo Matched
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                                <Clock className="w-3 h-3 text-amber-600" /> Awaiting Proof
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-lg">
                                {order.status.replace(/_/g, ' ')}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Order Detail & Security Audit */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-5 sm:p-6 space-y-6">
                {!selectedOrder ? (
                  <div className="text-center py-16 text-stone-400 text-sm">
                    Select an order from the list to review verification details.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold font-mono text-stone-900">
                            {selectedOrder.id}
                          </h2>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 uppercase border border-stone-200">
                            {selectedOrder.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-1">
                          Customer: <strong className="text-stone-800">{selectedOrder.customer.name}</strong> · Phone: {selectedOrder.customer.phone}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-xs text-stone-400 block font-medium">Total Due</span>
                        <span className="text-2xl font-bold text-orange-600 tabular-nums">
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Anti-Scam Inspector Box */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[#faf8f5] border border-stone-200/90 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                            Anti-Fraud Payment Inspection
                          </h3>
                        </div>
                        <span className="text-xs text-stone-600 font-medium">
                          {selectedOrder.customer.preferredPayment.toUpperCase()}: <span className="font-mono text-stone-800">{selectedOrder.customer.paymentIdentifier}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
                          <span className="text-[10px] text-stone-400 block uppercase font-medium">Required Memo</span>
                          <span className="font-mono font-bold text-amber-700 text-sm">{selectedOrder.id}</span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
                          <span className="text-[10px] text-stone-400 block uppercase font-medium">Memo Status</span>
                          <span className={`font-semibold ${selectedOrder.paymentProof?.memoMatched ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {selectedOrder.paymentProof?.memoMatched ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-2xs">
                          <span className="text-[10px] text-stone-400 block uppercase font-medium">Replay / Dup Check</span>
                          <span className={`font-semibold ${selectedOrder.paymentProof?.duplicateDetected ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                            {selectedOrder.paymentProof?.duplicateDetected ? '🚨 REUSED ID' : '🛡️ Unique Tx'}
                          </span>
                        </div>
                      </div>

                      {selectedOrder.paymentProof?.verificationNotes && (
                        <div className="text-xs p-3 bg-white rounded-xl border border-stone-200 text-stone-700 font-mono text-[11px] shadow-2xs">
                          Audit Log: {selectedOrder.paymentProof.verificationNotes}
                        </div>
                      )}

                      {/* Approval Actions */}
                      {selectedOrder.status === 'pending_payment' && (
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                          <button
                            onClick={() => handleApprovePayment(selectedOrder.id)}
                            className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Payment &amp; Start Cooking</span>
                          </button>

                          <button
                            onClick={() => setShowRejectModal(selectedOrder.id)}
                            className="w-full sm:w-auto py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Reject Scam
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress Progression */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Kitchen Progression
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'preparing_in_kitchen')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedOrder.status === 'preparing_in_kitchen'
                              ? 'bg-amber-600 text-white shadow-sm'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/60'
                          }`}
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>1. Cooking in Mukase</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'out_for_delivery')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedOrder.status === 'out_for_delivery'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/60'
                          }`}
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>2. Dispatched to Courier Kwame</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            selectedOrder.status === 'delivered'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200/60'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>3. Delivered</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-stone-200">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Ordered Dishes ({selectedOrder.items.length})
                      </h4>

                      <div className="space-y-2">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1.5">
                            <div className="flex justify-between font-bold text-stone-900 text-sm">
                              <span>
                                {item.quantity}x{' '}
                                {item.customization?.isOffMenuCustom && item.customization?.offMenuDishName
                                  ? item.customization.offMenuDishName
                                  : item.menuItem.name}
                              </span>
                              <span className="tabular-nums text-orange-600">${item.itemTotalPrice.toFixed(2)}</span>
                            </div>
                            {item.customization && (
                              <div className="text-stone-600 space-y-0.5">
                                {item.customization.selectedSideOrSwallow && (
                                  <p><span className="text-stone-800 font-semibold">Side / Swallow:</span> {item.customization.selectedSideOrSwallow}</p>
                                )}
                                {item.customization.protein && (
                                  <p><span className="text-stone-800 font-medium">Protein:</span> {item.customization.protein}</p>
                                )}
                                <p><span className="text-stone-800 font-medium">Spice Heat:</span> {item.customization.spiceLevel}</p>
                                {item.customization.selectedAddOns.length > 0 && (
                                  <p><span className="text-stone-800 font-medium">Add-ons:</span> {item.customization.selectedAddOns.map(a => a.name).join(', ')}</p>
                                )}
                                {item.customization.offMenuDetails && (
                                  <p className="text-emerald-800 bg-emerald-50 p-2 rounded-lg mt-1 border border-emerald-200">
                                    <strong>Off-Menu Request:</strong> "{item.customization.offMenuDetails}"
                                  </p>
                                )}
                                {item.customization.specialInstructions && (
                                  <p className="text-amber-900 bg-amber-50 p-2 rounded-lg mt-1 border border-amber-200">
                                    <strong>Chef Instruction:</strong> "{item.customization.specialInstructions}"
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Delivery Details */}
                    <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs text-stone-700 space-y-1">
                      <p>
                        <strong className="text-stone-900">Address:</strong> {selectedOrder.customer.address}
                        {selectedOrder.customer.apartmentSuite ? `, Apt ${selectedOrder.customer.apartmentSuite}` : ''}, {selectedOrder.customer.city}
                      </p>
                      {selectedOrder.customer.deliveryNotes && (
                        <p className="text-stone-500">
                          <strong className="text-stone-700">Driver Note:</strong> "{selectedOrder.customer.deliveryNotes}"
                        </p>
                      )}
                    </div>

                  </>
                )}
              </div>

            </div>

          </div>
        )}

        {/* View 2: Security Audit Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-bold font-display text-stone-900">Cryptographic Security Audit Log</h3>
                <p className="text-xs text-stone-500">Records all terminal authentications, failed entries, and anti-fraud actions.</p>
              </div>
            </div>

            <div className="divide-y divide-stone-100 border border-stone-200/80 rounded-xl overflow-hidden font-mono text-xs">
              {securityLogs.length === 0 ? (
                <div className="p-6 text-center text-stone-400">No security events recorded yet.</div>
              ) : (
                securityLogs.map(log => (
                  <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'LOGIN_SUCCESS' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        log.action === 'LOCKOUT_TRIGGERED' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {log.action}
                      </span>
                      <p className="text-stone-800 text-xs mt-1.5 font-sans font-medium">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-stone-400 shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* View 3: Terminal Security Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-stone-200/90 shadow-[0_2px_12px_rgb(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-stone-900">Staff Terminal Security Settings</h3>
              <p className="text-xs text-stone-500">Change master kitchen passcode and configure staff protection.</p>
            </div>

            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Change Master Kitchen PIN (4 to 6 digits)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="Enter new numeric PIN"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Current active PIN is: <span className="font-mono text-stone-600 font-semibold">****</span>
                </p>
              </div>

              {pinFeedback && (
                <p className={`text-xs p-3 rounded-xl border ${
                  pinFeedback.startsWith('Error')
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {pinFeedback}
                </p>
              )}

              <button
                type="submit"
                disabled={!newPin}
                className="py-2.5 px-5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-40 cursor-pointer"
              >
                Update Staff PIN
              </button>
            </form>

            {/* Storefront Checkout & Anti-Scam Mode Switcher */}
            <div className="pt-6 border-t border-stone-200 space-y-4">
              <div>
                <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  <span>Storefront Checkout &amp; Anti-Scam Mode</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose how customer orders are received on the storefront. You can toggle between both modes to test:
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Hybrid Mode (Visibly Blurred & Disabled when Mode 2 is Active) */}
                {checkoutMode === 'whatsapp_only' ? (
                  <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-50">
                    <div className="filter blur-[1.5px] opacity-40 pointer-events-none p-4 select-none">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-amber-800">
                          Mode 1: Hybrid (WhatsApp Primary + Web Order with Kitchen Approval)
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 leading-relaxed">
                        Customer can order via WhatsApp OR submit order on the web. Web orders stay <strong>&quot;Awaiting Confirmation&quot;</strong> until you verify the money in CashApp/Zelle and click &quot;Confirm Payment &amp; Start Cooking&quot;.
                      </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-between px-4 bg-stone-900/10 backdrop-blur-[0.5px]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold bg-white text-stone-600 border border-stone-200 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
                          Blurred &amp; Inactive (Mode 2 Active)
                        </span>
                        <span className="text-xs text-stone-600 hidden sm:inline">Direct web orders paused</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCheckoutMode('hybrid')}
                        className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-colors cursor-pointer active:scale-95"
                      >
                        Activate Mode 1
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('hybrid')}
                    className="w-full p-4 rounded-2xl border-2 border-amber-500 bg-amber-50/70 text-stone-900 shadow-sm text-left transition-all ring-1 ring-amber-500/20 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-amber-900">
                        Mode 1: Hybrid (WhatsApp Primary + Web Order with Kitchen Approval)
                      </span>
                      <span className="text-[10px] uppercase font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full font-mono shadow-2xs">Active</span>
                    </div>
                    <p className="text-[11px] text-stone-700 leading-relaxed">
                      Customer can order via WhatsApp OR submit order on the web. Web orders stay <strong>&quot;Awaiting Confirmation&quot;</strong> until you verify the money in CashApp/Zelle and click &quot;Confirm Payment &amp; Start Cooking&quot;.
                    </p>
                  </button>
                )}

                {/* Option 2: Mandatory WhatsApp / Phone Only (Strict Scam-Proof & Anti-Spam) */}
                <button
                  type="button"
                  onClick={() => setCheckoutMode('whatsapp_only')}
                  className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    checkoutMode === 'whatsapp_only'
                      ? 'bg-emerald-50/70 border-2 border-emerald-500 text-stone-900 shadow-sm ring-1 ring-emerald-500/20'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-800">
                      Mode 2: Mandatory WhatsApp &amp; Phone Only (Strict Scam-Proof &amp; Anti-Spam)
                    </span>
                    {checkoutMode === 'whatsapp_only' && (
                      <span className="text-[10px] uppercase font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full font-mono shadow-2xs">Active</span>
                    )}
                  </div>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    Direct web ordering is disabled. $Cashtag is <strong>completely hidden from the web app</strong> to prevent spoofed payments and spam. Kitchen staff provides $Cashtag privately in WhatsApp after reviewing order details.
                  </p>
                </button>
              </div>
            </div>

            {/* Staff Session & Log Out Section */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Active Staff Session</span>
                </h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Logged in as <strong className="text-stone-800">{session.staffName}</strong>. End session when leaving the terminal.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Staff Portal</span>
              </button>
            </div>

            <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 space-y-2">
              <h4 className="font-bold text-stone-700 uppercase text-[11px]">How To Access Standalone Terminal</h4>
              <p>Bookmark this private URL on your phone or kitchen display:</p>
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-stone-200 font-mono text-orange-700 text-[11px] select-all break-all shadow-2xs">
                {window.location.origin}/?portal=staff
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reject Scam Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-stone-200 shadow-2xl rounded-2xl max-w-md w-full p-6 space-y-4 text-stone-900">
            <h3 className="text-lg font-bold font-display text-stone-900">Flag &amp; Reject Scam</h3>
            <p className="text-xs text-stone-500">
              Provide reason for rejecting order <span className="font-mono font-bold text-stone-800">{showRejectModal}</span>. This will be logged in the security audit trail.
            </p>
            <input
              type="text"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate reference # detected, or funds not received in Zelle"
              className="w-full px-3.5 py-2.5 text-xs border border-stone-200 bg-stone-50 text-stone-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectFraud(showRejectModal)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Confirm Scam Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    
      {/* Clear Orders Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900 font-display">Clear Daily Shift &amp; Reset Ledger?</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                This will wipe all active and completed customer orders for the day, reset total revenue to $0.00, and synchronize across all kitchen staff terminals worldwide.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await clearAllOrders();
                  setSelectedOrder(null);
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Yes, Clear All Orders &amp; Reset
              </button>
            </div>
          </div>
        </div>
      )}
</div>
  );
};
