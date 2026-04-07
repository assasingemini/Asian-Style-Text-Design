'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, FileText, Zap, Award, Coins,
  Plus, Pencil, Trash2, Search, DollarSign, Eye, X, Menu, Save, ToggleLeft, ToggleRight, Shield, BookOpen, ImagePlus, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { products as dummyProducts, formatPrice, Product } from '../data/products';
import { blogPosts } from '../data/blog';
import { useApp, PointsRule, RewardItem, AboutContent } from '../context/AppContext';
import { createProduct as createProductAction, updateProduct as updateProductAction, deleteProduct as deleteProductAction } from '@/actions/productActions';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'blog' | 'flash' | 'rewards' | 'points' | 'about' | 'payments';

const navItems: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { key: 'products', label: 'Sản phẩm', icon: Package },
  { key: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
  { key: 'users', label: 'Người dùng', icon: Users },
  { key: 'blog', label: 'Bài viết', icon: FileText },
  { key: 'flash', label: 'Giảm giá Sốc', icon: Zap },
  { key: 'points', label: 'Cấu hình điểm', icon: Coins },
  { key: 'rewards', label: 'Ưu đãi', icon: Award },
  { key: 'about', label: 'Trang Giới thiệu', icon: BookOpen },
  { key: 'payments', label: 'Thanh toán', icon: CreditCard },
];

const revenueData = [
  { month: 'Th10', revenue: 48000000, orders: 142 },
  { month: 'Th11', revenue: 62000000, orders: 178 },
  { month: 'Th12', revenue: 95000000, orders: 256 },
  { month: 'Th1', revenue: 71000000, orders: 198 },
  { month: 'Th2', revenue: 83000000, orders: 221 },
  { month: 'Th3', revenue: 112000000, orders: 289 },
];

const categoryData = [
  { name: 'Áo khoác', value: 35, color: '#0a0a0a' },
  { name: 'Áo', value: 28, color: '#3d3d3d' },
  { name: 'Quần & Váy', value: 20, color: '#6b6b6b' },
  { name: 'Phụ kiện', value: 10, color: '#9a9a9a' },
  { name: 'Đầm', value: 7, color: '#c8c8c8' },
];

const mockOrders = [
  { id: 'ORD-2026-0412', customer: 'Linh Nguyễn', total: 578000, status: 'Đang giao', date: '2026-03-20', items: 3 },
  { id: 'ORD-2026-0411', customer: 'Min Jae Kim', total: 289000, status: 'Đang xử lý', date: '2026-03-20', items: 1 },
  { id: 'ORD-2026-0410', customer: 'Sakura Hana', total: 1138000, status: 'Đã giao', date: '2026-03-19', items: 4 },
  { id: 'ORD-2026-0409', customer: 'Phương Lê', total: 449000, status: 'Đã giao', date: '2026-03-19', items: 2 },
  { id: 'ORD-2026-0408', customer: 'Trần Anh', total: 169000, status: 'Đã hủy', date: '2026-03-18', items: 1 },
];

const mockUsers = [
  { id: 'u001', name: 'Linh Nguyễn', email: 'linh@email.com', points: 2450, orders: 12, joined: '2025-06-15' },
  { id: 'u002', name: 'Min Jae Kim', email: 'minjae@email.com', points: 6200, orders: 28, joined: '2024-12-01' },
  { id: 'u003', name: 'Sakura H.', email: 'sakura@email.com', points: 340, orders: 3, joined: '2026-01-20' },
  { id: 'u004', name: 'Phương Lê', email: 'phuong@email.com', points: 15800, orders: 67, joined: '2024-03-11' },
];

const statusBadge = (status: string) => {
  const styles: Record<string, string> = {
    'Đang giao': 'bg-blue-100 text-blue-800',
    'Đang xử lý': 'bg-yellow-100 text-yellow-800',
    'Đã giao': 'bg-green-100 text-green-800',
    'Đã hủy': 'bg-red-100 text-red-800',
  };
  return `text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${styles[status] || 'bg-gray-100 text-gray-600'}`;
};

const inputCls = "w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors";
const labelCls = "block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2";

