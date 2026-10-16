import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Clock, ChefHat, Bike, 
  DollarSign, Filter, RefreshCw, XCircle, Volume2, VolumeX, LogOut, 
  Lock, Copy, Check, ExternalLink, Settings, History, Phone, MessageSquare 
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { Order, OrderStatus } from '../types';
import { StaffSession, clearStaffSession, getSecurityLogs, setCustomStaffPin, getActiveStaffPin } from '../utils/staffAuth';
import { getWhatsAppUrl, getSmsUrl } from '../utils/checkout';

interface Props {
  session: StaffSession;
  onExit: () => void;
}

export const StandaloneStaffPortal: React.FC<Props> = ({ session, onExit }) => {
  const { orders, updateOrderStatus, submitPaymentProof } = useOrder();
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [activeTab, setActiveTab] = useState<'orders' | 'logs' | 'settings'>('orders');
  const [copiedLink, setCopiedLink] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

  const filteredOrders = orders.filter(o => {
    if (filterStatus === 'all') return true;
    return o.status === filterStatus;
  });

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
    const staffUrl = `${window.location.origin}${window.location.pathname}?portal=staff`;
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      
      {/* Standalone Terminal Header */}
      <header className="sticky top-0 z-30 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-600/30">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold font-display text-white tracking-tight">
                  Mukase Kitchen Terminal
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  STAFF ISOLATED
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Logged in: <strong className="text-stone-300">{session.staffName}</strong> · Auth Token Valid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Copy Secret Staff URL */}
            <button
              onClick={handleCopyStaffUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-medium border border-stone-700 transition-colors"
              title="Copy Standalone Staff Link to bookmark on kitchen iPad or phone"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Private Link Copied!' : 'Copy Staff Link'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs border border-stone-700 transition-colors"
              title={soundEnabled ? 'Mute Kitchen Chimes' : 'Unmute Kitchen Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>

            {/* Lock / Log Out */}
            <button
              onClick={() => {
                clearStaffSession();
                onExit();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Terminal</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Navigation Tabs (Orders, Security Audit Logs, Terminal Settings) */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              Kitchen Dispatch & Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Security Audit Trail</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white hover:bg-stone-900'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Security Settings</span>
            </button>
          </div>

          <div className="text-xs text-stone-500 hidden sm:block font-mono">
            Direct Staff Route: <span className="text-stone-400">?portal=staff</span>
          </div>
        </div>

        {/* View 1: Active Orders & Dispatch */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block font-medium">Today's Total Orders</span>
                <span className="text-2xl font-bold font-display text-white tabular-nums">{orders.length}</span>
              </div>

              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block font-medium">Revenue</span>
                <span className="text-2xl font-bold font-display text-amber-500 tabular-nums">${totalRevenue.toFixed(2)}</span>
              </div>

              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block font-medium">Pending Memo Proof</span>
                <span className={`text-2xl font-bold font-display tabular-nums ${pendingCount > 0 ? 'text-amber-400' : 'text-stone-300'}`}>
                  {pendingCount}
                </span>
              </div>

              <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 space-y-1">
                <span className="text-xs text-stone-400 block font-medium">In Kitchen / In Transit</span>
                <span className="text-2xl font-bold font-display text-emerald-400 tabular-nums">
                  {cookingCount} prep · {deliveryCount} rider
                </span>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-900 rounded-xl border border-stone-800">
              {[
                { id: 'all', label: `All Orders (${orders.length})` },
                { id: 'pending_payment', label: `Awaiting Verification (${pendingCount})` },
                { id: 'preparing_in_kitchen', label: `Cooking in Mukase (${cookingCount})` },
                { id: 'out_for_delivery', label: `With Courier Kwame (${deliveryCount})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    filterStatus === tab.id
                      ? 'bg-amber-600 text-white'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Split Screen Table & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Order List */}
              <div className="lg:col-span-5 bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden flex flex-col max-h-[640px]">
                <div className="p-3.5 border-b border-stone-800 bg-stone-900/60 text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>Customer Message Threads</span>
                  <span className="text-[11px] font-normal text-stone-500">Live Sync</span>
                </div>

                <div className="divide-y divide-stone-800/80 overflow-y-auto flex-1">
                  {filteredOrders.length === 0 ? (
                    <div className="p-8 text-center text-xs text-stone-500">
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
                              ? 'bg-amber-950/40 border-l-4 border-amber-500'
                              : 'hover:bg-stone-850'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-white">{order.id}</span>
                              <span className="text-[10px] font-semibold text-stone-400 uppercase bg-stone-800 px-1.5 py-0.5 rounded">
                                {order.channel}
                              </span>
                            </div>
                            <span className="text-sm font-bold tabular-nums text-white">
                              ${order.total.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
                            <span className="text-stone-300">{order.customer.name} ({order.customer.city})</span>
                            <span className="text-stone-500 font-mono text-[11px]">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            {order.paymentProof?.isVerified ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
                                <ShieldCheck className="w-3 h-3" /> Memo Matched
                              </span>
                            ) : isPending ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/50 border border-amber-800 px-2 py-0.5 rounded">
                                <Clock className="w-3 h-3" /> Awaiting Proof
                              </span>
                            ) : (
                              <span className="text-[11px] font-medium text-stone-400">
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
              <div className="lg:col-span-7 bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-6">
                {!selectedOrder ? (
                  <div className="text-center py-16 text-stone-500 text-sm">
                    Select an order from the list to review verification details.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-800">
                      <div>
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-bold font-mono text-white">
                            {selectedOrder.id}
                          </h2>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-800 text-stone-300 uppercase">
                            {selectedOrder.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 mt-1">
                          Customer: <strong className="text-stone-200">{selectedOrder.customer.name}</strong> · Phone: {selectedOrder.customer.phone}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-stone-500 block">Total Due</span>
                        <span className="text-2xl font-bold text-amber-500 tabular-nums">
                          ${selectedOrder.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Anti-Scam Inspector Box */}
                    <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                            Anti-Fraud Payment Inspection
                          </h3>
                        </div>
                        <span className="text-xs text-stone-400">
                          {selectedOrder.customer.preferredPayment.toUpperCase()}: {selectedOrder.customer.paymentIdentifier}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 text-xs">
                        <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                          <span className="text-[10px] text-stone-500 block uppercase">Required Memo</span>
                          <span className="font-mono font-bold text-amber-400">{selectedOrder.id}</span>
                        </div>

                        <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                          <span className="text-[10px] text-stone-500 block uppercase">Memo Status</span>
                          <span className={`font-semibold ${selectedOrder.paymentProof?.memoMatched ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {selectedOrder.paymentProof?.memoMatched ? '✅ Verified' : '⏳ Pending'}
                          </span>
                        </div>

                        <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                          <span className="text-[10px] text-stone-500 block uppercase">Replay / Dup Check</span>
                          <span className={`font-semibold ${selectedOrder.paymentProof?.duplicateDetected ? 'text-red-400 font-bold' : 'text-emerald-400'}`}>
                            {selectedOrder.paymentProof?.duplicateDetected ? '🚨 REUSED ID' : '🛡️ Unique Tx'}
                          </span>
                        </div>
                      </div>

                      {selectedOrder.paymentProof?.verificationNotes && (
                        <div className="text-xs p-2.5 bg-stone-900 rounded-xl border border-stone-800 text-stone-300 font-mono text-[11px]">
                          Audit Log: {selectedOrder.paymentProof.verificationNotes}
                        </div>
                      )}

                      {/* Approval Actions */}
                      {selectedOrder.status === 'pending_payment' && (
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => handleApprovePayment(selectedOrder.id)}
                            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm Payment & Start Cooking</span>
                          </button>

                          <button
                            onClick={() => setShowRejectModal(selectedOrder.id)}
                            className="py-2.5 px-3 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800 rounded-xl text-xs font-semibold transition-colors"
                          >
                            Reject Scam
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Progress Progression */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Kitchen Progression
                      </h4>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'preparing_in_kitchen')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            selectedOrder.status === 'preparing_in_kitchen'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                          }`}
                        >
                          <ChefHat className="w-3.5 h-3.5" />
                          <span>1. Cooking in Mukase</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'out_for_delivery')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            selectedOrder.status === 'out_for_delivery'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                          }`}
                        >
                          <Bike className="w-3.5 h-3.5" />
                          <span>2. Dispatched to Courier Kwame</span>
                        </button>

                        <button
                          onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            selectedOrder.status === 'delivered'
                              ? 'bg-emerald-600 text-stone-950'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>3. Delivered</span>
                        </button>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    <div className="space-y-2 pt-2 border-t border-stone-800">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                        Ordered Dishes ({selectedOrder.items.length})
                      </h4>

                      <div className="space-y-2">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs space-y-1">
                            <div className="flex justify-between font-bold text-white text-sm">
                              <span>{item.quantity}x {item.menuItem.name}</span>
                              <span className="tabular-nums text-amber-400">${item.itemTotalPrice.toFixed(2)}</span>
                            </div>
                            {item.customization && (
                              <div className="text-stone-400 space-y-0.5">
                                {item.customization.protein && (
                                  <p><span className="text-stone-300">Protein:</span> {item.customization.protein}</p>
                                )}
                                <p><span className="text-stone-300">Spice Heat:</span> {item.customization.spiceLevel}</p>
                                {item.customization.selectedAddOns.length > 0 && (
                                  <p><span className="text-stone-300">Add-ons:</span> {item.customization.selectedAddOns.map(a => a.name).join(', ')}</p>
                                )}
                                {item.customization.specialInstructions && (
                                  <p className="text-amber-300 bg-amber-950/40 p-1.5 rounded mt-1 border border-amber-900/50">
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
                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1">
                      <p>
                        <strong>Address:</strong> {selectedOrder.customer.address}
                        {selectedOrder.customer.apartmentSuite ? `, Apt ${selectedOrder.customer.apartmentSuite}` : ''}, {selectedOrder.customer.city}
                      </p>
                      {selectedOrder.customer.deliveryNotes && (
                        <p className="text-stone-400">
                          <strong>Driver Note:</strong> "{selectedOrder.customer.deliveryNotes}"
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
          <div className="bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-white">Cryptographic Security Audit Log</h3>
                <p className="text-xs text-stone-400">Records all terminal authentications, failed entries, and anti-fraud actions.</p>
              </div>
            </div>

            <div className="divide-y divide-stone-800 border border-stone-800 rounded-xl overflow-hidden font-mono text-xs">
              {securityLogs.length === 0 ? (
                <div className="p-4 text-stone-500">No security events recorded yet.</div>
              ) : (
                securityLogs.map(log => (
                  <div key={log.id} className="p-3 flex items-start justify-between gap-4 bg-stone-950 hover:bg-stone-900 transition-colors">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.action === 'LOGIN_SUCCESS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        log.action === 'LOCKOUT_TRIGGERED' ? 'bg-red-950 text-red-300 border border-red-800' :
                        'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {log.action}
                      </span>
                      <p className="text-stone-300 text-xs mt-1 font-sans">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-stone-500 shrink-0">
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
          <div className="max-w-xl bg-stone-900 rounded-2xl border border-stone-800 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold font-display text-white">Staff Terminal Security Settings</h3>
              <p className="text-xs text-stone-400">Change master kitchen passcode and configure staff protection.</p>
            </div>

            <form onSubmit={handleUpdatePin} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Change Master Kitchen PIN (4 to 6 digits)
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="Enter new numeric PIN"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Current active PIN is: <span className="font-mono text-stone-400">****</span>
                </p>
              </div>

              {pinFeedback && (
                <p className={`text-xs p-3 rounded-xl border ${
                  pinFeedback.startsWith('Error')
                    ? 'bg-red-950/60 border-red-800 text-red-300'
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                }`}>
                  {pinFeedback}
                </p>
              )}

              <button
                type="submit"
                disabled={!newPin}
                className="py-2.5 px-5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl transition-colors disabled:opacity-40"
              >
                Update Staff PIN
              </button>
            </form>

            <div className="pt-4 border-t border-stone-800 text-xs text-stone-400 space-y-2">
              <h4 className="font-bold text-white uppercase text-[11px]">How To Access Standalone Terminal</h4>
              <p>Bookmark this private URL on your phone or kitchen display:</p>
              <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 font-mono text-amber-300 text-[11px] select-all break-all">
                {window.location.origin}/?portal=staff
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-display">Flag & Reject Scam</h3>
            <p className="text-xs text-stone-400">
              Provide reason for rejecting order {showRejectModal}. This will be logged in the security audit trail.
            </p>
            <input
              type="text"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate reference # detected, or funds not received in Zelle"
              className="w-full px-3 py-2 text-xs border border-stone-700 bg-stone-950 text-white rounded-xl focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-3 py-1.5 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectFraud(showRejectModal)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Scam Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
