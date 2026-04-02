import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, Package, ShoppingCart, Users, FileText, Zap, Award, Coins,
  Plus, Pencil, Trash2, Search, DollarSign, Eye, X, Menu, Save, ToggleLeft, ToggleRight, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { products, formatPrice } from '../data/products';
import { blogPosts } from '../data/blog';
import { useApp, PointsRule, RewardItem } from '../context/AppContext';

type AdminTab = 'dashboard' | 'products' | 'orders' | 'users' | 'blog' | 'flash' | 'rewards' | 'points';

const navItems: { key: AdminTab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { key: 'products', label: 'Sản phẩm', icon: Package },
  { key: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
  { key: 'users', label: 'Người dùng', icon: Users },
  { key: 'blog', label: 'Bài viết', icon: FileText },
  { key: 'flash', label: 'Giảm giá Sốc', icon: Zap },
  { key: 'points', label: 'Cấu hình điểm', icon: Coins },
  { key: 'rewards', label: 'Ưu đãi', icon: Award },
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
  { id: 'u001', name: 'Linh Nguyễn', email: 'linh@email.com', tier: 'Silver', points: 2450, orders: 12, joined: '2025-06-15' },
  { id: 'u002', name: 'Min Jae Kim', email: 'minjae@email.com', tier: 'Gold', points: 6200, orders: 28, joined: '2024-12-01' },
  { id: 'u003', name: 'Sakura H.', email: 'sakura@email.com', tier: 'Bronze', points: 340, orders: 3, joined: '2026-01-20' },
  { id: 'u004', name: 'Phương Lê', email: 'phuong@email.com', tier: 'Platinum', points: 15800, orders: 67, joined: '2024-03-11' },
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
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin, pointsConfig, rewardItems, updatePointsConfig, addRewardItem, updateRewardItem, deleteRewardItem } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Points config state
  const [editingPoints, setEditingPoints] = useState<PointsRule[]>(pointsConfig);
  const [pointsChanged, setPointsChanged] = useState(false);

  // Rewards state
  const [showAddReward, setShowAddReward] = useState(false);
  const [editingReward, setEditingReward] = useState<string | null>(null);
  const [rewardForm, setRewardForm] = useState<Omit<RewardItem, 'id'>>({
    name: '', points: 0, type: 'voucher', value: 0, description: '', active: true
  });

  // Access control
  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full text-center">
          <Shield size={48} className="mx-auto mb-6 text-black/20" strokeWidth={1} />
          <h1 className="font-['Cormorant_Garamond'] text-4xl mb-4">Truy cập bị từ chối</h1>
          <p className="text-black/50 text-sm tracking-wide mb-10">Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
          <button onClick={() => navigate('/login')} className="bg-black text-white text-xs tracking-[0.25em] uppercase py-4 px-10 hover:bg-black/90">
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: 'Tổng doanh thu', value: '₫471,000,000', change: '+18.4%', positive: true, icon: DollarSign },
    { label: 'Đơn hàng tháng này', value: '289', change: '+12.1%', positive: true, icon: ShoppingCart },
    { label: 'Khách hàng mới', value: '1,847', change: '+5.6%', positive: true, icon: Users },
    { label: 'Sản phẩm đang bán', value: products.length.toString(), change: '+2', positive: true, icon: Package },
  ];

  // Points handlers
  const handlePointsRuleChange = (index: number, field: keyof PointsRule, value: number) => {
    const updated = [...editingPoints];
    updated[index] = { ...updated[index], [field]: value };
    setEditingPoints(updated);
    setPointsChanged(true);
  };

  const addPointsRule = () => {
    const newRule: PointsRule = {
      id: Date.now().toString(36),
      minPrice: 0,
      maxPrice: 100000,
      pointsPerUnit: 1,
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
              <Link to="/" className="font-['Cormorant_Garamond'] text-xl tracking-[0.3em] text-white">KUMO</Link>
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
              <Link to="/" className="flex items-center gap-2 text-white/40 text-xs tracking-wider hover:text-white transition-colors">
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
                    <tbody>{mockOrders.map(order=>(
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
                <button onClick={() => setShowAddProduct(true)} className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors">
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
                        <td className="px-6 py-4"><div className="flex gap-2"><button onClick={() => setEditingProduct(product.id)} className="w-7 h-7 border border-black/15 flex items-center justify-center hover:border-black transition-colors"><Pencil size={11} /></button><button className="w-7 h-7 border border-red-200 flex items-center justify-center hover:bg-red-50 transition-colors text-red-400"><Trash2 size={11} /></button></div></td>
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
                        {[{label:'Tên sản phẩm',placeholder:'Áo khoác Void Oversized',full:true},{label:'Giá (VNĐ)',placeholder:'289000'},{label:'Giá gốc',placeholder:'389000'},{label:'Tồn kho',placeholder:'20'}].map(field=>(
                          <div key={field.label} className={field.full?'col-span-2':''}><label className={labelCls}>{field.label}</label><input type="text" placeholder={field.placeholder} className={inputCls} /></div>
                        ))}
                        <div className="col-span-2"><label className={labelCls}>Danh mục</label><select className={`${inputCls} bg-white`}>{['Áo khoác','Áo','Quần & Váy','Đầm','Phụ kiện'].map(cat=><option key={cat} value={cat}>{cat}</option>)}</select></div>
                        <div className="col-span-2"><label className={labelCls}>Mô tả</label><textarea rows={3} className={`${inputCls} resize-none tracking-wide`} placeholder="Mô tả sản phẩm..." /></div>
                      </div>
                      <div className="p-6 border-t border-black/10 flex gap-3 justify-end">
                        <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="px-6 py-3 border border-black/20 text-xs tracking-[0.2em] uppercase hover:border-black transition-colors">Hủy</button>
                        <button onClick={() => { setShowAddProduct(false); setEditingProduct(null); }} className="px-6 py-3 bg-black text-white text-xs tracking-[0.2em] uppercase hover:bg-black/90 transition-colors">{editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white border border-black/10">
              <div className="p-6 border-b border-black/10"><h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý đơn hàng</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-black/10 bg-[#F8F8F6]">{['Mã đơn hàng','Khách hàng','Sản phẩm','Tổng cộng','Ngày','Trạng thái','Thao tác'].map(h=><th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal">{h}</th>)}</tr></thead>
                  <tbody>{mockOrders.map(order=>(
                    <tr key={order.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                      <td className="px-6 py-4 font-medium tracking-wide">{order.id}</td>
                      <td className="px-6 py-4 text-black/70">{order.customer}</td>
                      <td className="px-6 py-4 text-black/50">{order.items}</td>
                      <td className="px-6 py-4 font-['Cormorant_Garamond'] text-base">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4 text-black/40">{order.date}</td>
                      <td className="px-6 py-4"><span className={statusBadge(order.status)}>{order.status}</span></td>
                      <td className="px-6 py-4"><div className="flex gap-2"><button className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Xem</button><button className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Cập nhật</button></div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === 'users' && (
            <div className="bg-white border border-black/10">
              <div className="p-6 border-b border-black/10 flex items-center justify-between">
                <h2 className="font-['Cormorant_Garamond'] text-2xl">Quản lý người dùng</h2>
                <span className="text-sm text-black/40">Tổng {mockUsers.length} người dùng</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="border-b border-black/10 bg-[#F8F8F6]">{['Người dùng','Email','Hạng','Điểm','Đơn hàng','Tham gia','Thao tác'].map(h=><th key={h} className="text-left px-6 py-4 text-[9px] tracking-[0.25em] uppercase text-black/40 font-normal">{h}</th>)}</tr></thead>
                  <tbody>{mockUsers.map(u=>(
                    <tr key={u.id} className="border-b border-black/5 hover:bg-black/2 transition-colors">
                      <td className="px-6 py-4 font-medium tracking-wide">{u.name}</td>
                      <td className="px-6 py-4 text-black/50">{u.email}</td>
                      <td className="px-6 py-4"><span className="text-[9px] tracking-wider border border-black/20 px-2 py-0.5">{u.tier}</span></td>
                      <td className="px-6 py-4 font-['Cormorant_Garamond'] text-base">{u.points.toLocaleString()}</td>
                      <td className="px-6 py-4 text-black/50">{u.orders}</td>
                      <td className="px-6 py-4 text-black/40">{u.joined}</td>
                      <td className="px-6 py-4"><div className="flex gap-2"><button className="text-[9px] tracking-wider border border-black/20 px-2.5 py-1 hover:border-black transition-colors">Xem</button><button className="text-[9px] tracking-wider border border-red-200 px-2.5 py-1 hover:bg-red-50 text-red-500 transition-colors">Chặn</button></div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}

          {/* BLOG */}
          {activeTab === 'blog' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-black/50">{blogPosts.length} bài viết</p>
                <button className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3 hover:bg-black/90 transition-colors"><Plus size={14} /> Bài viết mới</button>
              </div>
              <div className="space-y-4">
                {blogPosts.map(post=>(
                  <div key={post.id} className="bg-white border border-black/10 p-5 flex items-center gap-5">
                    <div className="w-16 h-16 overflow-hidden bg-[#F5F5F3] shrink-0"><img src={post.image} alt="" className="w-full h-full object-cover" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 mb-1">{post.category}</p>
                      <h3 className="font-['Cormorant_Garamond'] text-lg truncate">{post.title}</h3>
                      <p className="text-xs text-black/40 mt-1">{post.author} · {post.date} · {post.readTime} phút đọc</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="w-7 h-7 border border-black/15 flex items-center justify-center hover:border-black transition-colors"><Pencil size={11} /></button>
                      <button className="w-7 h-7 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-400 transition-colors"><Trash2 size={11} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FLASH SALES */}
          {activeTab === 'flash' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['Cormorant_Garamond'] text-2xl">Chiến dịch Giảm giá Sốc</h2>
                <button className="flex items-center gap-2 bg-black text-white text-xs tracking-[0.2em] uppercase px-5 py-3"><Plus size={14} /> Chiến dịch mới</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Ưu đãi Nửa đêm', status: 'Hoạt động', products: 2, discount: 21, ends: '7g 23ph', revenue: '₫4.2M' },
                  { name: 'Đặc biệt Cuối tuần', status: 'Đã lên lịch', products: 5, discount: 15, ends: '2n 5g', revenue: '—' },
                  { name: 'Spring Clear', status: 'Đã kết thúc', products: 8, discount: 30, ends: 'Đã kết thúc', revenue: '₫18.7M' },
                ].map(campaign=>(
                  <div key={campaign.name} className="bg-white border border-black/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div><h3 className="font-['Cormorant_Garamond'] text-xl">{campaign.name}</h3><p className="text-xs text-black/40 mt-1">{campaign.products} sản phẩm · giảm {campaign.discount}%</p></div>
                      <span className={`text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 ${campaign.status==='Hoạt động'?'bg-green-100 text-green-800':campaign.status==='Đã lên lịch'?'bg-yellow-100 text-yellow-800':'bg-gray-100 text-gray-600'}`}>{campaign.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Còn lại</p><p className="text-sm font-medium">{campaign.ends}</p></div>
                      <div><p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Doanh thu</p><p className="text-sm font-['Cormorant_Garamond'] text-base">{campaign.revenue}</p></div>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button className="text-[9px] tracking-wider border border-black/20 px-3 py-1.5 hover:border-black transition-colors">Sửa</button>
                      {campaign.status === 'Hoạt động' && <button className="text-[9px] tracking-wider border border-red-200 text-red-500 px-3 py-1.5 hover:bg-red-50 transition-colors">Kết thúc</button>}
                    </div>
                  </div>
                ))}
              </div>
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
                <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 mb-4">Cách tính: Điểm = (Giá trị đơn hàng ÷ 1.000) × Hệ số điểm theo mốc giá</p>
                <div className="space-y-4">
                  {editingPoints.map((rule, index) => (
                    <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end p-4 border border-black/10 bg-[#F8F8F6]">
                      <div>
                        <label className={labelCls}>Giá tối thiểu (VNĐ)</label>
                        <input type="number" value={rule.minPrice} onChange={e => handlePointsRuleChange(index, 'minPrice', Number(e.target.value))} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Giá tối đa (VNĐ)</label>
                        <input type="number" value={rule.maxPrice} onChange={e => handlePointsRuleChange(index, 'maxPrice', Number(e.target.value))} className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Hệ số điểm (x / 1.000₫)</label>
                        <input type="number" value={rule.pointsPerUnit} onChange={e => handlePointsRuleChange(index, 'pointsPerUnit', Number(e.target.value))} className={inputCls} />
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
                <h3 className="font-['Cormorant_Garamond'] text-xl mb-4">Xem trước</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[100000, 300000, 700000, 1500000].map(sample => {
                    const rule = editingPoints.find(r => sample >= r.minPrice && sample <= r.maxPrice);
                    const pts = Math.floor(sample / 1000) * (rule?.pointsPerUnit || 1);
                    return (
                      <div key={sample} className="border border-black/10 p-4">
                        <p className="text-[9px] tracking-wider text-black/40 uppercase mb-1">Đơn hàng {formatPrice(sample)}</p>
                        <p className="font-['Cormorant_Garamond'] text-2xl">{pts.toLocaleString()}</p>
                        <p className="text-xs text-black/40 mt-1">điểm thưởng</p>
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
        </div>
      </div>
    </div>
  );
}
