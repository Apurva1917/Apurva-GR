/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AddProductModal } from './components/AddProductModal';
import { UpdatePrepModal } from './components/UpdatePrepModal';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { SellerProfilePage } from './pages/SellerProfilePage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { INITIAL_PRODUCTS, INITIAL_SELLERS, INITIAL_ORDERS } from './data/mockData';
import { Product, Seller, Order, CartItem, PrepStatus, TimelineItem } from './types';
import { CheckCircle2, MapPin, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'orders' | 'sell' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Data states with localStorage fallback for prototype persistence
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('gharse_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gharse_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('delivery');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isUpdatePrepOpen, setIsUpdatePrepOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Indiranagar, Bengaluru');
  const [orderToast, setOrderToast] = useState<string | null>(null);

  // Sync products and orders to localStorage
  useEffect(() => {
    localStorage.setItem('gharse_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('gharse_orders', JSON.stringify(orders));
  }, [orders]);

  // Cart operations
  const handleAddToCart = (product: Product, qty: number = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.quantityRemaining, item.quantity + qty) }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Order placement
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Decrement inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const itemOrdered = newOrder.items.find((i) => i.product.id === prod.id);
        if (itemOrdered) {
          return {
            ...prod,
            quantityRemaining: Math.max(0, prod.quantityRemaining - itemOrdered.quantity),
          };
        }
        return prod;
      })
    );
    setCartItems([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setOrderToast(`Order #${newOrder.orderNumber} confirmed with ${newOrder.sellerName}!`);
    setTimeout(() => setOrderToast(null), 4000);
    setActiveTab('orders');
    setSelectedProduct(null);
    setSelectedSellerId(null);
  };

  // Seller Dashboard Updates
  const handleAddNewProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    setOrderToast(`Dish "${newProd.name}" is now live on GharSe!`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleAddTimelineStep = (productId: string, newStep: TimelineItem, newStatus: PrepStatus) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedTimeline = [...p.timeline, newStep];
          return {
            ...p,
            preparationStatus: newStatus,
            timeline: updatedTimeline,
          };
        }
        return p;
      })
    );
    // Also update selected product if currently viewing it
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? {
              ...prev,
              preparationStatus: newStatus,
              timeline: [...prev.timeline, newStep],
            }
          : null
      );
    }
    setOrderToast(`Live timeline photo updated for ${newStatus}!`);
    setTimeout(() => setOrderToast(null), 3000);
  };

  const handleUpdateProductQuantity = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            quantityRemaining: Math.max(0, p.quantityRemaining + delta),
          };
        }
        return p;
      })
    );
  };

  const handleQuickUpdateStatus = (productId: string, newStatus: PrepStatus) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, preparationStatus: newStatus } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, preparationStatus: newStatus } : null));
    }
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  // Switch views
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedSellerId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSeller = (sellerId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedSellerId(sellerId);
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProductByName = (productName: string) => {
    const found = products.find((p) => p.name.toLowerCase() === productName.toLowerCase());
    if (found) {
      setSelectedProduct(found);
      setSelectedSellerId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTab('explore');
    }
  };

  const currentSeller = sellers[0]; // Lakshmi's Kitchen as the active primary homemaker

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans antialiased selection:bg-orange-200">
      {/* Top Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab as any);
          setSelectedProduct(null);
          setSelectedSellerId(null);
        }}
        currentLocation={currentLocation}
        onSelectLocation={() => setLocationModalOpen(true)}
      />

      {/* Toast Notification */}
      {orderToast && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 p-3 bg-stone-900 text-white rounded-2xl shadow-xl border border-stone-800 flex items-center justify-between gap-3 animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{orderToast}</span>
          </div>
          <button
            onClick={() => setOrderToast(null)}
            className="text-stone-400 hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="min-h-[85vh]">
        {/* If viewing a single Product Details Page */}
        {selectedProduct ? (
          <ProductDetailsPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onAddToCart={(prod, qty) => handleAddToCart(prod, qty)}
            onViewSeller={(sellerId) => handleSelectSeller(sellerId)}
            isInCart={cartItems.some((i) => i.product.id === selectedProduct.id)}
          />
        ) : selectedSellerId ? (
          // If viewing a single Seller Profile Page
          (() => {
            const seller = sellers.find((s) => s.id === selectedSellerId) || sellers[0];
            return (
              <SellerProfilePage
                seller={seller}
                products={products}
                onBack={() => setSelectedSellerId(null)}
                onSelectProduct={handleSelectProduct}
                onAddToCart={(prod, e) => handleAddToCart(prod, 1, e)}
                cartProductIds={cartItems.map((i) => i.product.id)}
              />
            );
          })()
        ) : (
          // Main Navigation Tabs
          <>
            {activeTab === 'home' && (
              <HomePage
                products={products}
                sellers={sellers}
                onSelectProduct={handleSelectProduct}
                onAddToCart={(prod, e) => handleAddToCart(prod, 1, e)}
                onSelectSeller={handleSelectSeller}
                cartProductIds={cartItems.map((i) => i.product.id)}
              />
            )}

            {activeTab === 'explore' && (
              <ExplorePage
                products={products}
                onSelectProduct={handleSelectProduct}
                onAddToCart={(prod, e) => handleAddToCart(prod, 1, e)}
                onSelectSeller={handleSelectSeller}
                cartProductIds={cartItems.map((i) => i.product.id)}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersPage
                orders={orders}
                onSelectProductByName={handleSelectProductByName}
                onExploreFood={() => setActiveTab('explore')}
              />
            )}

            {activeTab === 'sell' && (
              <SellerDashboardPage
                seller={currentSeller}
                products={products}
                orders={orders}
                onOpenAddProduct={() => setIsAddProductOpen(true)}
                onOpenUpdatePrep={() => setIsUpdatePrepOpen(true)}
                onUpdateProductQuantity={handleUpdateProductQuantity}
                onQuickUpdateStatus={handleQuickUpdateStatus}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onSelectProduct={handleSelectProduct}
              />
            )}

            {activeTab === 'profile' && (
              <ProfilePage
                onSwitchToSeller={() => setActiveTab('sell')}
                seller={currentSeller}
                ordersCount={orders.length}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab as any);
          setSelectedProduct(null);
          setSelectedSellerId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        ordersCount={orders.filter((o) => o.status !== 'Delivered').length}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        deliveryType={deliveryType}
        setDeliveryType={setDeliveryType}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Add Product Modal (with Gemini AI description generation and listing audit) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddNewProduct}
        sellerId={currentSeller.id}
        sellerName={currentSeller.name}
        sellerAvatar={currentSeller.avatar}
        sellerLocation={currentSeller.location}
      />

      {/* Update Preparation Modal (photo, status, description, timestamp) */}
      <UpdatePrepModal
        isOpen={isUpdatePrepOpen}
        onClose={() => setIsUpdatePrepOpen(false)}
        products={products.filter((p) => p.sellerId === currentSeller.id || p.sellerName === currentSeller.name)}
        onAddTimelineStep={handleAddTimelineStep}
      />

      {/* Location Picker Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              <h3 className="font-heading font-bold text-base text-stone-900">
                Choose Hyperlocal Neighborhood
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              GharSe connects you exclusively to home kitchens within 3-5 km of your locality.
            </p>
            <div className="space-y-2">
              {[
                'Indiranagar, Bengaluru',
                'HAL 2nd Stage, Bengaluru',
                'Domlur Layout, Bengaluru',
                'Defence Colony, Indiranagar',
                'Koramangala 4th Block, Bengaluru',
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    setCurrentLocation(loc);
                    setLocationModalOpen(false);
                  }}
                  className={`w-full p-3 rounded-2xl text-xs font-bold text-left border flex items-center justify-between transition-colors ${
                    currentLocation === loc
                      ? 'border-orange-500 bg-orange-50 text-orange-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <span>{loc}</span>
                  {currentLocation === loc && (
                    <span className="text-[10px] text-orange-600 font-extrabold uppercase">Selected</span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => setLocationModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold hover:bg-stone-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
