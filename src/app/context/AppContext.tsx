import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../data/products';
import { AboutContent, defaultAboutContent } from '../data/aboutDefaults';

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
  joinDate: string;
  totalOrders: number;
  role: 'customer' | 'admin';
  password: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Đang xử lý' | 'Đang giao' | 'Đã giao' | 'Đã hủy';
  items: CartItem[];
  total: number;
  tracking?: string;
  pointsEarned?: number;
  customerName?: string;
}

export interface PointsRule {
  id: string;
  minPrice: number; // product price threshold (VND)
  points: number;   // fixed points earned when product price >= minPrice
}

export interface RewardItem {
  id: string;
  name: string;
  points: number;
  type: 'voucher' | 'shipping' | 'gift' | 'product';
  value: number;
  description: string;
  active: boolean;
  image?: string;
}

export interface PaymentSettings {
  momoEnabled: boolean;
  momoQrUrl: string;
  bankEnabled: boolean;
  bankName: string;
  bankAccount: string;
  bankAccountName: string;
}

export type { AboutContent };

interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  orders: Order[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  discountCode: string;
  discountAmount: number;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  pointsConfig: PointsRule[];
  rewardItems: RewardItem[];
  paymentSettings: PaymentSettings;
  aboutContent: AboutContent;
  updateAboutContent: (content: Partial<AboutContent>) => void;
  updatePaymentSettings: (settings: Partial<PaymentSettings>) => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyDiscount: (code: string) => boolean;
  cartTotal: number;
  cartCount: number;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
  redeemPoints: (points: number) => boolean;
  earnPoints: (orderTotal: number, cartItems?: CartItem[]) => number;
  updatePointsConfig: (config: PointsRule[]) => void;
  addRewardItem: (item: Omit<RewardItem, 'id'>) => void;
  updateRewardItem: (id: string, item: Partial<RewardItem>) => void;
  deleteRewardItem: (id: string) => void;
  addOrder: (items: CartItem[], total: number) => string;
}

const STORAGE_KEYS = {
  USERS: 'kumo_users',
  CURRENT_USER: 'kumo_current_user',
  ORDERS: 'kumo_orders',
  POINTS_CONFIG: 'kumo_points_config',
  REWARDS: 'kumo_rewards',
  CART: 'kumo_cart',
  WISHLIST: 'kumo_wishlist',
  ABOUT: 'kumo_about',
  PAYMENTS: 'kumo_payments',
};

// Default admin user
const defaultAdmin: User = {
  id: 'admin-001',
  name: 'KUMO Admin',
  email: 'admin@kumo.vn',
  avatar: '',
  points: 0,
  joinDate: '2024-01-01',
  totalOrders: 0,
  role: 'admin',
  password: 'admin123',
};

// Default points config
const defaultPointsConfig: PointsRule[] = [
  { id: 'pr1', minPrice: 100000, points: 10 },
  { id: 'pr2', minPrice: 200000, points: 15 },
  { id: 'pr3', minPrice: 500000, points: 30 },
  { id: 'pr4', minPrice: 1000000, points: 60 },
];

// Default rewards
const defaultRewards: RewardItem[] = [
  { id: 'r1', name: 'Giảm giá 50.000 VNĐ', points: 500, type: 'voucher', value: 50000, description: 'Voucher giảm giá trực tiếp', active: true },
  { id: 'r2', name: 'Giảm giá 100.000 VNĐ', points: 900, type: 'voucher', value: 100000, description: 'Voucher giảm giá trực tiếp', active: true },
  { id: 'r3', name: 'Mã miễn phí vận chuyển', points: 300, type: 'shipping', value: 30000, description: 'Miễn phí vận chuyển cho đơn hàng tiếp theo', active: true },
  { id: 'r4', name: 'Giảm giá 200.000 VNĐ', points: 1700, type: 'voucher', value: 200000, description: 'Voucher giảm giá trực tiếp', active: true },
  { id: 'r5', name: 'Hộp quà bí mật', points: 2000, type: 'gift', value: 0, description: 'Nhận một hộp quà bất ngờ từ KUMO', active: true },
  { id: 'r6', name: 'Thẻ truy cập sớm', points: 1000, type: 'product', value: 0, description: 'Truy cập sớm các bộ sưu tập mới', active: true },
];

