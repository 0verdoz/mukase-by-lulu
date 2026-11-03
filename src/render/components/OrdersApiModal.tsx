import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Globe, ArrowRight } from 'lucide-react';
import { KitchenOrder } from '../mukaseData';

interface OrdersApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: KitchenOrder[];
}

export const OrdersApiModal: React.FC<OrdersApiModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<'rest' | 'ws'>('rest');

  if (!isOpen) return null;

  const jsonPayload = JSON.stringify(
    {
      status: 'success',
      timestamp: new Date().toISOString(),
      engine: 'Mukase Sync Engine v2.4.1',
      totalActiveOrders: orders.filter((o) => o.status !== 'dispatched').length,
      orders: orders,
    },
    null,
    2
  );

  const curlCommand = `curl -X GET "https://api.mukase.kitchen/v1/orders/active" \\
  -H "Authorization: Bearer mk_live_sync_key" \\
  -H "Accept: application/json"`;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700">
              <Code2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Active Orders API Endpoint
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Storefront & KDS Real-Time Payload Specification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('rest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'rest'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            REST API (GET /active)
          </button>
          <button
            onClick={() => setActiveTab('ws')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeTab === 'ws'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            WebSocket Event Feed (WSS)
          </button>
        </div>

        {activeTab === 'rest' ? (
          <div className="space-y-4">
            {/* cURL bar */}
            <div className="rounded-xl bg-stone-900 p-3 text-stone-200 font-mono text-xs relative group">
              <div className="flex items-center justify-between text-[11px] text-stone-400 pb-1.5 mb-1.5 border-b border-stone-800">
                <span className="flex items-center gap-1.5">
                  <Terminal className="h-3 w-3 text-orange-400" />
                  cURL Request
                </span>
                <button
                  onClick={handleCopyCurl}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                >
                  {copiedCurl ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedCurl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-orange-300 text-[11px] whitespace-pre-wrap break-all">
                {curlCommand}
              </pre>
            </div>

            {/* JSON Response preview */}
            <div className="rounded-xl border border-stone-200 bg-stone-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-stone-200 bg-stone-100/70 text-xs font-mono">
                <span className="font-semibold text-stone-700">HTTP/1.1 200 OK · application/json</span>
                <button
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors text-[11px] font-medium cursor-pointer"
                >
                  {copiedJson ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedJson ? 'Copied JSON' : 'Copy Response'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono text-stone-800 leading-relaxed max-h-64 overflow-y-auto">
                {jsonPayload}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800">
              <div className="font-bold text-stone-900 mb-1">
                wss://stream.mukase.kitchen/v1/kitchen-bridge
              </div>
              <p className="text-[11px] text-stone-500 font-sans">
                Real-time two-way duplex connection between customer touchpoints and chef dispatch screens.
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-orange-700 font-bold text-[11px] block">
                  EVENT: order.created
                </span>
                <span className="text-stone-600 text-[11px] font-sans">
                  Fired when customer submits an order on web/mobile storefront.
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-stone-200 bg-white">
                <span className="text-emerald-700 font-bold text-[11px] block">
                  EVENT: order.status_updated
                </span>
                <span className="text-stone-600 text-[11px] font-sans">
                  Fired when kitchen chef advances status (cooking -&gt; ready on pass -&gt; dispatched).
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
