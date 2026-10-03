import React from 'react';
import { Home, Compass, ShoppingBag, ChefHat, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  ordersCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  ordersCount,
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: ordersCount > 0 ? ordersCount : null },
    { id: 'sell', label: 'Sell', icon: ChefHat },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-lg">
      <div className="max-w-md mx-auto sm:max-w-3xl lg:max-w-5xl px-2 py-1.5 flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all duration-200 select-none ${
                isActive
                  ? 'text-orange-600 font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-emerald-600 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-orange-600 absolute bottom-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
