import React, { useState } from 'react';
import { 
  PlusCircle, 
  Flame, 
  Camera, 
  RefreshCw, 
  Boxes, 
  ShoppingBag, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Product, PrepStatus, Order, Seller } from '../types';

interface SellerDashboardPageProps {
  seller: Seller;
  products: Product[];
  orders: Order[];
  onOpenAddProduct: () => void;
  onOpenUpdatePrep: () => void;
  onUpdateProductQuantity: (productId: string, delta: number) => void;
  onQuickUpdateStatus: (productId: string, newStatus: PrepStatus) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onSelectProduct: (product: Product) => void;
}

const PREP_STATUSES: PrepStatus[] = [
  'Preparing ingredients',
  'Cooking',
  'Cooling',
  'Packing',
  'Ready',
];

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  seller,
  products,
  orders,
  onOpenAddProduct,
  onOpenUpdatePrep,
  onUpdateProductQuantity,
  onQuickUpdateStatus,
  onUpdateOrderStatus,
  onSelectProduct,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'inventory' | 'orders'>('overview');
  const [quickStatusModalProduct, setQuickStatusModalProduct] = useState<Product | null>(null);

  const sellerProducts = products.filter((p) => p.sellerId === seller.id || p.sellerName === seller.name);

  // Active cooking dishes
  const activeCookingProducts = sellerProducts.filter(
    (p) => p.preparationStatus !== 'Ready' && p.preparationStatus !== 'Prepared Today'
  );

  return (
    <div className="pb-28 max-w-md mx-auto sm:max-w-3xl lg:max-w-5xl px-4 pt-2 space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-stone-900 to-stone-800 text-white p-5 rounded-3xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={seller.avatar}
              alt={seller.cookName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-orange-500"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-extrabold text-lg text-white">
                  {seller.name}
                </h1>
                <span className="text-[10px] font-bold bg-orange-600 text-white px-2 py-0.5 rounded-full">
                  Seller Hub
                </span>
              </div>
              <p className="text-xs text-stone-300">
                Cook: <strong className="text-white">{seller.cookName}</strong> • {seller.location.split(',')[0]}
              </p>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-stone-700/80 text-center">
          <div className="p-2 rounded-xl bg-stone-800/80">
            <span className="text-xs text-stone-400 block">Active Dishes</span>
            <span className="font-heading font-bold text-base text-white">{sellerProducts.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-800/80">
            <span className="text-xs text-stone-400 block">Orders Today</span>
            <span className="font-heading font-bold text-base text-emerald-400">{orders.length}</span>
          </div>
          <div className="p-2 rounded-xl bg-stone-800/80">
            <span className="text-xs text-stone-400 block">Kitchen Rating</span>
            <span className="font-heading font-bold text-base text-amber-400">★ {seller.rating}</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD ACTION BUTTONS matching exact user prompt requirements:
          - Add Product
          - Start Preparation
          - Upload Preparation Photo
          - Update Preparation Status
          - Manage Inventory
          - View Orders
      */}
      <div>
        <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-stone-500 mb-2.5">
          Kitchen Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {/* Button 1: Add Product */}
          <button
            onClick={onOpenAddProduct}
            className="p-3.5 rounded-2xl bg-white hover:bg-orange-50/60 border border-stone-200/90 hover:border-orange-300 shadow-2xs flex flex-col items-start gap-2 text-left group transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                Add Product
              </span>
              <span className="text-[11px] text-stone-500">
                With Gemini AI listing helper
              </span>
            </div>
          </button>

          {/* Button 2: Start Preparation */}
          <button
            onClick={() => {
              if (sellerProducts.length > 0) {
                onQuickUpdateStatus(sellerProducts[0].id, 'Preparing ingredients');
                alert(`Started new preparation batch for "${sellerProducts[0].name}"! Status set to Preparing Ingredients.`);
              } else {
                onOpenAddProduct();
              }
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-emerald-50/60 border border-stone-200/90 hover:border-emerald-300 shadow-2xs flex flex-col items-start gap-2 text-left group transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-5 h-5 fill-emerald-600" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                Start Preparation
              </span>
              <span className="text-[11px] text-stone-500">
                Kick off a new batch today
              </span>
            </div>
          </button>

          {/* Button 3: Upload Preparation Photo */}
          <button
            onClick={onOpenUpdatePrep}
            className="p-3.5 rounded-2xl bg-white hover:bg-amber-50/60 border border-stone-200/90 hover:border-amber-300 shadow-2xs flex flex-col items-start gap-2 text-left group transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                Upload Prep Photo
              </span>
              <span className="text-[11px] text-stone-500">
                Add live step image to timeline
              </span>
            </div>
          </button>

          {/* Button 4: Update Preparation Status */}
          <button
            onClick={() => {
              if (sellerProducts.length > 0) {
                setQuickStatusModalProduct(sellerProducts[0]);
              }
            }}
            className="p-3.5 rounded-2xl bg-white hover:bg-blue-50/60 border border-stone-200/90 hover:border-blue-300 shadow-2xs flex flex-col items-start gap-2 text-left group transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                Update Status
              </span>
              <span className="text-[11px] text-stone-500">
                Cooking, Cooling, Packing...
              </span>
            </div>
          </button>

          {/* Button 5: Manage Inventory */}
          <button
            onClick={() => setActiveSection('inventory')}
            className={`p-3.5 rounded-2xl border shadow-2xs flex flex-col items-start gap-2 text-left group transition-all ${
              activeSection === 'inventory'
                ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                : 'bg-white hover:bg-stone-50 border-stone-200/90'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                Manage Inventory
              </span>
              <span className="text-[11px] text-stone-500">
                Adjust available pack counts
              </span>
            </div>
          </button>

          {/* Button 6: View Orders */}
          <button
            onClick={() => setActiveSection('orders')}
            className={`p-3.5 rounded-2xl border shadow-2xs flex flex-col items-start gap-2 text-left group transition-all ${
              activeSection === 'orders'
                ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                : 'bg-white hover:bg-stone-50 border-stone-200/90'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform relative">
              <ShoppingBag className="w-5 h-5" />
              {orders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {orders.length}
                </span>
              )}
            </div>
            <div>
              <span className="font-heading font-bold text-xs sm:text-sm text-stone-900 block">
                View Orders
              </span>
              <span className="text-[11px] text-stone-500">
                {orders.length} customer {orders.length === 1 ? 'order' : 'orders'} placed
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* SECTION TABS FOR SELLER VIEW */}
      <div className="flex border-b border-stone-200 text-xs font-bold">
        <button
          onClick={() => setActiveSection('overview')}
          className={`pb-2.5 px-3 transition-colors border-b-2 ${
            activeSection === 'overview'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Live Kitchen Transparency ({sellerProducts.length})
        </button>
        <button
          onClick={() => setActiveSection('inventory')}
          className={`pb-2.5 px-3 transition-colors border-b-2 ${
            activeSection === 'inventory'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Inventory & Packs
        </button>
        <button
          onClick={() => setActiveSection('orders')}
          className={`pb-2.5 px-3 transition-colors border-b-2 ${
            activeSection === 'orders'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          Incoming Orders ({orders.length})
        </button>
      </div>

      {/* OVERVIEW / LIVE PREPARATION MANAGEMENT */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-stone-900">
                Live Dishes in Kitchen
              </h3>
              <p className="text-xs text-stone-500">
                Click any dish to update its status or upload photo proof
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {sellerProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl p-4 border border-stone-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <span className="text-xs font-bold text-stone-900">
                        ₹{product.price} <span className="text-[10px] text-stone-400">/ {product.weight}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900">
                        Status: {product.preparationStatus}
                      </span>
                      <span className="text-xs text-stone-500">
                        {product.quantityRemaining} packs remaining
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live Steps Quick Stepper */}
                <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/60">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-stone-700">Quick Status Advance:</span>
                    <button
                      onClick={() => setQuickStatusModalProduct(product)}
                      className="text-orange-600 font-bold hover:underline"
                    >
                      Change Status
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1">
                    {PREP_STATUSES.map((st, i) => {
                      const isCurrent = product.preparationStatus === st;
                      return (
                        <button
                          key={st}
                          onClick={() => onQuickUpdateStatus(product.id, st)}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                            isCurrent
                              ? 'bg-orange-600 text-white shadow-xs scale-105'
                              : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Peek */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-stone-500">
                    {product.timeline.length} preparation photos logged today
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={onOpenUpdatePrep}
                      className="px-3 py-1 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold transition-colors flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5 text-stone-600" />
                      <span>Add Step Photo</span>
                    </button>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3 py-1 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold transition-colors"
                    >
                      View Live Page →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INVENTORY MANAGEMENT */}
      {activeSection === 'inventory' && (
        <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-stone-900">
                Manage Available Inventory
              </h3>
              <p className="text-xs text-stone-500">
                Increase or decrease packs remaining as you prepare or sell
              </p>
            </div>
            <button
              onClick={onOpenAddProduct}
              className="px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-xs hover:bg-orange-700 transition-colors"
            >
              + Add Dish
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {sellerProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{p.name}</h4>
                    <span className="text-xs text-stone-500">₹{p.price} • {p.weight}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateProductQuantity(p.id, -1)}
                    disabled={p.quantityRemaining <= 0}
                    className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 disabled:opacity-30 flex items-center justify-center font-bold text-stone-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-extrabold text-sm text-stone-900">
                    {p.quantityRemaining}
                  </span>
                  <button
                    onClick={() => onUpdateProductQuantity(p.id, 1)}
                    className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDERS MANAGEMENT */}
      {activeSection === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-extrabold text-base text-stone-900">
                Customer Orders for {seller.name}
              </h3>
              <p className="text-xs text-stone-500">
                {orders.length} orders received from neighborhood customers
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
              <p className="font-bold text-sm text-stone-700">No active customer orders yet</p>
              <p className="text-xs text-stone-400 mt-1">Orders placed by customers will appear here in real time.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-orange-600">
                      Order #{order.orderNumber}
                    </span>
                    <h4 className="font-heading font-bold text-base text-stone-900">
                      {order.customerName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Phone: <span className="font-medium text-stone-800">{order.customerPhone}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
                      {order.status}
                    </span>
                    <p className="text-xs font-bold text-stone-900 mt-1">
                      ₹{order.total} • {order.paymentMethod}
                    </p>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="space-y-1.5">
                  <span className="text-[11px] uppercase font-bold text-stone-400">Items Ordered:</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-stone-700">
                      <span>{item.quantity}x {item.product.name} ({item.product.weight})</span>
                      <span className="font-semibold">₹{item.product.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <strong>Fulfillment: </strong>
                  {order.deliveryType === 'delivery' ? `Delivery to: ${order.deliveryAddress}` : 'Self-Pickup at Kitchen'}
                </div>

                {/* Order Status Controller for Seller */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-700">Update Order State:</span>
                  <div className="flex gap-1.5">
                    {['Preparing', 'Packing', 'Ready for Pickup', 'Delivered'].map((st) => (
                      <button
                        key={st}
                        onClick={() => onUpdateOrderStatus(order.id, st as any)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                          order.status === st
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* QUICK STATUS UPDATE POPUP */}
      {quickStatusModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl">
            <h3 className="font-heading font-bold text-base text-stone-900">
              Update Status for {quickStatusModalProduct.name}
            </h3>
            <p className="text-xs text-stone-500">
              Choose the current stage in your home kitchen:
            </p>
            <div className="space-y-2">
              {PREP_STATUSES.map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    onQuickUpdateStatus(quickStatusModalProduct.id, st);
                    setQuickStatusModalProduct(null);
                  }}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left border flex items-center justify-between ${
                    quickStatusModalProduct.preparationStatus === st
                      ? 'border-orange-500 bg-orange-50 text-orange-950'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-800'
                  }`}
                >
                  <span>{st}</span>
                  {quickStatusModalProduct.preparationStatus === st && (
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setQuickStatusModalProduct(null)}
              className="w-full py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
