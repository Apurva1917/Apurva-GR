import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Bike, Store } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  deliveryType: 'pickup' | 'delivery';
  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  deliveryType,
  setDeliveryType,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const packagingFee = items.length > 0 ? 10 : 0; // eco-friendly food packaging
  const deliveryFee = deliveryType === 'delivery' ? (subtotal > 0 ? 25 : 0) : 0;
  const total = subtotal + packagingFee + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-stone-900">
                Your Homemade Basket
              </h2>
              <p className="text-xs text-stone-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} freshly selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fulfillment Option (Pickup or Delivery) */}
        <div className="p-3 bg-amber-50/70 border-b border-amber-200/60">
          <p className="text-xs font-semibold text-amber-900 mb-2">
            Choose Delivery or Self-Pickup:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDeliveryType('delivery')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                deliveryType === 'delivery'
                  ? 'border-orange-500 bg-white shadow-xs text-orange-950 font-bold'
                  : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-white'
              }`}
            >
              <Bike className={`w-4 h-4 ${deliveryType === 'delivery' ? 'text-orange-600' : 'text-stone-400'}`} />
              <div>
                <div className="text-xs font-bold leading-tight">Hyperlocal Delivery</div>
                <div className="text-[10px] text-stone-500">₹25 • in 30-45m</div>
              </div>
            </button>

            <button
              onClick={() => setDeliveryType('pickup')}
              className={`p-2.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                deliveryType === 'pickup'
                  ? 'border-orange-500 bg-white shadow-xs text-orange-950 font-bold'
                  : 'border-stone-200 bg-stone-50/70 text-stone-600 hover:bg-white'
              }`}
            >
              <Store className={`w-4 h-4 ${deliveryType === 'pickup' ? 'text-orange-600' : 'text-stone-400'}`} />
              <div>
                <div className="text-xs font-bold leading-tight">Kitchen Pickup</div>
                <div className="text-[10px] text-emerald-600 font-semibold">Free • direct from cook</div>
              </div>
            </button>
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300 mb-3" />
              <p className="font-heading font-bold text-stone-700">Your basket is empty</p>
              <p className="text-xs mt-1 text-stone-500 max-w-xs mx-auto">
                Explore freshly prepared Chakali, Tomato Chutney, and Pickles from nearby home cooks!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-stone-900 truncate">
                    {item.product.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate">
                    {item.product.sellerName} • {item.product.weight}
                  </p>
                  <p className="text-xs font-extrabold text-stone-900 mt-1">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-xl p-1 shadow-xs">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) {
                        onRemoveItem(item.product.id);
                      } else {
                        onUpdateQuantity(item.product.id, -1);
                      }
                    }}
                    className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
                  >
                    {item.quantity === 1 ? <Trash2 className="w-3.5 h-3.5 text-rose-600" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="w-5 text-center text-xs font-bold text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                    disabled={item.quantity >= item.product.quantityRemaining}
                    className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 disabled:opacity-40 flex items-center justify-center text-stone-700 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout */}
        {items.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-medium text-stone-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Eco-friendly Home Packaging</span>
                <span className="font-medium text-stone-900">₹{packagingFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Fulfillment ({deliveryType === 'delivery' ? 'Hyperlocal Delivery' : 'Self Pickup'})</span>
                <span className="font-medium text-stone-900">
                  {deliveryFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-100 flex justify-between text-base font-heading font-extrabold text-stone-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{total}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
