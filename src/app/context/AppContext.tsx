import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, products as defaultProducts } from '../data/products';
import { AboutContent, defaultAboutContent } from '../data/aboutDefaults';
import { blogPosts as defaultBlogPosts } from '../data/blog';
import { login as loginAction, registerUser as registerAction, getSession as getSessionAction, logout as logoutAction } from '@/actions/authActions';
import { createOrder as createOrderAction, getUserOrders as getUserOrdersAction, getAllOrders as getAllOrdersAction } from '@/actions/orderActions';
import { getProducts as getProductsAction } from '@/actions/productActions';
import { getSetting as getSettingAction, saveSetting as saveSettingAction } from '@/actions/settingActions';
import { getBlogPosts as getBlogPostsAction } from '@/actions/blogActions';
import { updateUserPoints, updateUserCart, updateUserWishlist } from '@/actions/userActions';

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
  password?: string;
  isBlocked?: boolean;
  cart?: string;
  wishlist?: string;
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

export interface FlashSaleProduct {
  productId: string;
  salePrice: number;
}

export interface FlashSaleCampaign {
  id: string;
  name: string;
  endDate: string; // ISO string
  isActive: boolean;
  products: FlashSaleProduct[];
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
  products: Product[];
  blogPosts: typeof defaultBlogPosts;
  updateAdminProducts: (products: Product[]) => void;
  updateAdminBlogPosts: (posts: typeof defaultBlogPosts) => void;
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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  redeemPoints: (points: number) => boolean;
  earnPoints: (orderTotal: number, cartItems?: CartItem[]) => number;
  updatePointsConfig: (config: PointsRule[]) => void;
  addRewardItem: (item: Omit<RewardItem, 'id'>) => void;
  updateRewardItem: (id: string, item: Partial<RewardItem>) => void;
  deleteRewardItem: (id: string) => void;
  addOrder: (items: CartItem[], total: number) => Promise<string>;
  initialized: boolean;
  flashSaleCampaigns: FlashSaleCampaign[];
  addFlashCampaign: (campaign: Omit<FlashSaleCampaign, 'id'>) => void;
  updateFlashCampaign: (id: string, campaign: Partial<FlashSaleCampaign>) => void;
  deleteFlashCampaign: (id: string) => void;
  getSalePrice: (product: Product) => { isSale: boolean; price: number };
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
  PRODUCTS: 'kumo_admin_products',
  BLOG_POSTS: 'kumo_admin_blog',
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
  const [products, setProducts] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [flashSaleCampaigns, setFlashSaleCampaigns] = useState<FlashSaleCampaign[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Initialize from localStorage and Server Session
  useEffect(() => {
    // Initial fetch from session
    getSessionAction().then(session => {
      if (session) {
        const userData: User = { 
          ...defaultAdmin, 
          id: session.id as string, 
          name: session.name as string, 
          email: session.email as string, 
          role: session.role as any,
          points: (session as any).points || 0,
          isBlocked: (session as any).isBlocked || false,
          cart: (session as any).cart || '',
          wishlist: (session as any).wishlist || ''
        };
        setUser(userData);
        setIsLoggedIn(true);

        // Sync cart and wishlist from DB if available
        if (userData.cart) {
          try { setCart(JSON.parse(userData.cart)); } catch(e) { console.error("Error parsing cart from DB", e); }
        } else {
          setCart(getFromStorage(STORAGE_KEYS.CART, []));
        }

        if (userData.wishlist) {
          try { setWishlist(JSON.parse(userData.wishlist)); } catch(e) { console.error("Error parsing wishlist from DB", e); }
        } else {
          setWishlist(getFromStorage(STORAGE_KEYS.WISHLIST, []));
        }

        if (session.role === 'admin') {
          getAllOrdersAction().then(res => setOrders((res.orders as any) || []));
        } else {
          getUserOrdersAction().then(res => setOrders((res as any) || []));
        }
      } else {
        setCart(getFromStorage(STORAGE_KEYS.CART, []));
        setWishlist(getFromStorage(STORAGE_KEYS.WISHLIST, []));
      }
    });

    // Fetch universal/admin state from DataBase
    Promise.all([
      getProductsAction(),
      getBlogPostsAction(),
      getSettingAction('pointsConfig', defaultPointsConfig),
      getSettingAction('rewardItems', defaultRewards),
      getSettingAction('paymentSettings', defaultPaymentSettings),
      getSettingAction('aboutContent', defaultAboutContent),
      getSettingAction('flashSaleCampaigns', [])
    ]).then(([dbProducts, dbBlogs, pointsCfg, rewards, payments, about, flashCampaigns]) => {
      setProducts((dbProducts as any) || []);
      setBlogPosts((dbBlogs as any) || []);
      setPointsConfig(pointsCfg);
      setRewardItems(rewards);
      setPaymentSettings(payments);
      setAboutContent(about);
      setFlashSaleCampaigns(flashCampaigns || []);

      setInitialized(true);
    });
  }, []);

  // Persist cart
  useEffect(() => {
    if (initialized) {
      setToStorage(STORAGE_KEYS.CART, cart);
      if (isLoggedIn && user?.id) {
        updateUserCart(user.id, JSON.stringify(cart));
      }
    }
  }, [cart, initialized, isLoggedIn, user?.id]);

  // Persist wishlist
  useEffect(() => {
    if (initialized) {
      setToStorage(STORAGE_KEYS.WISHLIST, wishlist);
      if (isLoggedIn && user?.id) {
        updateUserWishlist(user.id, JSON.stringify(wishlist));
      }
    }
  }, [wishlist, initialized, isLoggedIn, user?.id]);

  // Persist orders
  useEffect(() => {
    if (initialized) setToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders, initialized]);

  const isAdmin = user?.role === 'admin';

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const getSalePrice = useCallback((product: Product) => {
    // Check if product is in an active, enabled campaign
    const now = new Date();
    const activeCampaign = flashSaleCampaigns.find(c => 
      c.isActive && 
      new Date(c.endDate) > now && 
      c.products.some(p => p.productId === product.id)
    );

    if (activeCampaign) {
      const campaignProduct = activeCampaign.products.find(p => p.productId === product.id);
      if (campaignProduct) {
        return { isSale: true, price: campaignProduct.salePrice };
      }
    }

    // Fallback to legacy flash sale or normal price
    if (product.isFlashSale && product.flashSalePrice) {
      return { isSale: true, price: product.flashSalePrice };
    }
    
    return { isSale: false, price: product.price };
  }, [flashSaleCampaigns]);

  const cartTotal = cart.reduce((sum, item) => {
    const { price } = getSalePrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // AUTH
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    const result = await loginAction(formData);
    
    if (result.success && result.user) {
      setUser({
        ...defaultAdmin,
        id: result.user.id as string,
        name: result.user.name as string,
        email: result.user.email as string,
        role: result.user.role as any
      });
      setIsLoggedIn(true);
      showNotification(`Chào mừng trở lại!`, 'success');
      return true;
    }
    showNotification(result.error || 'Đăng nhập thất bại', 'error');
    return false;
  }, [showNotification]);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    const result = await registerAction(formData);

    if (result.success && result.user) {
      setUser({
        ...defaultAdmin,
        id: result.user.id as string,
        name: result.user.name as string,
        email: result.user.email as string,
        role: result.user.role as any
      });
      setIsLoggedIn(true);
      showNotification(`Chào mừng ${name} đến với KUMO!`, 'success');
      return true;
    }
    showNotification(result.error || 'Đăng ký thất bại', 'error');
    return false;
  }, [showNotification]);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
    setIsLoggedIn(false);
    showNotification('Đã đăng xuất thành công', 'info');
  }, [showNotification]);

  // Use partial persist since real storage is in DB now. We keep user local state updated.
  const persistUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
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

  const addOrder = useCallback(async (items: CartItem[], total: number): Promise<string> => {
    const simplifiedItems = items.map(item => ({
      productId: item.product.id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: getSalePrice(item.product).price
    }));

    const result = await createOrderAction({ items: simplifiedItems, total, customerName: user?.name });
    
    if (result.success && result.orderId) {
       showNotification('Tạo đơn hàng thành công', 'success');
       return result.orderId;
    }
    
    showNotification(result.error || 'Lỗi tạo đơn', 'error');
    return "";
  }, [user, showNotification]);

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
        const { price: productPrice } = getSalePrice(item.product);
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
    
    // Sync points to DB
    updateUserPoints(user.id, updatedUser.points);

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

    // Sync points to DB
    updateUserPoints(user.id, updatedUser.points);

    showNotification(`${points} điểm đã được đổi thành công!`, 'success');
    return true;
  }, [user, persistUser, showNotification]);

  // ADMIN: Points Config
  const updatePointsConfig = useCallback((config: PointsRule[]) => {
    setPointsConfig(config);
    saveSettingAction('pointsConfig', config);
    showNotification('Đã cập nhật cấu hình điểm thưởng', 'success');
  }, [showNotification]);

  // ADMIN: About Content
  const updateAboutContent = useCallback((updates: Partial<AboutContent>) => {
    setAboutContent(prev => {
      const updated = { ...prev, ...updates };
      saveSettingAction('aboutContent', updated);
      return updated;
    });
    showNotification('Đã cập nhật nội dung trang Giới thiệu', 'success');
  }, [showNotification]);

  // ADMIN: Payment Settings
  const updatePaymentSettings = useCallback((updates: Partial<PaymentSettings>) => {
    setPaymentSettings(prev => {
      const updated = { ...prev, ...updates };
      saveSettingAction('paymentSettings', updated);
      return updated;
    });
    showNotification('Đã cập nhật cấu hình thanh toán', 'success');
  }, [showNotification]);

  // ADMIN: Rewards CRUD
  const addRewardItem = useCallback((item: Omit<RewardItem, 'id'>) => {
    const newItem: RewardItem = { ...item, id: generateId() };
    setRewardItems(prev => {
      const updated = [...prev, newItem];
      saveSettingAction('rewardItems', updated);
      return updated;
    });
    showNotification('Đã thêm phần thưởng mới', 'success');
  }, [showNotification]);

  const updateRewardItem = useCallback((id: string, updates: Partial<RewardItem>) => {
    setRewardItems(prev => {
      const updated = prev.map(item => item.id === id ? { ...item, ...updates } : item);
      saveSettingAction('rewardItems', updated);
      return updated;
    });
    showNotification('Đã cập nhật phần thưởng', 'success');
  }, [showNotification]);

  const deleteRewardItem = useCallback((id: string) => {
    setRewardItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      saveSettingAction('rewardItems', updated);
      return updated;
    });
    showNotification('Đã xóa phần thưởng', 'info');
  }, [showNotification]);

  // ADMIN: Flash Sale CRUD
  const addFlashCampaign = useCallback((campaign: Omit<FlashSaleCampaign, 'id'>) => {
    const newCampaign: FlashSaleCampaign = { ...campaign, id: generateId() };
    setFlashSaleCampaigns(prev => {
      const updated = [...prev, newCampaign];
      saveSettingAction('flashSaleCampaigns', updated);
      return updated;
    });
    showNotification('Đã thêm chiến dịch Flash Sale mới', 'success');
  }, [showNotification]);

  const updateFlashCampaign = useCallback((id: string, updates: Partial<FlashSaleCampaign>) => {
    setFlashSaleCampaigns(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      saveSettingAction('flashSaleCampaigns', updated);
      return updated;
    });
    showNotification('Đã cập nhật chiến dịch Flash Sale', 'success');
  }, [showNotification]);

  const deleteFlashCampaign = useCallback((id: string) => {
    setFlashSaleCampaigns(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveSettingAction('flashSaleCampaigns', updated);
      return updated;
    });
    showNotification('Đã xóa chiến dịch', 'info');
  }, [showNotification]);

  const updateAdminProducts = useCallback((newProducts: Product[]) => {
    setProducts(newProducts);
  }, []);

  const updateAdminBlogPosts = useCallback((newPosts: typeof defaultBlogPosts) => {
    setBlogPosts(newPosts);
  }, []);

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      user,
      orders,
      isLoggedIn,
      isAdmin,
      products,
      blogPosts,
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
      updateAdminProducts,
      updateAdminBlogPosts,
      addRewardItem,
      updateRewardItem,
      deleteRewardItem,
      aboutContent,
      updateAboutContent,
      updatePaymentSettings,
      initialized,
      flashSaleCampaigns,
      addFlashCampaign,
      updateFlashCampaign,
      deleteFlashCampaign,
      getSalePrice,
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
