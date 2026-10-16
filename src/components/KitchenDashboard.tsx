import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Clock, ChefHat, Bike, DollarSign, Filter, RefreshCw, XCircle, Volume2, ArrowLeft } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { Order, OrderStatus } from '../types';

export const KitchenDashboard: React.FC = () => {
  const { orders, updateOrderStatus, setCurrentView, submitPaymentProof } = useOrder();
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

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
  };

  const handleRejectFraud = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', `Scam flagged: ${rejectReason || 'Fake receipt or unverified memo'}`);
    setShowRejectModal(null);
    setRejectReason('');
  };

  return (
    <div className="py-8 sm:py-12 bg-stone-100 min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Bar with back to menu */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-300">
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('menu')}
                className="p-1 text-stone-500 hover:text-stone-900 transition-colors"
                title="Back to Customer Menu"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold font-display text-stone-900">
                Chef Lulu’s Kitchen & Verification Hub
              </h1>
            </div>
            <p className="text-xs text-stone-500 ml-7">
              Live incoming message threads, automated fraud check, and dispatch coordination.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Anti-Fraud Protocol Active</span>
            </span>

            <button
              onClick={() => setCurrentView('menu')}
              className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Customer View
            </button>
          </div>
        </div>

        {/* Staff KPI Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-stone-500 block">Today’s Orders</span>
            <span className="text-2xl font-bold text-stone-900 tabular-nums">{orders.length}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-stone-500 block">Gross Sales</span>
            <span className="text-2xl font-bold text-amber-800 tabular-nums">${totalRevenue.toFixed(2)}</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-stone-500 block">Pending Verification</span>
            <span className={`text-2xl font-bold tabular-nums ${pendingCount > 0 ? 'text-amber-600' : 'text-stone-900'}`}>
              {pendingCount}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-medium text-stone-500 block">Kitchen Active / In Transit</span>
            <span className="text-2xl font-bold text-stone-900 tabular-nums">
              {cookingCount} prep · {deliveryCount} rider
            </span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-stone-200/80 rounded-xl">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'pending_payment', label: `Awaiting Verification (${pendingCount})` },
            { id: 'preparing_in_kitchen', label: `In Kitchen Cooking (${cookingCount})` },
            { id: 'out_for_delivery', label: `Out on Delivery (${deliveryCount})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filterStatus === tab.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Orders Table & Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Order List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col max-h-[700px]">
            <div className="p-3.5 border-b border-stone-200 bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-600">
              Incoming Orders & Threads
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
                        isSelected ? 'bg-amber-50/80 border-l-4 border-amber-600' : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                          <span className="text-[11px] font-semibold text-stone-500 uppercase">
                            via {order.channel}
                          </span>
                        </div>
                        <span className="text-sm font-bold tabular-nums text-stone-900">
                          ${order.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-stone-600 mt-1">
                        <span>{order.customer.name} ({order.customer.city})</span>
                        <span className="text-stone-400">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Anti-fraud tag */}
                      <div className="mt-2 flex items-center gap-2">
                        {order.paymentProof?.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3" /> Memo Verified
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3" /> Needs Verification
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-stone-500">
                            Status: {order.status.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Selected Order Detailed Fraud Inspector & Status Controls (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-6">
            {!selectedOrder ? (
              <div className="text-center py-16 text-stone-400 text-sm">
                Select an order from the left column to inspect verification proof.
              </div>
            ) : (
              <>
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold font-mono text-stone-900">
                        {selectedOrder.id}
                      </h2>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 uppercase">
                        {selectedOrder.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Customer: <strong>{selectedOrder.customer.name}</strong> · Phone: {selectedOrder.customer.phone}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Order Total</span>
                    <span className="text-2xl font-bold text-amber-800 tabular-nums">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Anti-Fraud Security Check Card */}
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                        Anti-Scam Proof Inspection
                      </h3>
                    </div>
                    <span className="text-[11px] font-medium text-stone-500">
                      Payment via {selectedOrder.customer.preferredPayment.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Expected Memo</span>
                      <span className="font-mono font-bold text-stone-900">{selectedOrder.id}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Memo Status</span>
                      <span className={`font-semibold ${selectedOrder.paymentProof?.memoMatched ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {selectedOrder.paymentProof?.memoMatched ? '✅ Exact Match' : '⏳ Awaiting Proof'}
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase">Duplicate Tx Check</span>
                      <span className={`font-semibold ${selectedOrder.paymentProof?.duplicateDetected ? 'text-red-600 font-bold' : 'text-emerald-700'}`}>
                        {selectedOrder.paymentProof?.duplicateDetected ? '🚨 REPLAY FRAUD' : '🛡️ Unique Code'}
                      </span>
                    </div>
                  </div>

                  {selectedOrder.paymentProof?.verificationNotes && (
                    <div className="text-xs p-2 bg-white rounded-lg border border-stone-200 text-stone-600">
                      <strong>Audit Log:</strong> {selectedOrder.paymentProof.verificationNotes}
                    </div>
                  )}

                  {/* Manual Quick Verify if customer sent payment outside app */}
                  {selectedOrder.status === 'pending_payment' && (
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleApprovePayment(selectedOrder.id)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Staff Confirm: Payment Verified in Bank App</span>
                      </button>

                      <button
                        onClick={() => setShowRejectModal(selectedOrder.id)}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Flag / Reject Scam
                      </button>
                    </div>
                  )}
                </div>

                {/* Workflow Status Controls */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Kitchen Progress Transition
                  </h4>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'preparing_in_kitchen')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedOrder.status === 'preparing_in_kitchen'
                          ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      <ChefHat className="w-3.5 h-3.5" />
                      <span>1. Cooking in Mukase</span>
                    </button>

                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'out_for_delivery')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedOrder.status === 'out_for_delivery'
                          ? 'bg-amber-600 text-white ring-2 ring-amber-300'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>2. Dispatched to Rider Kwame</span>
                    </button>

                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        selectedOrder.status === 'delivered'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>3. Marked Delivered</span>
                    </button>
                  </div>
                </div>

                {/* Items & Customizations Breakdown */}
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Dishes To Prepare ({selectedOrder.items.length})
                  </h4>

                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-stone-900 text-sm">
                          <span>{item.quantity}x {item.menuItem.name}</span>
                          <span className="tabular-nums">${item.itemTotalPrice.toFixed(2)}</span>
                        </div>
                        {item.customization && (
                          <div className="text-stone-600 space-y-0.5">
                            {item.customization.protein && (
                              <p><span className="font-semibold text-stone-800">Protein:</span> {item.customization.protein}</p>
                            )}
                            <p><span className="font-semibold text-stone-800">Spice:</span> {item.customization.spiceLevel}</p>
                            {item.customization.selectedAddOns.length > 0 && (
                              <p><span className="font-semibold text-stone-800">Add-ons:</span> {item.customization.selectedAddOns.map(a => a.name).join(', ')}</p>
                            )}
                            {item.customization.specialInstructions && (
                              <p className="text-amber-900 bg-amber-100/50 p-1.5 rounded mt-1">
                                <strong>Kitchen note:</strong> "{item.customization.specialInstructions}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address & Notes */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
                  <p>
                    <strong>Address:</strong> {selectedOrder.customer.address}
                    {selectedOrder.customer.apartmentSuite ? `, Apt ${selectedOrder.customer.apartmentSuite}` : ''}, {selectedOrder.customer.city}
                  </p>
                  {selectedOrder.customer.deliveryNotes && (
                    <p><strong>Customer Instructions:</strong> {selectedOrder.customer.deliveryNotes}</p>
                  )}
                </div>

              </>
            )}
          </div>

        </div>

      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Flag Suspicious Transaction</h3>
            <p className="text-xs text-stone-600">
              Provide reason for flagging order {showRejectModal}. Customer will see this explanation.
            </p>
            <input
              type="text"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Duplicate reference # detected, or funds not received in Zelle"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="px-3 py-1.5 text-xs text-stone-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectFraud(showRejectModal)}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
