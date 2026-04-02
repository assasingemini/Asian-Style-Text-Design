import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { User, Package, Heart, Award, Settings, LogOut, ArrowRight, Star, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { products, formatPrice } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type Tab = 'profile' | 'orders' | 'wishlist' | 'rewards' | 'settings';

const tabs: { key: Tab; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Hồ sơ', icon: User },
  { key: 'orders', label: 'Đơn hàng', icon: Package },
  { key: 'wishlist', label: 'Yêu thích', icon: Heart },
  { key: 'rewards', label: 'Ưu đãi', icon: Award },
  { key: 'settings', label: 'Cài đặt', icon: Settings },
];

const statusStyles: Record<string, string> = {
  'Đang xử lý': 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  'Đang giao': 'bg-blue-50 text-blue-800 border border-blue-200',
  'Đã giao': 'bg-green-50 text-green-800 border border-green-200',
  'Đã hủy': 'bg-red-50 text-red-800 border border-red-200',
};

export default function AccountPage() {
  const { user, orders, wishlist, toggleWishlist, logout, isLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const navigate = useNavigate();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white px-6">
        <div className="max-w-sm w-full text-center">
          <User size={48} className="mx-auto mb-6 text-black/20" strokeWidth={1} />
          <h1 className="font-['Cormorant_Garamond'] text-4xl mb-4">Đăng nhập</h1>
          <p className="text-black/50 text-sm tracking-wide mb-10">Đăng nhập để xem đơn hàng, danh sách yêu thích và điểm thưởng.</p>

          <Link
            to="/login"
            className="w-full inline-block bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all mb-4"
          >
            Đăng nhập
          </Link>
          <p className="text-xs text-black/40 tracking-wide">
            Chưa có tài khoản? <Link to="/register" className="text-black underline underline-offset-4">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-black text-white py-12 md:py-16">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
            <ImageWithFallback src={user?.avatar || ''} alt={user?.name || ''} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-1">Thành viên {user?.tier}</p>
            <h1 className="font-['Cormorant_Garamond'] text-3xl text-white">{user?.name}</h1>
            <p className="text-white/50 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-white">{user?.points.toLocaleString()}</p>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">Điểm</p>
            </div>
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-white">{user?.totalOrders}</p>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">Đơn hàng</p>
            </div>
            <div className="text-center">
              <p className="font-['Cormorant_Garamond'] text-3xl text-white">{wishlist.length}</p>
              <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase">Đã lưu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Tab Navigation */}
        <div className="border-b border-black/10 flex overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-5 text-[10px] tracking-[0.25em] uppercase border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
          <button
            onClick={logout}
            className="ml-auto flex items-center gap-2 px-6 py-5 text-[10px] tracking-[0.25em] uppercase text-black/30 hover:text-red-500 transition-colors whitespace-nowrap"
          >
            <LogOut size={14} /> Đăng xuất
          </button>
        </div>

        <div className="py-10">
          <AnimatePresence mode="wait">
            {/* PROFILE */}
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Hồ sơ của tôi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                  {[
                    { label: 'Họ và tên', value: user?.name || '' },
                    { label: 'Email', value: user?.email || '' },
                    { label: 'Số điện thoại', value: '+84 901 234 567' },
                    { label: 'Thành viên từ', value: user?.joinDate || '' },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-['Cormorant_Garamond'] text-xl mb-5">Địa chỉ đã lưu</h3>
                  <div className="border border-black/15 p-6 max-w-md">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-black/40" />
                        <span className="text-xs tracking-[0.2em] uppercase text-black/40">Nhà riêng</span>
                      </div>
                      <span className="bg-black text-white text-[9px] px-2 py-0.5 tracking-wider">Mặc định</span>
                    </div>
                    <p className="text-sm tracking-wide">123 Lê Lợi, Quận 1</p>
                    <p className="text-sm text-black/50 tracking-wide">TP. Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>

                <button className="mt-8 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all">
                  Lưu thay đổi
                </button>
              </motion.div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Lịch sử đơn hàng</h2>
                <div className="space-y-4">
                  {orders.map((order, i) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="border border-black/10 p-6 hover:border-black/20 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-['Cormorant_Garamond'] text-xl">{order.id}</p>
                          <p className="text-xs text-black/40 tracking-wide mt-1">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 ${statusStyles[order.status] || statusStyles['Đang xử lý']}`}>
                            {order.status}
                          </span>
                          <span className="font-['Cormorant_Garamond'] text-xl">{formatPrice(order.total)}</span>
                        </div>
                      </div>
                      {order.tracking && (
                        <div className="mt-4 pt-4 border-t border-black/10 flex items-center justify-between">
                          <p className="text-xs text-black/40 tracking-wide">Mã vận đơn: <span className="text-black">{order.tracking}</span></p>
                          <button className="flex items-center gap-1 text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity">
                            Theo dõi <ArrowRight size={12} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* WISHLIST */}
            {activeTab === 'wishlist' && (
              <motion.div key="wishlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Sản phẩm đã lưu ({wishlist.length})</h2>
                {wishlistProducts.length === 0 ? (
                  <div className="py-20 text-center">
                    <Heart size={48} strokeWidth={1} className="mx-auto mb-5 text-black/20" />
                    <p className="font-['Cormorant_Garamond'] text-2xl text-black/40 mb-6">Chưa có sản phẩm nào được lưu</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all">
                      Khám phá bộ sưu tập <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {wishlistProducts.map(product => (
                      <div key={product.id} className="group">
                        <Link to={`/shop/${product.id}`} className="block">
                          <div className="relative overflow-hidden aspect-[3/4] bg-[#F5F5F3] mb-3">
                            <ImageWithFallback
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <button
                              onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                              className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center"
                            >
                              <Heart size={14} className="fill-black stroke-black" />
                            </button>
                          </div>
                          <h3 className="font-['Cormorant_Garamond'] text-lg">{product.name}</h3>
                          <p className="text-sm mt-1 tracking-wide">{formatPrice(product.price)}</p>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* REWARDS */}
            {activeTab === 'rewards' && (
              <motion.div key="rewards" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Điểm thưởng</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 mb-10">
                  {[
                    { label: 'Điểm hiện có', value: user?.points.toLocaleString() || '0', sub: 'Có thể đổi ngay' },
                    { label: 'Hạng hiện tại', value: user?.tier || 'Bronze', sub: 'Cấp độ thành viên' },
                    { label: 'Tổng điểm đã tích lũy', value: '3,239', sub: 'Tổng cộng từ trước đến nay' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-white p-8">
                      <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 mb-3">{stat.label}</p>
                      <p className="font-['Cormorant_Garamond'] text-5xl mb-2">{stat.value}</p>
                      <p className="text-xs text-black/30 tracking-wide">{stat.sub}</p>
                    </div>
                  ))}
                </div>
                <Link to="/rewards" className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all group">
                  Xem toàn bộ trang ưu đãi <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Cài đặt tài khoản</h2>
                <div className="max-w-lg space-y-6">
                  {[
                    { label: 'Thông báo qua Email', desc: 'Nhận cập nhật đơn hàng và khuyến mãi', checked: true },
                    { label: 'Thông báo qua SMS', desc: 'Cập nhật giao hàng qua SMS', checked: false },
                    { label: 'Thông báo Giảm giá Sốc', desc: 'Nhận thông báo trước khi bắt đầu giảm giá', checked: true },
                    { label: 'Bản tin tạp chí', desc: 'Nội dung tạp chí được tuyển chọn hàng tháng', checked: true },
                  ].map(setting => (
                    <div key={setting.label} className="flex items-center justify-between py-4 border-b border-black/10">
                      <div>
                        <p className="text-sm tracking-wide">{setting.label}</p>
                        <p className="text-xs text-black/40 tracking-wide mt-0.5">{setting.desc}</p>
                      </div>
                      <button className={`w-12 h-6 rounded-full transition-all duration-300 relative ${setting.checked ? 'bg-black' : 'bg-black/20'}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${setting.checked ? 'right-1' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-black/10">
                  <h3 className="font-['Cormorant_Garamond'] text-xl mb-4 text-red-600">Vùng nguy hiểm</h3>
                  <button className="text-xs tracking-[0.2em] uppercase text-red-500 border border-red-200 px-6 py-3 hover:bg-red-50 transition-colors">
                    Xóa tài khoản
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
