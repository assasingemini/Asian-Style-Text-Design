import { useState } from 'react';
import { Award, Star, Gift, ArrowRight, Check, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useApp }from '../context/AppContext';
import { formatPrice } from '../data/products';

const history = [
  { id: 'h1', action: 'Đơn hàng #ORD-2026-0312', points: 45, type: 'earned', date: '2026-03-12' },
  { id: 'h2', action: 'Đơn hàng #ORD-2026-0228', points: 30, type: 'earned', date: '2026-02-28' },
  { id: 'h3', action: 'Đổi mã giảm giá 50k', points: -500, type: 'spent', date: '2026-02-20' },
  { id: 'h4', action: 'Thưởng sinh nhật', points: 200, type: 'earned', date: '2026-02-15' },
  { id: 'h5', action: 'Đơn hàng #ORD-2026-0130', points: 60, type: 'earned', date: '2026-01-30' },
];

export default function RewardsPage() {
  const { user, redeemPoints, showNotification, rewardItems, pointsConfig, isLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exchange' | 'history'>('dashboard');
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null);

  const activeRewards = rewardItems.filter(r => r.active);

  const handleRedeem = async (reward: typeof activeRewards[0]) => {
    if (!user || user.points < reward.points) {
      showNotification('Không đủ điểm', 'error');
      return;
    }
    setRedeemLoading(reward.id);
    await new Promise(r => setTimeout(r, 800));
    redeemPoints(reward.points);
    setRedeemLoading(null);
  };

  // Sort points config for display
  const sortedConfig = [...pointsConfig].sort((a, b) => a.minPrice - b.minPrice);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Award size={16} className="text-white/40" />
                <p className="text-white/40 text-xs tracking-[0.35em] uppercase">Chương trình Khách hàng Thân thiết</p>
              </div>
              <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-7xl mb-4">Ưu đãi KUMO</h1>
              <p className="text-white/50 text-sm tracking-wide">Tích điểm khi mua sắm, đổi điểm lấy ưu đãi hấp dẫn.</p>
            </div>

            {user && isLoggedIn && (
              <div className="bg-white/5 border border-white/10 p-8 min-w-[280px]">
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-2">Điểm của bạn</p>
                <p className="font-['Cormorant_Garamond'] text-5xl text-white mb-1">{user.points.toLocaleString()}</p>
                <p className="text-white/40 text-xs tracking-wide">điểm khả dụng</p>
              </div>
            )}

            {!isLoggedIn && (
              <div className="bg-white/5 border border-white/10 p-8 min-w-[280px] text-center">
                <p className="text-white/50 text-sm tracking-wide mb-4">Đăng nhập để xem điểm và đổi ưu đãi</p>
                <Link to="/login" className="inline-block bg-white text-black text-xs tracking-[0.2em] uppercase px-8 py-3 hover:bg-white/90 transition-colors">Đăng nhập</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex">
          {([
            { key: 'dashboard', label: 'Tổng quan' },
            { key: 'exchange', label: 'Đổi điểm' },
            { key: 'history', label: 'Lịch sử' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-8 py-5 text-xs tracking-[0.25em] uppercase border-b-2 transition-all ${activeTab === tab.key ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-black/10 mb-12">
              {[
                { label: 'Tổng điểm', value: user?.points.toLocaleString() || '0' },
                { label: 'Tổng đơn hàng', value: user?.totalOrders.toString() || '0' },
                { label: 'Thành viên từ', value: user?.joinDate?.split('-')[0] || '2026' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-8">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 mb-3">{stat.label}</p>
                  <p className="font-['Cormorant_Garamond'] text-4xl">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* How to earn points */}
            <div className="mb-10">
              <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Cách tích điểm</h2>
              <p className="text-sm text-black/50 tracking-wide mb-6">
                Mỗi sản phẩm bạn mua sẽ được tính điểm dựa trên giá sản phẩm. Mốc giá cao nhất phù hợp sẽ được áp dụng.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
                {sortedConfig.map((rule, i) => (
                  <motion.div key={rule.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white p-8">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-black/30 mb-2">Mốc {i + 1}</p>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl mb-2">
                      {rule.points} điểm
                    </h3>
                    <p className="text-sm text-black/50 tracking-wide">
                      Sản phẩm từ {formatPrice(rule.minPrice)} trở lên
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Additional ways to earn */}
            <div className="bg-[#F8F6F2] p-8 md:p-12">
              <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Cách khác để tích điểm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🛍️', action: 'Mua sắm', pts: 'Điểm theo giá sản phẩm' },
                  { icon: '🎂', action: 'Thưởng sinh nhật', pts: '200 điểm thưởng' },
                  { icon: '👥', action: 'Giới thiệu bạn bè', pts: '100 điểm mỗi lượt' },
                ].map(item => (
                  <div key={item.action} className="flex items-center gap-5">
                    <div className="text-3xl">{item.icon}</div>
                    <div><p className="text-sm tracking-wide mb-1">{item.action}</p><p className="text-xs text-black/40 tracking-wide">{item.pts}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXCHANGE */}
        {activeTab === 'exchange' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl">Đổi điểm của bạn</h2>
                {user && isLoggedIn && <p className="text-black/40 text-sm mt-1">Bạn đang có <span className="text-black">{user.points.toLocaleString()}</span> điểm</p>}
                {!isLoggedIn && <p className="text-black/40 text-sm mt-1"><Link to="/login" className="text-black underline">Đăng nhập</Link> để đổi điểm</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeRewards.map((reward, i) => {
                const canRedeem = user && isLoggedIn && user.points >= reward.points;
                const isLoading = redeemLoading === reward.id;
                return (
                  <motion.div key={reward.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                    className={`border p-6 transition-all ${canRedeem ? 'border-black/20 hover:border-black' : 'border-black/10 opacity-60'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-black/5 flex items-center justify-center">
                        {reward.type === 'voucher' ? <Gift size={18} className="text-black/40" /> :
                         reward.type === 'shipping' ? <ArrowRight size={18} className="text-black/40" /> :
                         reward.type === 'gift' ? <Star size={18} className="text-black/40" /> :
                         <Zap size={18} className="text-black/40" />}
                      </div>
                      <span className="text-[10px] tracking-[0.25em] uppercase border border-black/20 px-2 py-1">{reward.points.toLocaleString()} điểm</span>
                    </div>
                    <h3 className="font-['Cormorant_Garamond'] text-xl mb-1">{reward.name}</h3>
                    {reward.value > 0 && <p className="text-black/40 text-xs tracking-wide mb-5">Trị giá {formatPrice(reward.value)}</p>}
                    {!reward.value && <p className="text-black/40 text-xs tracking-wide mb-5">{reward.description}</p>}
                    <button onClick={() => handleRedeem(reward)} disabled={!canRedeem || !!isLoading}
                      className={`w-full text-xs tracking-[0.2em] uppercase py-3 transition-all flex items-center justify-center gap-2 ${canRedeem ? 'bg-black text-white hover:bg-black/90' : 'bg-black/10 text-black/30 cursor-not-allowed'}`}>
                      {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : canRedeem ? 'Đổi ngay' : !isLoggedIn ? 'Cần đăng nhập' : 'Cần thêm điểm'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Lịch sử điểm</h2>
            {!isLoggedIn ? (
              <div className="py-20 text-center">
                <p className="text-black/40 text-sm mb-4">Đăng nhập để xem lịch sử điểm</p>
                <Link to="/login" className="inline-block bg-black text-white text-xs tracking-[0.2em] uppercase px-8 py-3">Đăng nhập</Link>
              </div>
            ) : (
              <>
                <div className="space-y-0">
                  {history.map((item, i) => (
                    <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex items-center justify-between py-5 border-b border-black/10">
                      <div className="flex items-center gap-5">
                        <div className={`w-8 h-8 flex items-center justify-center rounded-full ${item.type === 'earned' ? 'bg-black/5' : 'bg-red-50'}`}>
                          {item.type === 'earned' ? <Star size={14} className="text-black/40" /> : <Gift size={14} className="text-red-400" />}
                        </div>
                        <div><p className="text-sm tracking-wide">{item.action}</p><p className="text-xs text-black/40 tracking-wide mt-0.5">{item.date}</p></div>
                      </div>
                      <span className={`font-['Cormorant_Garamond'] text-xl ${item.type === 'earned' ? 'text-black' : 'text-red-500'}`}>
                        {item.type === 'earned' ? '+' : ''}{item.points} điểm
                      </span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <Link to="/shop" className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all group">
                    Mua sắm để tích thêm điểm <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