const defaultPaymentSettings: PaymentSettings = {
  momoEnabled: true,
  momoQrUrl: '',
  bankEnabled: true,
  bankName: 'Vietcombank',
  bankAccount: '1234 5678 9012',
  bankAccountName: 'KUMO FASHION CO LTD',
};

const DISCOUNT_CODES: Record<string, number> = {
  "KUMO10": 10,
  "WELCOME20": 20,
  "FLASH30": 30,
  "LOYAL15": 15,
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

// Helper: find matching points for a product price
function getPointsForPrice(price: number, config: PointsRule[]): number {
  // Sort descending by minPrice, find the first (highest) threshold that the price meets
  const sorted = [...config].sort((a, b) => b.minPrice - a.minPrice);
  const match = sorted.find(rule => price >= rule.minPrice);
  return match ? match.points : 0;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [pointsConfig, setPointsConfig] = useState<PointsRule[]>(defaultPointsConfig);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>(defaultRewards);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    // Initialize default admin in users store
    const storedUsers = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (!storedUsers.find(u => u.email === 'admin@kumo.vn')) {
      setToStorage(STORAGE_KEYS.USERS, [...storedUsers, defaultAdmin]);
    }

    // Load current user session
    const currentUser = getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (currentUser) {
      setUser(currentUser);
      setIsLoggedIn(true);
    }

    // Load other state
    setCart(getFromStorage(STORAGE_KEYS.CART, []));
    setWishlist(getFromStorage(STORAGE_KEYS.WISHLIST, []));
    setOrders(getFromStorage(STORAGE_KEYS.ORDERS, []));
    setPointsConfig(getFromStorage(STORAGE_KEYS.POINTS_CONFIG, defaultPointsConfig));
    setRewardItems(getFromStorage(STORAGE_KEYS.REWARDS, defaultRewards));
    setPaymentSettings(getFromStorage(STORAGE_KEYS.PAYMENTS, defaultPaymentSettings));
    setAboutContent(getFromStorage(STORAGE_KEYS.ABOUT, defaultAboutContent));
    setInitialized(true);
  }, []);

  // Persist cart
  useEffect(() => {
    if (initialized) setToStorage(STORAGE_KEYS.CART, cart);
  }, [cart, initialized]);

  // Persist wishlist
  useEffect(() => {
    if (initialized) setToStorage(STORAGE_KEYS.WISHLIST, wishlist);
  }, [wishlist, initialized]);

  // Persist orders
  useEffect(() => {
    if (initialized) setToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders, initialized]);

  const isAdmin = user?.role === 'admin';

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

  // AUTH
  const login = useCallback((email: string, password: string): boolean => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      setUser(found);
      setIsLoggedIn(true);
      setToStorage(STORAGE_KEYS.CURRENT_USER, found);
      showNotification(`Chào mừng trở lại, ${found.name}!`, 'success');
      return true;
    }
    return false;
  }, [showNotification]);

  const register = useCallback((name: string, email: string, password: string): boolean => {
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return false; // email already exists
    }

    const newUser: User = {
      id: generateId(),
      name,
      email,
      avatar: '',
      points: 0,
      joinDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      role: email.toLowerCase() === 'admin@kumo.vn' ? 'admin' : 'customer',
      password,
    };

    const updatedUsers = [...users, newUser];
    setToStorage(STORAGE_KEYS.USERS, updatedUsers);
    setUser(newUser);
    setIsLoggedIn(true);
    setToStorage(STORAGE_KEYS.CURRENT_USER, newUser);
    showNotification(`Chào mừng ${name} đến với KUMO!`, 'success');
    return true;
  }, [showNotification]);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    setToStorage(STORAGE_KEYS.CURRENT_USER, null);
    showNotification('Đã đăng xuất thành công', 'info');
  }, [showNotification]);

  // Update user in both state and storage
  const persistUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
    setToStorage(STORAGE_KEYS.CURRENT_USER, updatedUser);
    // Also update in users store
    const users = getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    setToStorage(STORAGE_KEYS.USERS, updatedUsers);
  }, []);

  // CART
  const addToCart = useCallback((product: Product, size: string, color: string, quantity = 1): boolean => {
    if (!isLoggedIn) {
      showNotification('Vui lòng đăng nhập để mua hàng', 'error');
      return false;
    }
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
    return true;
  }, [showNotification, isLoggedIn]);

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

  const addOrder = useCallback((items: CartItem[], total: number): string => {
    const orderId = 'ORD-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-4);
    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      status: 'Đang xử lý',
      items,
      total,
      customerName: user?.name || 'Khách hàng',
    };
    setOrders(prev => [newOrder, ...prev]);
    return orderId;
  }, [user]);

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

  // POINTS SYSTEM
  const earnPoints = useCallback((orderTotal: number, cartItems?: CartItem[]): number => {
    if (!user) return 0;
    const config = getFromStorage<PointsRule[]>(STORAGE_KEYS.POINTS_CONFIG, defaultPointsConfig);

    let earned = 0;
    if (cartItems && cartItems.length > 0) {
      // Calculate points per product based on product price
      for (const item of cartItems) {
        const productPrice = item.product.isFlashSale && item.product.flashSalePrice
          ? item.product.flashSalePrice
          : item.product.price;
        const pointsPerProduct = getPointsForPrice(productPrice, config);
        earned += pointsPerProduct * item.quantity;
      }
    } else {
      // Fallback: calculate based on order total
      earned = getPointsForPrice(orderTotal, config);
    }

    const updatedUser = {
      ...user,
      points: user.points + earned,
      totalOrders: user.totalOrders + 1,
    };
    persistUser(updatedUser);

    showNotification(`Bạn nhận được ${earned} điểm từ đơn hàng này!`, 'success');
    return earned;
  }, [user, persistUser, showNotification]);

  const redeemPoints = useCallback((points: number): boolean => {
    if (!user || user.points < points) {
      showNotification('Không đủ điểm', 'error');
      return false;
    }
    const updatedUser = {
      ...user,
      points: user.points - points,
    };
    persistUser(updatedUser);
    showNotification(`${points} điểm đã được đổi thành công!`, 'success');
    return true;
  }, [user, persistUser, showNotification]);

  // ADMIN: Points Config
  const updatePointsConfig = useCallback((config: PointsRule[]) => {
    setPointsConfig(config);
    setToStorage(STORAGE_KEYS.POINTS_CONFIG, config);
    showNotification('Đã cập nhật cấu hình điểm thưởng', 'success');
  }, [showNotification]);

  // ADMIN: About Content
  const updateAboutContent = useCallback((updates: Partial<AboutContent>) => {
    setAboutContent(prev => {
      const updated = { ...prev, ...updates };
      setToStorage(STORAGE_KEYS.ABOUT, updated);
      return updated;
    });
    showNotification('Đã cập nhật nội dung trang Giới thiệu', 'success');
  }, [showNotification]);

  // ADMIN: Payment Settings
  const updatePaymentSettings = useCallback((updates: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => {
      const updated = { ...prev, ...updates };
      setToStorage(STORAGE_KEYS.PAYMENTS, updated);
      return updated;
    });
    showNotification('Đã cập nhật cấu hình thanh toán', 'success');
  }, [showNotification]);

  // ADMIN: Rewards CRUD
  const addRewardItem = useCallback((item: Omit<RewardItem, 'id'>) => {
    const newItem: RewardItem = { ...item, id: generateId() };
    setRewardItems(prev => {
      const updated = [...prev, newItem];
      setToStorage(STORAGE_KEYS.REWARDS, updated);
      return updated;
    });
    showNotification('Đã thêm phần thưởng mới', 'success');
  }, [showNotification]);

  const updateRewardItem = useCallback((id: string, updates: Partial<RewardItem>) => {
    setRewardItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      setToStorage(STORAGE_KEYS.REWARDS, updated);
      return updated;
    });
    showNotification('Đã cập nhật phần thưởng', 'success');
  }, [showNotification]);

  const deleteRewardItem = useCallback((id: string) => {
    setRewardItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      setToStorage(STORAGE_KEYS.REWARDS, updated);
      return updated;
    });
    showNotification('Đã xóa phần thưởng', 'info');
  }, [showNotification]);

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      user,
      orders,
      isLoggedIn,
      isAdmin,
      discountCode,
      discountAmount,
      notification,
      pointsConfig,
      rewardItems,
      paymentSettings,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      addOrder,
      toggleWishlist,
      applyDiscount,
      cartTotal,
      cartCount,
      showNotification,
      login,
      logout,
      register,
      redeemPoints,
      earnPoints,
      updatePointsConfig,
      addRewardItem,
      updateRewardItem,
      deleteRewardItem,
      aboutContent,
      updateAboutContent,
      updatePaymentSettings,
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