export default function AdminPage() {
  const navigate = useRouter();
  const { isLoggedIn, isAdmin, orders, products, pointsConfig, rewardItems, updatePointsConfig, addRewardItem, updateRewardItem, deleteRewardItem, aboutContent, updateAboutContent, paymentSettings, updatePaymentSettings, updateAdminProducts, updateAdminBlogPosts, showNotification } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '', price: 0, originalPrice: 0, stock: 0, category: 'Áo khoác',
    subcategory: '', description: '', images: [''], sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Đen'], isNew: false, isBestseller: false
  });

  // Points config state
  const [editingPoints, setEditingPoints] = useState<PointsRule[]>(pointsConfig);
  const [pointsChanged, setPointsChanged] = useState(false);

  // Rewards state
  const [showAddReward, setShowAddReward] = useState(false);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [rewardForm, setRewardForm] = useState<Omit<RewardItem, 'id'>>({
    name: '', points: 0, type: 'voucher', value: 0, description: '', active: true
  });

  // About content editing state
  const [editingAbout, setEditingAbout] = useState<AboutContent>(aboutContent);
  const [aboutChanged, setAboutChanged] = useState(false);
  const [aboutSection, setAboutSection] = useState('hero');

  // Orders state - sync with real orders from context
  const [viewingOrder, setViewingOrder] = useState<{ id: string; customer: string; total: number; status: string; date: string; items: number } | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<{ id: string; customer: string; total: number; status: string; date: string; items: number } | null>(null);
  const [localOrders, setLocalOrders] = useState(mockOrders);

  // Users state - read from localStorage
  const [adminUsers] = useState<typeof mockUsers>(() => {
    if (typeof window === 'undefined') return mockUsers;
    try {
      const stored = localStorage.getItem('kumo_users');
      if (stored) {
        const users = JSON.parse(stored);
        const mapped = users.filter((u: any) => u.role !== 'admin').map((u: any) => ({
          id: u.id, name: u.name, email: u.email, points: u.points || 0,
          orders: u.totalOrders || 0, joined: u.joinDate || new Date().toISOString().split('T')[0],
        }));
        return mapped.length > 0 ? mapped : mockUsers;
      }
    } catch { /* fallback */ }
    return mockUsers;
  });
  const [viewingUser, setViewingUser] = useState<typeof mockUsers[0] | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);

  // Blog state - persist to localStorage
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  const [localBlogPosts, setLocalBlogPosts] = useState<typeof blogPosts>(() => {
    if (typeof window === 'undefined') return blogPosts;
    try { const s = localStorage.getItem('kumo_admin_blog'); return s ? JSON.parse(s) : blogPosts; } catch { return blogPosts; }
  });
  const [blogForm, setBlogForm] = useState({ title: '', category: '', author: '', content: '', image: '' });

  // Flash sales state - persist to localStorage
  const defaultFlash = [
    { id: 'f1', name: 'Ưu đãi Nửa đêm', status: 'Hoạt động', products: 2, discount: 21, ends: '7g 23ph', revenue: '₫4.2M' },
    { id: 'f2', name: 'Đặc biệt Cuối tuần', status: 'Đã lên lịch', products: 5, discount: 15, ends: '2n 5g', revenue: '—' },
    { id: 'f3', name: 'Spring Clear', status: 'Đã kết thúc', products: 8, discount: 30, ends: 'Đã kết thúc', revenue: '₫18.7M' },
  ];
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [editingFlash, setEditingFlash] = useState<string | null>(null);
  const [flashCampaigns, setFlashCampaigns] = useState<typeof defaultFlash>(() => {
    if (typeof window === 'undefined') return defaultFlash;
    try { const s = localStorage.getItem('kumo_admin_flash'); return s ? JSON.parse(s) : defaultFlash; } catch { return defaultFlash; }
  });
  const [flashForm, setFlashForm] = useState({ name: '', products: 0, discount: 0 });

  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const localProducts = products;

  useEffect(() => { setEditingAbout(aboutContent); }, [aboutContent]);

  // Persist to Context
  useEffect(() => { updateAdminBlogPosts(localBlogPosts); }, [localBlogPosts, updateAdminBlogPosts]);
  useEffect(() => { localStorage.setItem('kumo_admin_flash', JSON.stringify(flashCampaigns)); }, [flashCampaigns]);

  // Sync real orders from context
  useEffect(() => {
    if (orders.length > 0) {
      const adminOrders = orders.map((o: any) => ({
        id: o.id, customer: o.customerName || 'Khách hàng',
        total: o.total, status: o.status, date: o.date,
        items: Array.isArray(o.items) ? o.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0,
      }));
      setLocalOrders(adminOrders);
    }
  }, [orders]);

  const updateEA = (updates: Partial<AboutContent>) => {
    setEditingAbout(prev => ({ ...prev, ...updates }));
    setAboutChanged(true);
  };

  const saveAboutContent = () => {
    updateAboutContent(editingAbout);
    setAboutChanged(false);
  };

  // Access control
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full text-center">
          <Shield size={48} className="mx-auto mb-6 text-black/20" strokeWidth={1} />
          <h1 className="font-['Cormorant_Garamond'] text-4xl mb-4">Truy cập bị từ chối</h1>
          <p className="text-black/50 text-sm tracking-wide mb-10">Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
          <button onClick={() => navigate.push('/login')} className="bg-black text-white text-xs tracking-[0.25em] uppercase py-4 px-10 hover:bg-black/90">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = localProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Tổng doanh thu', value: '₫471,000,000', change: '+18.4%', positive: true, icon: DollarSign },
    { label: 'Đơn hàng tháng này', value: '289', change: '+12.1%', positive: true, icon: ShoppingCart },
    { label: 'Khách hàng mới', value: '1,847', change: '+5.6%', positive: true, icon: Users },
    { label: 'Sản phẩm đang bán', value: localProducts.length.toString(), change: '+2', positive: true, icon: Package },
  ];

  // Product CRUD handlers
  const confirmDeleteProduct = (id: string) => setDeletingProduct(id);
  const executeDeleteProduct = async () => {
    if (deletingProduct) {
      const res = await deleteProductAction(deletingProduct);
      if (res.success) {
        updateAdminProducts(products.filter(p => p.id !== deletingProduct));
        showNotification('Đã xóa sản phẩm thành công', 'success');
      } else {
        showNotification(res.error || 'Lỗi khi xóa sản phẩm', 'error');
      }
      setDeletingProduct(null);
    }
  };

  const openAddProduct = () => {
    setProductForm({
      name: '', price: 0, originalPrice: 0, stock: 0, category: 'Áo khoác',
      subcategory: '', description: '', images: [''], sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Đen'], isNew: false, isBestseller: false
    });
    setEditingProduct(null);
    setShowAddProduct(true);
  };

  const openEditProduct = (product: Product) => {
    setProductForm({
      name: product.name, price: product.price, originalPrice: product.originalPrice || 0,
      stock: product.stock, category: product.category, subcategory: product.subcategory,
      description: product.description, images: [...product.images], sizes: [...product.sizes],
      colors: [...product.colors], isNew: product.isNew || false, isBestseller: product.isBestseller || false
    });
    setEditingProduct(product.id);
    setShowAddProduct(true);
  };

  const saveProduct = async () => {
    if (editingProduct) {
      const updatedData = {
        name: productForm.name, price: productForm.price,
        originalPrice: productForm.originalPrice || undefined,
        stock: productForm.stock, category: productForm.category,
        subcategory: productForm.subcategory || productForm.category,
        description: productForm.description,
        images: productForm.images.filter(Boolean).length > 0 ? productForm.images.filter(Boolean) : undefined,
        sizes: productForm.sizes, colors: productForm.colors,
        isNew: productForm.isNew, isBestseller: productForm.isBestseller,
      };
      const res = await updateProductAction(editingProduct, updatedData);
      if (res.success && res.product) {
        updateAdminProducts(products.map(p => p.id === editingProduct ? { ...p, ...(res.product as any) } : p));
      }
    } else {
      const newProductData = {
        name: productForm.name || 'Sản phẩm mới', price: productForm.price,
        originalPrice: productForm.originalPrice || undefined,
        stock: productForm.stock, category: productForm.category,
        subcategory: productForm.subcategory || productForm.category,
        description: productForm.description || '', details: [],
        images: productForm.images.filter(Boolean).length > 0 ? productForm.images.filter(Boolean) : ['https://images.unsplash.com/photo-1683642765591-2370edc15193?w=400'],
        sizes: productForm.sizes, colors: productForm.colors,
        isNew: productForm.isNew, isBestseller: productForm.isBestseller,
      };
      const res = await createProductAction(newProductData);
      if (res.success && res.product) {
        updateAdminProducts([res.product as any, ...products]);
      }
    }
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  // Orders handlers
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setLocalOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setUpdatingOrder(null);
  };

  // Users handlers
  const toggleBlockUser = (userId: string) => {
    setBlockedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  // Blog handlers
  const openAddBlog = () => {
    setBlogForm({ title: '', category: '', author: '', content: '', image: '' });
    setEditingBlog(null);
    setShowBlogModal(true);
  };
  const openEditBlog = (post: typeof blogPosts[0]) => {
    setBlogForm({ title: post.title, category: post.category, author: post.author, content: post.content, image: post.image });
    setEditingBlog(post.id);
    setShowBlogModal(true);
  };
  const saveBlog = () => {
    if (editingBlog) {
      setLocalBlogPosts(prev => prev.map(p => p.id === editingBlog ? { ...p, ...blogForm } : p));
    } else {
      const newPost = { ...blogForm, id: Date.now().toString(36), slug: blogForm.title.toLowerCase().replace(/\s+/g, '-'), excerpt: blogForm.content.slice(0, 120) + '...', authorAvatar: '', date: new Date().toISOString().split('T')[0], readTime: Math.ceil(blogForm.content.length / 800), tags: [] };
      setLocalBlogPosts(prev => [newPost, ...prev]);
    }
    setShowBlogModal(false);
    setEditingBlog(null);
  };
  const deleteBlog = (id: string) => setLocalBlogPosts(prev => prev.filter(p => p.id !== id));

  // Flash sales handlers
  const openAddFlash = () => {
    setFlashForm({ name: '', products: 0, discount: 0 });
    setEditingFlash(null);
    setShowFlashModal(true);
  };
  const openEditFlash = (campaign: typeof flashCampaigns[0]) => {
    setFlashForm({ name: campaign.name, products: campaign.products, discount: campaign.discount });
    setEditingFlash(campaign.id);
    setShowFlashModal(true);
  };
  const saveFlash = () => {
    if (editingFlash) {
      setFlashCampaigns(prev => prev.map(c => c.id === editingFlash ? { ...c, name: flashForm.name, products: flashForm.products, discount: flashForm.discount } : c));
    } else {
      setFlashCampaigns(prev => [...prev, { id: Date.now().toString(36), name: flashForm.name, status: 'Đã lên lịch', products: flashForm.products, discount: flashForm.discount, ends: 'Sắp tới', revenue: '—' }]);
    }
    setShowFlashModal(false);
    setEditingFlash(null);
  };
  const endFlashCampaign = (id: string) => {
    setFlashCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'Đã kết thúc', ends: 'Đã kết thúc' } : c));
  };

  // Points handlers
  const handlePointsRuleChange = (index: number, field: 'minPrice' | 'points', value: number) => {
    const updated = [...editingPoints];
    updated[index] = { ...updated[index], [field]: value };
    setEditingPoints(updated);
    setPointsChanged(true);
  };

  const addPointsRule = () => {
    const newRule: PointsRule = {
      id: Date.now().toString(36),
      minPrice: 0,
      points: 0,
    };
    setEditingPoints([...editingPoints, newRule]);
    setPointsChanged(true);
  };

  const removePointsRule = (index: number) => {
    setEditingPoints(editingPoints.filter((_, i) => i !== index));
    setPointsChanged(true);
  };

  const savePointsConfig = () => {
    updatePointsConfig(editingPoints);
    setPointsChanged(false);
  };

  // Rewards handlers
  const openAddReward = () => {
    setRewardForm({ name: '', points: 0, type: 'voucher', value: 0, description: '', active: true });
    setShowAddReward(true);
    setEditingReward(null);
  };

  const openEditReward = (reward: RewardItem) => {
    setRewardForm({ name: reward.name, points: reward.points, type: reward.type, value: reward.value, description: reward.description, active: reward.active });
    setEditingReward(reward.id);
    setShowAddReward(true);
  };

  const saveReward = () => {
    if (editingReward) {
      updateRewardItem(editingReward, rewardForm);
    } else {
      addRewardItem(rewardForm);
    }
    setShowAddReward(false);
    setEditingReward(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black text-white flex-shrink-0 h-screen sticky top-0 overflow-hidden"
          >
            <div className="p-6 border-b border-white/10">
              <Link href="/" className="font-['Cormorant_Garamond'] text-xl tracking-[0.3em] text-white">KUMO</Link>
              <p className="text-white/30 text-[9px] tracking-[0.25em] uppercase mt-1">Trang quản trị</p>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-xs tracking-[0.15em] uppercase transition-all rounded-none text-left ${
                      activeTab === item.key ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
              <Link href="/" className="flex items-center gap-2 text-white/40 text-xs tracking-wider hover:text-white transition-colors">
                <Eye size={12} /> Xem cửa hàng
              </Link>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-black/40 hover:text-black transition-colors">
              <Menu size={18} />
            </button>
            <h1 className="font-['Cormorant_Garamond'] text-xl capitalize">
              {navItems.find(n => n.key === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
              <input type="text" placeholder="Tìm kiếm..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-black/15 text-xs tracking-wide outline-none focus:border-black transition-colors w-52" />
            </div>
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs">A</div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white p-6 border border-black/10">
                      <div className="flex items-start justify-between mb-4">
                        <Icon size={16} className="text-black/40" />
                        <span className={`text-[10px] tracking-wider ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>{stat.change}</span>
                      </div>
                      <p className="font-['Cormorant_Garamond'] text-3xl mb-1">{stat.value}</p>
                      <p className="text-[10px] tracking-[0.2em] uppercase text-black/40">{stat.label}</p>
                    </motion.div>
                  );
                })}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                <div className="lg:col-span-2 bg-white p-6 border border-black/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-['Cormorant_Garamond'] text-xl">Tổng quan Doanh thu</h3>
                    <span className="text-[9px] tracking-[0.25em] uppercase text-black/40 border border-black/10 px-3 py-1.5">6 tháng qua</span>
                  </div>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={revenueData}>
                      <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0a0a0a" stopOpacity={0.15} /><stop offset="95%" stopColor="#0a0a0a" stopOpacity={0} /></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000000}Tr`} />
                      <Tooltip contentStyle={{ border: '1px solid #e0e0e0', borderRadius: 0, fontSize: 11 }} formatter={(v: number) => [formatPrice(v), 'Doanh thu']} />
                      <Area type="monotone" dataKey="revenue" stroke="#0a0a0a" strokeWidth={2} fill="url(#revGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 border border-black/10">
                  <h3 className="font-['Cormorant_Garamond'] text-xl mb-6">Theo danh mục</h3>
                  <ResponsiveContainer width="100%" height={140}>
                    <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" strokeWidth={0}>
                      {categoryData.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} />)}
                    </Pie><Tooltip contentStyle={{ fontSize: 11, border: '1px solid #e0e0e0', borderRadius: 0 }} /></PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-4">
                    {categoryData.map(cat => (
                      <div key={cat.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} /><span className="text-black/60">{cat.name}</span></div>
                        <span className="text-black">{cat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bg-white border border-black/10 p-6">
                <h3 className="font-['Cormorant_Garamond'] text-xl mb-6">Đơn hàng gần đây</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-black/10">{['Mã đơn hàng','Khách hàng','Sản phẩm','Tổng cộng','Ngày','Trạng thái'].map(h=><th key={h} className="text-left pb-3 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal pr-6">{h}</th>)}</tr></thead>
                    <tbody>{localOrders.slice(0, 5).map(order=>(
                      <tr key={order.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="py-3.5 pr-6 font-medium tracking-wide">{order.id}</td>
                        <td className="py-3.5 pr-6 text-black/70">{order.customer}</td>
                        <td className="py-3.5 pr-6 text-black/50">{order.items} sản phẩm</td>
                        <td className="py-3.5 pr-6 font-['Cormorant_Garamond'] text-base">{formatPrice(order.total)}</td>
                        <td className="py-3.5 pr-6 text-black/40">{order.date}</td>
                        <td className="py-3.5"><span className={statusBadge(order.status)}>{order.status}</span></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-black/50 tracking-wide">{filteredProducts.length} sản phẩm</p>
                <button onClick={openAddProduct} className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors">
                  <Plus size={14} /> Thêm sản phẩm
                </button>
              </div>
              <div className="bg-white border border-black/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-black/10 bg-[#F8F8F6]">{['Sản phẩm','Danh mục','Giá','Tồn kho','Trạng thái','Thao tác'].map(h=><th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal">{h}</th>)}</tr></thead>
                    <tbody>{filteredProducts.map(product=>(
                      <tr key={product.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="w-10 h-12 bg-[#F5F5F3] overflow-hidden shrink-0"><img src={product.images[0]} alt="" className="w-full h-full object-cover" /></div><div><p className="tracking-wide font-medium">{product.name}</p><p className="text-black/30 text-[10px] mt-0.5">{product.id}</p></div></div></td>
                        <td className="px-6 py-4 text-black/50">{product.category}</td>
                        <td className="px-6 py-4 font-['Cormorant_Garamond'] text-base">{formatPrice(product.price)}</td>
                        <td className="px-6 py-4"><span className={`text-[9px] tracking-wider px-2 py-1 ${product.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{product.stock} chiếc</span></td>
                        <td className="px-6 py-4"><div className="flex gap-1 flex-wrap">{product.isNew && <span className="text-[9px] tracking-wider bg-black text-white px-1.5 py-0.5">Mới</span>}{product.isBestseller && <span className="text-[9px] tracking-wider bg-gray-100 px-1.5 py-0.5">Bán chạy</span>}{product.isFlashSale && <span className="text-[9px] tracking-wider bg-red-100 text-red-700 px-1.5 py-0.5">Sale</span>}</div></td>
                        <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => openEditProduct(product)} className="w-7 h-7 border border-black/15 flex items-center justify-center hover:border-black transition-colors"><Pencil size={11} /></button><button onClick={() => confirmDeleteProduct(product.id)} className="w-7 h-7 border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors text-red-400"><Trash2 size={11} /></button></div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              <AnimatePresence>
                {(showAddProduct || editingProduct) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                        <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }}><X size={18} /></button>
                      </div>
                      <div className="p-6 grid grid-cols-2 gap-5">
                        <div className="col-span-2"><label className={labelCls}>Tên sản phẩm</label><input type="text" value={productForm.name} onChange={e => setProductForm(f => ({...f, name: e.target.value}))} placeholder="Áo khoác Void Oversized" className={inputCls} /></div>
                        <div><label className={labelCls}>Giá (VNĐ)</label><input type="number" value={productForm.price || ''} onChange={e => setProductForm(f => ({...f, price: Number(e.target.value)}))} placeholder="289000" className={inputCls} /></div>
                        <div><label className={labelCls}>Giá gốc</label><input type="number" value={productForm.originalPrice || ''} onChange={e => setProductForm(f => ({...f, originalPrice: Number(e.target.value)}))} placeholder="389000" className={inputCls} /></div>
                        <div><label className={labelCls}>Tồn kho</label><input type="number" value={productForm.stock || ''} onChange={e => setProductForm(f => ({...f, stock: Number(e.target.value)}))} placeholder="20" className={inputCls} /></div>
                        <div><label className={labelCls}>Danh mục</label><select value={productForm.category} onChange={e => setProductForm(f => ({...f, category: e.target.value}))} className={`${inputCls} bg-white`}>{
                          ['Áo khoác','Áo','Quần & Váy','Đầm','Phụ kiện'].map(cat=><option key={cat} value={cat}>{cat}</option>)
                        }</select></div>
                        <div className="col-span-2"><label className={labelCls}>URL hình ảnh (phân cách bằng dấu phẩy)</label><input type="text" value={productForm.images.join(', ')} onChange={e => setProductForm(f => ({...f, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))} placeholder="https://..." className={inputCls} /></div>
                        <div><label className={labelCls}>Kích cỡ (phân cách bằng dấu phẩy)</label><input type="text" value={productForm.sizes.join(', ')} onChange={e => setProductForm(f => ({...f, sizes: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))} placeholder="S, M, L, XL" className={inputCls} /></div>
                        <div><label className={labelCls}>Màu sắc (phân cách bằng dấu phẩy)</label><input type="text" value={productForm.colors.join(', ')} onChange={e => setProductForm(f => ({...f, colors: e.target.value.split(',').map(s => s.trim()).filter(Boolean)}))} placeholder="Đen, Trắng" className={inputCls} /></div>
                        <div className="col-span-2"><label className={labelCls}>Mô tả</label><textarea rows={3} value={productForm.description} onChange={e => setProductForm(f => ({...f, description: e.target.value}))} className={`${inputCls} resize-none tracking-wide`} placeholder="Mô tả sản phẩm..." /></div>
                        <div className="col-span-2 flex gap-6">
                          <label className="flex items-center gap-2 text-xs tracking-wide cursor-pointer"><input type="checkbox" checked={productForm.isNew} onChange={e => setProductForm(f => ({...f, isNew: e.target.checked}))} className="accent-black" /> Sản phẩm mới</label>
                          <label className="flex items-center gap-2 text-xs tracking-wide cursor-pointer"><input type="checkbox" checked={productForm.isBestseller} onChange={e => setProductForm(f => ({...f, isBestseller: e.target.checked}))} className="accent-black" /> Bán chạy</label>
                        </div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex gap-3 justify-end">
                        <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="px-6 py-3 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={saveProduct} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">{editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Product Delete Confirmation */}
              <AnimatePresence>
                {deletingProduct && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setDeletingProduct(null)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                      <h3 className="font-['Cormorant_Garamond'] text-xl mb-2">Xác nhận xóa</h3>
                      <p className="text-sm text-black/50 mb-6">Bạn có chắc chắn muốn xóa sản phẩm <strong>{localProducts.find(p => p.id === deletingProduct)?.name}</strong>? Hành động này không thể hoàn tác.</p>
                      <div className="flex gap-3 justify-end">
                        <button onClick={() => setDeletingProduct(null)} className="px-5 py-2.5 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={executeDeleteProduct} className="px-5 py-2.5 bg-red-600 text-white text-xs tracking-[0.2em] uppercase hover:bg-red-700 transition-colors">Xóa</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div>
              <div className="bg-white border border-black/10">
                <div className="p-6 border-b border-black/10"><h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý đơn hàng</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-black/10 bg-[#F8F8F6]">{['Mã đơn hàng','Khách hàng','Sản phẩm','Tổng cộng','Ngày','Trạng thái','Thao tác'].map(h=><th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal">{h}</th>)}</tr></thead>
                    <tbody>{localOrders.map(order=>(
                      <tr key={order.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                        <td className="px-6 py-4 font-medium tracking-wide">{order.id}</td>
                        <td className="px-6 py-4 text-black/70">{order.customer}</td>
                        <td className="px-6 py-4 text-black/50">{order.items}</td>
                        <td className="px-6 py-4 font-['Cormorant_Garamond'] text-base">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 text-black/40">{order.date}</td>
                        <td className="px-6 py-4"><span className={statusBadge(order.status)}>{order.status}</span></td>
                        <td className="px-6 py-4"><div className="flex gap-2">
                          <button onClick={() => setViewingOrder(order)} className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Xem</button>
                          <button onClick={() => setUpdatingOrder(order)} className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Cập nhật</button>
                        </div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {/* View Order Modal */}
              <AnimatePresence>
                {viewingOrder && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setViewingOrder(null)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-md" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">Chi tiết đơn hàng</h2>
                        <button onClick={() => setViewingOrder(null)}><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div><p className={labelCls}>Mã đơn hàng</p><p className="text-sm font-medium">{viewingOrder.id}</p></div>
                          <div><p className={labelCls}>Khách hàng</p><p className="text-sm font-medium">{viewingOrder.customer}</p></div>
                          <div><p className={labelCls}>Tổng cộng</p><p className="text-sm font-['Cormorant_Garamond'] text-lg">{formatPrice(viewingOrder.total)}</p></div>
                          <div><p className={labelCls}>Số sản phẩm</p><p className="text-sm font-medium">{viewingOrder.items} sản phẩm</p></div>
                          <div><p className={labelCls}>Ngày đặt</p><p className="text-sm text-black/60">{viewingOrder.date}</p></div>
                          <div><p className={labelCls}>Trạng thái</p><span className={statusBadge(viewingOrder.status)}>{viewingOrder.status}</span></div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex justify-end">
                        <button onClick={() => setViewingOrder(null)} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">Đóng</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Update Order Status Modal */}
              <AnimatePresence>
                {updatingOrder && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setUpdatingOrder(null)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">Cập nhật trạng thái</h2>
                        <button onClick={() => setUpdatingOrder(null)}><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-4">
                        <p className="text-sm text-black/50">Đơn hàng: <strong>{updatingOrder.id}</strong></p>
                        <p className="text-xs text-black/40 mb-2">Trạng thái hiện tại: <span className={statusBadge(updatingOrder.status)}>{updatingOrder.status}</span></p>
                        <div className="space-y-2 mt-4">
                          {['Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'].map(s => (
                            <button key={s} onClick={() => updateOrderStatus(updatingOrder.id, s)}
                              className={`w-full text-left px-4 py-3 border text-xs tracking-wider transition-all ${updatingOrder.status === s ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div>
              <div className="bg-white border border-black/10">
                <div className="p-6 border-b border-black/10 flex items-center justify-between">
                  <h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý người dùng</h2>
                  <span className="text-sm text-black/40">Tổng {adminUsers.length} người dùng</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-black/10 bg-[#F8F8F6]">{['Người dùng','Email','Điểm','Đơn hàng','Tham gia','Trạng thái','Thao tác'].map(h=><th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal">{h}</th>)}</tr></thead>
                    <tbody>{adminUsers.map(u=>(
                      <tr key={u.id} className={`border-b border-black/5 hover:bg-black/2 transition-colors ${blockedUsers.includes(u.id) ? 'opacity-50' : ''}`}>
                        <td className="px-6 py-4 font-medium tracking-wide">{u.name}</td>
                        <td className="px-6 py-4 text-black/50">{u.email}</td>
                        <td className="px-6 py-4 font-['Cormorant_Garamond'] text-base">{u.points.toLocaleString()}</td>
                        <td className="px-6 py-4 text-black/50">{u.orders}</td>
                        <td className="px-6 py-4 text-black/40">{u.joined}</td>
                        <td className="px-6 py-4"><span className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${blockedUsers.includes(u.id) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{blockedUsers.includes(u.id) ? 'Đã chặn' : 'Hoạt động'}</span></td>
                        <td className="px-6 py-4"><div className="flex gap-2">
                          <button onClick={() => setViewingUser(u)} className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Xem</button>
                          <button onClick={() => toggleBlockUser(u.id)} className={`text-[9px] tracking-wider border px-2.5 py-1 transition-colors ${blockedUsers.includes(u.id) ? 'border-green-300 text-green-600 hover:bg-green-50' : 'border-red-200 text-red-500 hover:bg-red-50'}`}>{blockedUsers.includes(u.id) ? 'Mở chặn' : 'Chặn'}</button>
                        </div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
              {/* View User Modal */}
              <AnimatePresence>
                {viewingUser && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setViewingUser(null)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-md" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">Thông tin người dùng</h2>
                        <button onClick={() => setViewingUser(null)}><X size={18} /></button>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-lg font-['Cormorant_Garamond']">{viewingUser.name.charAt(0)}</div>
                          <div>
                            <h3 className="font-['Cormorant_Garamond'] text-xl">{viewingUser.name}</h3>
                            <p className="text-xs text-black/40">{viewingUser.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="border border-black/10 p-4"><p className={labelCls}>Điểm tích lũy</p><p className="font-['Cormorant_Garamond'] text-2xl">{viewingUser.points.toLocaleString()}</p></div>
                          <div className="border border-black/10 p-4"><p className={labelCls}>Tổng đơn hàng</p><p className="font-['Cormorant_Garamond'] text-2xl">{viewingUser.orders}</p></div>
                          <div className="border border-black/10 p-4"><p className={labelCls}>Ngày tham gia</p><p className="text-sm">{viewingUser.joined}</p></div>
                          <div className="border border-black/10 p-4"><p className={labelCls}>Trạng thái</p><span className={`text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${blockedUsers.includes(viewingUser.id) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{blockedUsers.includes(viewingUser.id) ? 'Đã chặn' : 'Hoạt động'}</span></div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex justify-end"><button onClick={() => setViewingUser(null)} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">Đóng</button></div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* BLOG */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-black/50">{localBlogPosts.length} bài viết</p>
                <button onClick={openAddBlog} className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors"><Plus size={14} /> Bài viết mới</button>
              </div>
              <div className="space-y-4">
                {localBlogPosts.map(post=>(
                  <div key={post.id} className="bg-white border border-black/10 p-5 flex items-center gap-5">
                    <div className="w-16 h-16 overflow-hidden bg-[#F5F5F3] shrink-0"><img src={post.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 mb-1">{post.category}</p>
                      <h3 className="font-['Cormorant_Garamond'] text-lg truncate">{post.title}</h3>
                      <p className="text-xs text-black/40 mt-1">{post.author} · {post.date} · {post.readTime} phút đọc</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEditBlog(post)} className="w-7 h-7 border border-black/15 flex items-center justify-center hover:border-black transition-colors"><Pencil size={11} /></button>
                      <button onClick={() => deleteBlog(post.id)} className="w-7 h-7 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Blog Modal */}
              <AnimatePresence>
                {showBlogModal && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowBlogModal(false)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">{editingBlog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}</h2>
                        <button onClick={() => setShowBlogModal(false)}><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-5">
                        <div><label className={labelCls}>Tiêu đề</label><input type="text" value={blogForm.title} onChange={e => setBlogForm(f => ({...f, title: e.target.value}))} className={inputCls} placeholder="Tiêu đề bài viết..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelCls}>Danh mục</label><select value={blogForm.category} onChange={e => setBlogForm(f => ({...f, category: e.target.value}))} className={`${inputCls} bg-white`}>
                            <option value="">Chọn danh mục</option>{['Triết lý', 'Hướng dẫn Phong cách', 'Văn hóa', 'Kiến thức', 'Xu hướng'].map(c=><option key={c} value={c}>{c}</option>)}
                          </select></div>
                          <div><label className={labelCls}>Tác giả</label><input type="text" value={blogForm.author} onChange={e => setBlogForm(f => ({...f, author: e.target.value}))} className={inputCls} placeholder="Tên tác giả..." /></div>
                        </div>
                        <div><label className={labelCls}>URL hình ảnh</label><input type="text" value={blogForm.image} onChange={e => setBlogForm(f => ({...f, image: e.target.value}))} className={inputCls} placeholder="https://..." /></div>
                        {blogForm.image && <img src={blogForm.image} alt="Preview" className="w-full h-32 object-cover border border-black/10" />}
                        <div><label className={labelCls}>Nội dung</label><textarea rows={8} value={blogForm.content} onChange={e => setBlogForm(f => ({...f, content: e.target.value}))} className={`${inputCls} resize-none`} placeholder="Nội dung bài viết..." /></div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex gap-3 justify-end">
                        <button onClick={() => setShowBlogModal(false)} className="px-6 py-3 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={saveBlog} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">{editingBlog ? 'Lưu' : 'Tạo'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* FLASH SALES */}
          {activeTab === 'flash' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Cormorant_Garamond'] text-2xl">Chiến dịch Giảm giá Sốc</h2>
                <button onClick={openAddFlash} className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3"><Plus size={14} /> Chiến dịch mới</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashCampaigns.map(campaign=>(
                  <motion.div key={campaign.id} layout className="bg-white border border-black/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="font-['Cormorant_Garamond'] text-xl">{campaign.name}</h3><p className="text-xs text-black/40 mt-1">{campaign.products} sản phẩm · giảm {campaign.discount}%</p></div>
                      <span className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 ${campaign.status==='Hoạt động'?'bg-green-100 text-green-800':campaign.status==='Đã lên lịch'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-600'}`}>{campaign.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Còn lại</p><p className="text-sm font-medium">{campaign.ends}</p></div>
                      <div><p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Doanh thu</p><p className="text-sm font-['Cormorant_Garamond'] text-base">{campaign.revenue}</p></div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => openEditFlash(campaign)} className="text-[9px] tracking-wider border border-black/20 px-3 py-1.5 hover:border-black transition-colors">Sửa</button>
                      {campaign.status === 'Hoạt động' && <button onClick={() => endFlashCampaign(campaign.id)} className="text-[9px] tracking-wider border border-red-200 text-red-500 px-3 py-1.5 hover:bg-red-50 transition-colors">Kết thúc</button>}
                    </div>
                  </motion.div>
                ))}
              </div>
              {/* Flash Sale Modal */}
              <AnimatePresence>
                {showFlashModal && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowFlashModal(false)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-lg" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">{editingFlash ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}</h2>
                        <button onClick={() => setShowFlashModal(false)}><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-5">
                        <div><label className={labelCls}>Tên chiến dịch</label><input type="text" value={flashForm.name} onChange={e => setFlashForm(f => ({...f, name: e.target.value}))} className={inputCls} placeholder="Ưu đãi mùa hè..." /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelCls}>Số sản phẩm</label><input type="number" value={flashForm.products} onChange={e => setFlashForm(f => ({...f, products: Number(e.target.value)}))} className={inputCls} /></div>
                          <div><label className={labelCls}>Giảm giá (%)</label><input type="number" value={flashForm.discount} onChange={e => setFlashForm(f => ({...f, discount: Number(e.target.value)}))} className={inputCls} /></div>
                        </div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex gap-3 justify-end">
                        <button onClick={() => setShowFlashModal(false)} className="px-6 py-3 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={saveFlash} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">{editingFlash ? 'Lưu' : 'Tạo'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* POINTS CONFIG */}
          {activeTab === 'points' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl">Cấu hình điểm thưởng</h2>
                  <p className="text-xs text-black/40 mt-1">Thiết lập mốc giá và số điểm tương ứng</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={addPointsRule} className="flex items-center gap-2 border border-black/20 text-xs tracking-[0.2em] uppercase px-5 py-3 hover:border-black transition-colors">
                    <Plus size={14} /> Thêm mốc
                  </button>
                  {pointsChanged && (
                    <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      onClick={savePointsConfig}
                      className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors">
                      <Save size={14} /> Lưu thay đổi
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="bg-white border border-black/10 p-6 mb-6">
                <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 mb-4">Cách tính: Sản phẩm có giá ≥ Mốc giá → Nhận số điểm tương ứng (chọn mốc cao nhất phù hợp)</p>
                <div className="space-y-4">
                  {editingPoints.map((rule, index) => (
                    <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-[1fr_1fr_auto] gap-4 items-end p-4 border border-black/10 bg-[#F8F8F6]">
                      <div>
                        <label className={labelCls}>Giá sản phẩm từ (VNĐ)</label>
                        <input type="number" value={rule.minPrice} onChange={e => handlePointsRuleChange(index, 'minPrice', Number(e.target.value))} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Số điểm nhận được</label>
                        <input type="number" value={rule.points} onChange={e => handlePointsRuleChange(index, 'points', Number(e.target.value))} className={inputCls} />
                      </div>
                      <button onClick={() => removePointsRule(index)} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors mb-0.5">
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-white border border-black/10 p-6">
                <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">Xem trước (điểm nhận theo giá sản phẩm)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[100000, 300000, 700000, 1500000].map(sample => {
                    const sorted = [...editingPoints].sort((a, b) => b.minPrice - a.minPrice);
                    const match = sorted.find(r => sample >= r.minPrice);
                    const pts = match ? match.points : 0;
                    return (
                      <div key={sample} className="border border-black/10 p-4">
                        <p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Sản phẩm {formatPrice(sample)}</p>
                        <p className="font-['Cormorant_Garamond'] text-2xl">{pts.toLocaleString()}</p>
                        <p className="text-xs text-black/40 mt-1">điểm / sản phẩm</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* REWARDS MANAGEMENT */}
          {activeTab === 'rewards' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý Ưu đãi</h2>
                  <p className="text-xs text-black/40 mt-1">{rewardItems.length} phần thưởng · {rewardItems.filter(r => r.active).length} đang hoạt động</p>
                </div>
                <button onClick={openAddReward} className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors">
                  <Plus size={14} /> Thêm ưu đãi
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[
                  { label: 'Tổng điểm đã cấp', value: '1,284,500' },
                  { label: 'Tổng điểm đã đổi', value: '847,200' },
                  { label: 'Thành viên hoạt động', value: '1,847' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white border border-black/10 p-6">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 mb-3">{stat.label}</p>
                    <p className="font-['Cormorant_Garamond'] text-4xl">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Rewards list */}
              <div className="space-y-3">
                {rewardItems.map((reward, i) => (
                  <motion.div key={reward.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className={`bg-white border p-5 flex items-center gap-5 transition-all ${reward.active ? 'border-black/10' : 'border-black/5 opacity-60'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-['Cormorant_Garamond'] text-lg">{reward.name}</h3>
                        <span className={`text-[9px] tracking-wider px-2 py-0.5 ${reward.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {reward.active ? 'Hoạt động' : 'Tạm dừng'}
                        </span>
                      </div>
                      <p className="text-xs text-black/40 tracking-wide">{reward.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-black/50">
                        <span>{reward.points.toLocaleString()} điểm</span>
                        <span>Loại: {reward.type}</span>
                        {reward.value > 0 && <span>Trị giá: {formatPrice(reward.value)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => updateRewardItem(reward.id, { active: !reward.active })} className="text-black/40 hover:text-black transition-colors" title={reward.active ? 'Tạm dừng' : 'Kích hoạt'}>
                        {reward.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                      </button>
                      <button onClick={() => openEditReward(reward)} className="w-8 h-8 border border-black/15 flex items-center justify-center hover:border-black transition-colors"><Pencil size={12} /></button>
                      <button onClick={() => deleteRewardItem(reward.id)} className="w-8 h-8 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Add/Edit Reward Modal */}
              <AnimatePresence>
                {showAddReward && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowAddReward(false)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-lg" onClick={e => e.stopPropagation()}>
                      <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <h2 className="font-['Cormorant_Garamond'] text-2xl">{editingReward ? 'Chỉnh sửa ưu đãi' : 'Thêm ưu đãi mới'}</h2>
                        <button onClick={() => setShowAddReward(false)}><X size={18} /></button>
                      </div>
                      <div className="p-6 space-y-5">
                        <div><label className={labelCls}>Tên ưu đãi</label><input type="text" value={rewardForm.name} onChange={e => setRewardForm(f => ({...f, name: e.target.value}))} className={inputCls} placeholder="Giảm giá 50.000 VNĐ" /></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div><label className={labelCls}>Số điểm cần đổi</label><input type="number" value={rewardForm.points} onChange={e => setRewardForm(f => ({...f, points: Number(e.target.value)}))} className={inputCls} /></div>
                          <div><label className={labelCls}>Trị giá (VNĐ)</label><input type="number" value={rewardForm.value} onChange={e => setRewardForm(f => ({...f, value: Number(e.target.value)}))} className={inputCls} /></div>
                        </div>
                        <div><label className={labelCls}>Loại</label>
                          <select value={rewardForm.type} onChange={e => setRewardForm(f => ({...f, type: e.target.value as RewardItem['type']}))} className={`${inputCls} bg-white`}>
                            <option value="voucher">Voucher giảm giá</option><option value="shipping">Miễn phí vận chuyển</option><option value="gift">Quà tặng</option><option value="product">Sản phẩm</option>
                          </select>
                        </div>
                        <div><label className={labelCls}>Mô tả</label><textarea rows={2} value={rewardForm.description} onChange={e => setRewardForm(f => ({...f, description: e.target.value}))} className={`${inputCls} resize-none`} placeholder="Mô tả ưu đãi..." /></div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex gap-3 justify-end">
                        <button onClick={() => setShowAddReward(false)} className="px-6 py-3 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={saveReward} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">{editingReward ? 'Lưu' : 'Tạo'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ABOUT PAGE EDITOR */}
          {activeTab === 'about' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý trang Giới thiệu</h2>
                  <p className="text-xs text-black/40 mt-1">Chỉnh sửa toàn bộ nội dung trang About Us</p>
                </div>
                {aboutChanged && (
                  <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={saveAboutContent}
                    className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors">
                    <Save size={14} /> Lưu thay đổi
                  </motion.button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { key: 'hero', label: 'Hero & CTA' },
                  { key: 'brand', label: 'Câu chuyện' },
                  { key: 'founder', label: 'Sáng lập' },
                  { key: 'values', label: 'Giá trị & Thống kê' },
                  { key: 'timeline', label: 'Lịch sử' },
                  { key: 'gallery', label: 'Bộ ảnh' },
                  { key: 'trends', label: 'Xu hướng' },
                ].map(sec => (
                  <button key={sec.key} onClick={() => setAboutSection(sec.key)}
                    className={`text-[10px] tracking-[0.2em] uppercase px-4 py-2.5 border transition-all ${aboutSection === sec.key ? 'bg-black text-white border-black' : 'border-black/20 hover:border-black'}`}>
                    {sec.label}
                  </button>
                ))}
              </div>

              <div className="bg-white border border-black/10 p-6 space-y-5">
                {/* HERO & CTA & QUOTE */}
                {aboutSection === 'hero' && (<>
                  <h3 className="font-['Cormorant_Garamond'] text-xl">Hero Banner</h3>
                  <div><label className={labelCls}>Tiêu đề</label><input value={editingAbout.hero.title} onChange={e => updateEA({ hero: { ...editingAbout.hero, title: e.target.value } })} className={inputCls} /></div>
                  <div><label className={labelCls}>Phụ đề</label><input value={editingAbout.hero.subtitle} onChange={e => updateEA({ hero: { ...editingAbout.hero, subtitle: e.target.value } })} className={inputCls} /></div>
                  <div><label className={labelCls}>URL hình nền</label><input value={editingAbout.hero.image} onChange={e => updateEA({ hero: { ...editingAbout.hero, image: e.target.value } })} className={inputCls} /></div>
                  {editingAbout.hero.image && <img src={editingAbout.hero.image} alt="Preview" className="w-full h-32 object-cover border border-black/10" />}
                  <div className="border-t border-black/10 pt-5 mt-5">
                    <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">CTA Banner (cuối trang)</h3>
                    <div><label className={labelCls}>Tiêu đề</label><input value={editingAbout.cta.title} onChange={e => updateEA({ cta: { ...editingAbout.cta, title: e.target.value } })} className={inputCls} /></div>
                    <div className="mt-4"><label className={labelCls}>URL hình nền</label><input value={editingAbout.cta.image} onChange={e => updateEA({ cta: { ...editingAbout.cta, image: e.target.value } })} className={inputCls} /></div>
                  </div>
                  <div className="border-t border-black/10 pt-5 mt-5">
                    <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">Trích dẫn thương hiệu</h3>
                    <div><label className={labelCls}>Nội dung</label><textarea value={editingAbout.brandQuote.text} onChange={e => updateEA({ brandQuote: { ...editingAbout.brandQuote, text: e.target.value } })} className={`${inputCls} resize-none`} rows={3} /></div>
                    <div className="mt-4"><label className={labelCls}>Tác giả</label><input value={editingAbout.brandQuote.author} onChange={e => updateEA({ brandQuote: { ...editingAbout.brandQuote, author: e.target.value } })} className={inputCls} /></div>
                  </div>
                </>)}

                {/* BRAND STORY */}
                {aboutSection === 'brand' && (<>
                  <h3 className="font-['Cormorant_Garamond'] text-xl">Câu chuyện thương hiệu</h3>
                  <div><label className={labelCls}>URL hình ảnh</label><input value={editingAbout.brandStory.image} onChange={e => updateEA({ brandStory: { ...editingAbout.brandStory, image: e.target.value } })} className={inputCls} /></div>
                  {editingAbout.brandStory.image && <img src={editingAbout.brandStory.image} alt="Preview" className="w-48 h-32 object-cover border border-black/10 mt-2" />}
                  <div><label className={labelCls}>Nội dung (mỗi đoạn cách bằng dòng trống)</label>
                    <textarea value={editingAbout.brandStory.paragraphs.join('\n\n')} onChange={e => updateEA({ brandStory: { ...editingAbout.brandStory, paragraphs: e.target.value.split('\n\n').filter(p => p.trim()) } })} className={`${inputCls} resize-none`} rows={10} />
                  </div>
                </>)}

                {/* FOUNDER */}
                {aboutSection === 'founder' && (<>
                  <h3 className="font-['Cormorant_Garamond'] text-xl">Người sáng lập</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Họ tên</label><input value={editingAbout.founder.name} onChange={e => updateEA({ founder: { ...editingAbout.founder, name: e.target.value } })} className={inputCls} /></div>
                    <div><label className={labelCls}>Chức danh</label><input value={editingAbout.founder.title} onChange={e => updateEA({ founder: { ...editingAbout.founder, title: e.target.value } })} className={inputCls} /></div>
                  </div>
                  <div><label className={labelCls}>URL ảnh chân dung</label><input value={editingAbout.founder.image} onChange={e => updateEA({ founder: { ...editingAbout.founder, image: e.target.value } })} className={inputCls} /></div>
                  {editingAbout.founder.image && <img src={editingAbout.founder.image} alt="Preview" className="w-32 h-40 object-cover border border-black/10 mt-2" />}
                  <div><label className={labelCls}>Tiểu sử (mỗi đoạn cách bằng dòng trống)</label>
                    <textarea value={editingAbout.founder.bio.join('\n\n')} onChange={e => updateEA({ founder: { ...editingAbout.founder, bio: e.target.value.split('\n\n').filter(p => p.trim()) } })} className={`${inputCls} resize-none`} rows={12} />
                  </div>
                  <div><label className={labelCls}>Trích dẫn</label><textarea value={editingAbout.founder.quote} onChange={e => updateEA({ founder: { ...editingAbout.founder, quote: e.target.value } })} className={`${inputCls} resize-none`} rows={2} /></div>
                  <div className="mt-2">
                    <label className={labelCls}>Thống kê</label>
                    <div className="space-y-3 mt-2">
                      {editingAbout.founder.stats.map((stat, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end">
                          <div><label className={labelCls}>Nhãn</label><input value={stat.label} onChange={e => { const s = [...editingAbout.founder.stats]; s[i] = { ...s[i], label: e.target.value }; updateEA({ founder: { ...editingAbout.founder, stats: s } }); }} className={inputCls} /></div>
                          <div><label className={labelCls}>Giá trị</label><input value={stat.value} onChange={e => { const s = [...editingAbout.founder.stats]; s[i] = { ...s[i], value: e.target.value }; updateEA({ founder: { ...editingAbout.founder, stats: s } }); }} className={inputCls} /></div>
                          <button onClick={() => updateEA({ founder: { ...editingAbout.founder, stats: editingAbout.founder.stats.filter((_, idx) => idx !== i) } })} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 mb-0.5"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => updateEA({ founder: { ...editingAbout.founder, stats: [...editingAbout.founder.stats, { label: '', value: '' }] } })} className="flex items-center gap-2 text-xs tracking-wider border border-black/20 px-4 py-2 hover:border-black"><Plus size={12} /> Thêm</button>
                    </div>
                  </div>
                </>)}

                {/* VALUES & STATS */}
                {aboutSection === 'values' && (<>
                  <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">Giá trị cốt lõi</h3>
                  <div className="space-y-4">
                    {editingAbout.coreValues.map((val, i) => (
                      <div key={val.id} className="border border-black/10 p-4 bg-[#F8F8F6]">
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <div><label className={labelCls}>Tiêu đề</label><input value={val.title} onChange={e => { const cv = [...editingAbout.coreValues]; cv[i] = { ...cv[i], title: e.target.value }; updateEA({ coreValues: cv }); }} className={inputCls} /></div>
                          <div><label className={labelCls}>Phụ đề (EN)</label><input value={val.subtitle} onChange={e => { const cv = [...editingAbout.coreValues]; cv[i] = { ...cv[i], subtitle: e.target.value }; updateEA({ coreValues: cv }); }} className={inputCls} /></div>
                        </div>
                        <div><label className={labelCls}>Mô tả</label><textarea value={val.description} onChange={e => { const cv = [...editingAbout.coreValues]; cv[i] = { ...cv[i], description: e.target.value }; updateEA({ coreValues: cv }); }} className={`${inputCls} resize-none`} rows={2} /></div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-black/10 pt-6 mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-['Cormorant_Garamond'] text-xl">Thống kê nổi bật</h3>
                      <button onClick={() => updateEA({ stats: [...editingAbout.stats, { value: '', label: '' }] })} className="flex items-center gap-2 text-xs tracking-wider border border-black/20 px-4 py-2 hover:border-black"><Plus size={12} /> Thêm</button>
                    </div>
                    <div className="space-y-3">
                      {editingAbout.stats.map((stat, i) => (
                        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end p-3 border border-black/10 bg-[#F8F8F6]">
                          <div><label className={labelCls}>Giá trị</label><input value={stat.value} onChange={e => { const s = [...editingAbout.stats]; s[i] = { ...s[i], value: e.target.value }; updateEA({ stats: s }); }} className={inputCls} /></div>
                          <div><label className={labelCls}>Nhãn</label><input value={stat.label} onChange={e => { const s = [...editingAbout.stats]; s[i] = { ...s[i], label: e.target.value }; updateEA({ stats: s }); }} className={inputCls} /></div>
                          <button onClick={() => updateEA({ stats: editingAbout.stats.filter((_, idx) => idx !== i) })} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 mb-0.5"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>)}

                {/* TIMELINE */}
                {aboutSection === 'timeline' && (<>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Cormorant_Garamond'] text-xl">Lịch sử phát triển</h3>
                    <button onClick={() => updateEA({ timeline: [...editingAbout.timeline, { id: Date.now().toString(36), year: '', title: '', description: '' }] })} className="flex items-center gap-2 text-xs tracking-wider border border-black/20 px-4 py-2 hover:border-black"><Plus size={12} /> Thêm mốc</button>
                  </div>
                  <div className="space-y-4">
                    {editingAbout.timeline.map((ev, i) => (
                      <motion.div key={ev.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border border-black/10 p-4 bg-[#F8F8F6]">
                        <div className="grid grid-cols-[100px_1fr_auto] gap-3 items-start">
                          <div><label className={labelCls}>Năm</label><input value={ev.year} onChange={e => { const t = [...editingAbout.timeline]; t[i] = { ...t[i], year: e.target.value }; updateEA({ timeline: t }); }} className={inputCls} /></div>
                          <div><label className={labelCls}>Tiêu đề</label><input value={ev.title} onChange={e => { const t = [...editingAbout.timeline]; t[i] = { ...t[i], title: e.target.value }; updateEA({ timeline: t }); }} className={inputCls} /></div>
                          <button onClick={() => updateEA({ timeline: editingAbout.timeline.filter(t => t.id !== ev.id) })} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 mt-5"><Trash2 size={14} /></button>
                        </div>
                        <div className="mt-3"><label className={labelCls}>Mô tả</label><textarea value={ev.description} onChange={e => { const t = [...editingAbout.timeline]; t[i] = { ...t[i], description: e.target.value }; updateEA({ timeline: t }); }} className={`${inputCls} resize-none`} rows={2} /></div>
                      </motion.div>
                    ))}
                  </div>
                </>)}

                {/* GALLERY */}
                {aboutSection === 'gallery' && (<>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Cormorant_Garamond'] text-xl">Bộ ảnh nghệ thuật</h3>
                    <button onClick={() => updateEA({ gallery: [...editingAbout.gallery, { id: Date.now().toString(36), src: '', alt: '' }] })} className="flex items-center gap-2 text-xs tracking-wider border border-black/20 px-4 py-2 hover:border-black"><ImagePlus size={12} /> Thêm ảnh</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editingAbout.gallery.map((img, i) => (
                      <div key={img.id} className="border border-black/10 p-4 bg-[#F8F8F6]">
                        {img.src && <img src={img.src} alt={img.alt} className="w-full h-32 object-cover mb-3" />}
                        <div><label className={labelCls}>URL hình ảnh</label><input value={img.src} onChange={e => { const g = [...editingAbout.gallery]; g[i] = { ...g[i], src: e.target.value }; updateEA({ gallery: g }); }} className={inputCls} /></div>
                        <div className="mt-2 flex gap-2">
                          <div className="flex-1"><label className={labelCls}>Mô tả ảnh</label><input value={img.alt} onChange={e => { const g = [...editingAbout.gallery]; g[i] = { ...g[i], alt: e.target.value }; updateEA({ gallery: g }); }} className={inputCls} /></div>
                          <button onClick={() => updateEA({ gallery: editingAbout.gallery.filter(g => g.id !== img.id) })} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 self-end mb-0.5"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>)}

                {/* TRENDS */}
                {aboutSection === 'trends' && (<>
                  <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">Xu hướng & Tầm nhìn</h3>
                  <div><label className={labelCls}>URL hình ảnh</label><input value={editingAbout.vision.image} onChange={e => updateEA({ vision: { image: e.target.value } })} className={inputCls} /></div>
                  {editingAbout.vision.image && <img src={editingAbout.vision.image} alt="Preview" className="w-48 h-32 object-cover border border-black/10 mt-2" />}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <label className={labelCls}>Các xu hướng</label>
                      <button onClick={() => updateEA({ trends: [...editingAbout.trends, { id: Date.now().toString(36), title: '', desc: '' }] })} className="flex items-center gap-2 text-xs tracking-wider border border-black/20 px-3 py-1.5 hover:border-black"><Plus size={12} /> Thêm</button>
                    </div>
                    <div className="space-y-4">
                      {editingAbout.trends.map((trend, i) => (
                        <div key={trend.id} className="border border-black/10 p-4 bg-[#F8F8F6]">
                          <div className="flex gap-3 items-start">
                            <div className="flex-1"><label className={labelCls}>Tiêu đề</label><input value={trend.title} onChange={e => { const t = [...editingAbout.trends]; t[i] = { ...t[i], title: e.target.value }; updateEA({ trends: t }); }} className={inputCls} /></div>
                            <button onClick={() => updateEA({ trends: editingAbout.trends.filter(t => t.id !== trend.id) })} className="w-10 h-10 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 mt-5"><Trash2 size={14} /></button>
                          </div>
                          <div className="mt-2"><label className={labelCls}>Mô tả</label><textarea value={trend.desc} onChange={e => { const t = [...editingAbout.trends]; t[i] = { ...t[i], desc: e.target.value }; updateEA({ trends: t }); }} className={`${inputCls} resize-none`} rows={2} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>)}
              </div>
            </div>
          )}

          {/* PAYMENTS */}
          {activeTab === 'payments' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Cormorant_Garamond'] text-3xl">Cài đặt thanh toán</h2>
              </div>
              
              <div className="bg-white border border-black/10 p-8 max-w-3xl space-y-8">
                {/* MoMo Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl">Ví MoMo</h3>
                      <p className="text-xs text-black/40 mt-1">Bật/tắt thanh toán qua ví điện tử MoMo</p>
                    </div>
                    <button
                      onClick={() => updatePaymentSettings({ momoEnabled: !paymentSettings.momoEnabled })}
                      className="text-black hover:opacity-60 transition-opacity"
                    >
                      {paymentSettings.momoEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-black/30" />}
                    </button>
                  </div>
                  {paymentSettings.momoEnabled && (
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Đường dẫn ảnh Mã QR MoMo</label>
                      <input
                        type="text"
                        value={paymentSettings.momoQrUrl}
                        onChange={(e) => updatePaymentSettings({ momoQrUrl: e.target.value })}
                        className="w-full border border-black/20 p-3 text-sm focus:border-black outline-none tracking-wide"
                        placeholder="https://link-to-your-qr-code-image.png"
                      />
                      {paymentSettings.momoQrUrl && (
                        <div className="mt-4 border border-black/10 p-2 w-32 h-32 bg-gray-50 flex items-center justify-center">
                          <img src={paymentSettings.momoQrUrl} alt="MoMo QR" className="max-w-full max-h-full object-contain" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Bank Settings */}
                <div>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-black/10">
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl">Chuyển khoản Ngân hàng</h3>
                      <p className="text-xs text-black/40 mt-1">Bật/tắt thanh toán qua chuyển khoản</p>
                    </div>
                    <button
                      onClick={() => updatePaymentSettings({ bankEnabled: !paymentSettings.bankEnabled })}
                      className="text-black hover:opacity-60 transition-opacity"
                    >
                      {paymentSettings.bankEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} className="text-black/30" />}
                    </button>
                  </div>
                  {paymentSettings.bankEnabled && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Tên ngân hàng</label>
                        <input
                          type="text"
                          value={paymentSettings.bankName}
                          onChange={(e) => updatePaymentSettings({ bankName: e.target.value })}
                          className="w-full border border-black/20 p-3 text-sm focus:border-black outline-none tracking-wide"
                          placeholder="Vietcombank"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Số tài khoản</label>
                        <input
                          type="text"
                          value={paymentSettings.bankAccount}
                          onChange={(e) => updatePaymentSettings({ bankAccount: e.target.value })}
                          className="w-full border border-black/20 p-3 text-sm focus:border-black outline-none tracking-wide"
                          placeholder="1234567890"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-black/60 mb-2">Tên chủ tài khoản</label>
                        <input
                          type="text"
                          value={paymentSettings.bankAccountName}
                          onChange={(e) => updatePaymentSettings({ bankAccountName: e.target.value })}
                          className="w-full border border-black/20 p-3 text-sm focus:border-black outline-none tracking-wide"
                          placeholder="KUMO FASHION"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
