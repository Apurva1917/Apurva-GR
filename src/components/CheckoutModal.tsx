import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Phone, User as UserIcon, Bike, Store, QrCode, Banknote } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery';
  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  deliveryType,
  setDeliveryType,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('Aarav Sharma');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [address, setAddress] = useState('Flat 302, Green Glen Layout, 6th Main, Indiranagar, Bengaluru');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'UPI on Delivery'>('UPI on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const packagingFee = items.length > 0 ? 10 : 0;
  const deliveryFee = deliveryType === 'delivery' ? 25 : 0;
  const total = subtotal + packagingFee + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim()) {
      alert('Please enter your name and phone number.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Please enter your delivery address.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `GS-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        date: 'Today, Just now',
        items: [...items],
        subtotal,
        packagingFee,
        deliveryFee,
        total,
        deliveryType,
        customerName,
        customerPhone: phone,
        deliveryAddress: deliveryType === 'delivery' ? address : 'Self-Pickup at Home Kitchen',
        paymentMethod,
        status: 'Order Placed',
        estimatedTime: deliveryType === 'delivery' ? 'Delivering within 35-45 mins' : 'Ready for pickup in 20 mins',
        sellerName: items[0]?.product.sellerName || 'Home Kitchen',
      };

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div>
            <h2 className="font-heading font-extrabold text-lg text-stone-900">
              Confirm Homemade Order
            </h2>
            <p className="text-xs text-stone-500">
              Directly supporting local homemakers & verified kitchens
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Fulfillment Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Fulfillment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-orange-500 bg-orange-50/60 text-orange-950 font-bold ring-2 ring-orange-400/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              >
                <Bike className={`w-5 h-5 ${deliveryType === 'delivery' ? 'text-orange-600' : 'text-stone-400'}`} />
                <div className="text-left">
                  <div className="text-xs font-bold">Hyperlocal Delivery</div>
                  <div className="text-[10px] text-stone-500">Delivered hot & fresh (₹25)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-orange-500 bg-orange-50/60 text-orange-950 font-bold ring-2 ring-orange-400/20'
                    : 'border-stone-200 bg-stone-50 text-stone-600'
                }`}
              >
                <Store className={`w-5 h-5 ${deliveryType === 'pickup' ? 'text-orange-600' : 'text-stone-400'}`} />
                <div className="text-left">
                  <div className="text-xs font-bold">Kitchen Pickup</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Free • Pick from cook</div>
                </div>
              </button>
            </div>
          </div>

          {/* Customer Details */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Customer Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Phone Number (for delivery updates)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                />
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Delivery Address & Landmark
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Apartment Name, Street, Landmark"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Payment Method Requirement: COD or UPI on Delivery */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Payment on Delivery / Pickup
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setPaymentMethod('UPI on Delivery')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'UPI on Delivery'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">UPI on Delivery</div>
                    <div className="text-[11px] text-stone-500">Scan QR on package via GPay / PhonePe / Paytm</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'UPI on Delivery' ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'UPI on Delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </label>

              <label
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-400/20'
                    : 'border-stone-200 bg-stone-50 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</div>
                    <div className="text-[11px] text-stone-500">Hand exact cash upon delivery or pickup</div>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  paymentMethod === 'Cash on Delivery' ? 'border-orange-600 bg-orange-600 text-white' : 'border-stone-300'
                }`}>
                  {paymentMethod === 'Cash on Delivery' && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </label>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="p-3.5 rounded-2xl bg-stone-100/70 space-y-1 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Items Total ({items.length} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Home-Safe Packaging</span>
              <span>₹{packagingFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Fulfillment Fee</span>
              <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-heading font-extrabold text-stone-900">
              <span>Payable upon delivery</span>
              <span className="text-orange-600">₹{total}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>GharSe Freshness Guarantee: You only pay when you verify the freshly packed order.</span>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Confirming with Kitchen...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Place Order • ₹{total} ({paymentMethod === 'UPI on Delivery' ? 'UPI' : 'COD'})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
