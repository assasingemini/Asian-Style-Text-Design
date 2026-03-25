import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  points: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  joinDate: string;
  totalOrders: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Đang xử lý' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
  items: CartItem[];
  total: number;
  tracking?: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  isLoggedIn: boolean;
  discountCode: string;
  discountAmount: number;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyDiscount: (code: string) => boolean;
  cartTotal: number;
  cartCount: number;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  login: () => void;
  logout: () => void;
  redeemPoints: (points: number) => boolean;
}

const mockUser: User = {
  id: "u001",
  name: "Linh Nguyễn",
  email: "linh.nguyen@example.com",
  avatar: "https://images.unsplash.com/photo-1732209988927-396f5103ede8?w=100&h=100&fit=crop",
  points: 2450,
  tier: 'Silver',
  joinDate: "2025-06-15",
  totalOrders: 12
};

const mockOrders: Order[] = [
  {
    id: "ORD-2026-0312",
    date: "2026-03-12",
    status: "Đã giao",
    items: [],
    total: 478000,
    tracking: "VN123456789"
  },
  {
    id: "ORD-2026-0228",
    date: "2026-02-28",
    status: "Đã giao",
    items: [],
    total: 289000
  },
  {
    id: "ORD-2026-0315",
    date: "2026-03-15",
    status: "Đang giao",
    items: [],
    total: 359000,
    tracking: "VN987654321"
  }
];

const DISCOUNT_CODES: Record<string, number> = {
  "KUMO10": 10,
  "WELCOME20": 20,
  "FLASH30": 30,
  "LOYAL15": 15,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(mockUser);
  const [orders] = useState<Order[]>(mockOrders);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.product.isFlashSale && item.product.flashSalePrice
      ? item.product.flashSalePrice
      : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.size === size && item.color === color
      );
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, size, color, quantity }];
    });
    showNotification(`${product.name} đã được thêm vào giỏ hàng`, 'success');
  }, [showNotification]);

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    ));
    showNotification('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  }, [showNotification]);

  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setDiscountCode('');
    setDiscountAmount(0);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showNotification('Đã xóa khỏi danh sách yêu thích', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showNotification('Đã thêm vào danh sách yêu thích', 'success');
        return [...prev, productId];
      }
    });
  }, [showNotification]);

  const applyDiscount = useCallback((code: string): boolean => {
    const discount = DISCOUNT_CODES[code.toUpperCase()];
    if (discount) {
      setDiscountCode(code.toUpperCase());
      setDiscountAmount(discount);
      showNotification(`Đã áp dụng mã giảm giá: giảm ${discount}%`, 'success');
      return true;
    }
    showNotification('Mã giảm giá không hợp lệ', 'error');
    return false;
  }, [showNotification]);

  const login = useCallback(() => {
    setUser(mockUser);
    setIsLoggedIn(true);
    showNotification('Chào mừng trở lại, Linh!', 'success');
  }, [showNotification]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    showNotification('Đã đăng xuất thành công', 'info');
  }, [showNotification]);

  const redeemPoints = useCallback((points: number): boolean => {
    setUser(prev => {
      if (prev && prev.points >= points) {
        showNotification(`${points} điểm đã được đổi thành công!`, 'success');
        return { ...prev, points: prev.points - points };
      }
      showNotification('Không đủ điểm', 'error');
      return prev;
    });
    return true;
  }, [showNotification]);

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      user,
      orders,
      isLoggedIn,
      discountCode,
      discountAmount,
      notification,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      applyDiscount,
      cartTotal,
      cartCount,
      showNotification,
      login,
      logout,
      redeemPoints,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
