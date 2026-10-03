import React from 'react';
import { ShoppingBag, Clock, CheckCircle2, Bike, Store, ArrowRight, Phone, MessageSquare, ChefHat } from 'lucide-react';
import { Order, Product } from '../types';

interface OrdersPageProps {
  orders: Order[];
  onSelectProductByName: (productName: string) => void;
  onExploreFood: () => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  orders,
  onSelectProductByName,
  onExploreFood,
}) => {
  return (
    <div className="pb-28 max-w-md mx-auto sm:max-w-3xl lg:max-w-4xl px-4 pt-2 space-y-5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-black text-2xl text-stone-900">
            My Homemade Orders
          </h1>
          <p className="text-xs text-stone-500">
            Track freshly prepared food from nearby homemakers
          </p>
        </div>
        <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-stone-200 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-stone-900">
            No orders placed yet
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Order fresh Chakali, Tomato Chutney, or sun-cured Mango Pickle directly from local kitchens today!
          </p>
          <button
            onClick={onExploreFood}
            className="px-5 py-2.5 rounded-2xl bg-orange-600 text-white font-bold text-xs shadow-md hover:bg-orange-700 transition-colors"
          >
            Explore Fresh Food Nearby
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isCompleted = order.status === 'Delivered';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs space-y-4"
              >
                {/* Order Header */}
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-extrabold text-orange-600">
                        #{order.orderNumber}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs text-stone-500">{order.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-stone-900 mt-0.5">
                      {order.sellerName}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      isCompleted ? 'bg-stone-100 text-stone-700' : 'bg-emerald-100 text-emerald-800 animate-pulse'
                    }`}>
                      {!isCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>}
                      {order.status}
                    </span>
                    <p className="text-xs text-stone-500 mt-1">{order.estimatedTime}</p>
                  </div>
                </div>

                {/* Progress Stepper for Active Order */}
                {!isCompleted && (
                  <div className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200/70 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-orange-950">
                      <span>Kitchen Live Status:</span>
                      <span className="text-orange-600">{order.status}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-bold text-stone-500">
                      <div className="space-y-1">
                        <div className="h-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-emerald-700">Placed</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${order.status !== 'Order Placed' ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
                        <span className={order.status !== 'Order Placed' ? 'text-emerald-700' : ''}>Cooking</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${order.status === 'Packing' || order.status === 'Ready for Pickup' || order.status === 'Out for Delivery' ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
                        <span>Packing</span>
                      </div>
                      <div className="space-y-1">
                        <div className={`h-1.5 rounded-full ${order.status === 'Ready for Pickup' || order.status === 'Out for Delivery' ? 'bg-emerald-500' : 'bg-stone-200'}`}></div>
                        <span>{order.deliveryType === 'delivery' ? 'Delivering' : 'Ready'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items Ordered */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectProductByName(item.product.name)}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-stone-50 transition-colors cursor-pointer group"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-stone-900 group-hover:text-orange-600 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-stone-500">
                          Qty: {item.quantity} • {item.product.weight}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-xs text-stone-900">
                          ₹{item.product.price * item.quantity}
                        </span>
                        <span className="block text-[10px] text-orange-600 font-semibold group-hover:underline">
                          View Prep Timeline →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery & Payment Details */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    {order.deliveryType === 'delivery' ? (
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Bike className="w-3.5 h-3.5 text-orange-600" />
                        Hyperlocal Delivery to Indiranagar
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        Self-Pickup from Kitchen
                      </span>
                    )}
                    <span>•</span>
                    <span className="font-medium text-stone-700">{order.paymentMethod}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-stone-500">Total Paid: </span>
                    <strong className="text-sm font-heading font-extrabold text-stone-900">₹{order.total}</strong>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <span>Call Kitchen</span>
                  </a>
                  <button
                    onClick={() => onSelectProductByName(order.items[0]?.product.name || '')}
                    className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Inspect Preparation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
