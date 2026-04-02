import { useState } from 'react';
import { Award, Star, Gift, ArrowRight, Check, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { useApp }from '../context/AppContext';
import { formatPrice } from '../data/products';

const tiers = [
  { name: 'Bronze', range: '0 – 999', color: '#CD7F32', perks: ['1 điểm mỗi 1.000 VNĐ', 'Quà tặng sinh nhật', 'Truy cập sớm các đợt giảm giá'] },
  { name: 'Silver', range: '1.000 – 4,999', color: '#C0C0C0', perks: ['1.5 điểm mỗi 1.000 VNĐ', 'Miễn phí vận chuyển trọn đời', 'Sản phẩm độc quyền thành viên', 'Quà tặng sinh nhật x2'] },
  { name: 'Gold', range: '5,000 – 9,999', color: '#FFD700', perks: ['2 điểm mỗi 1.000 VNĐ', 'Chăm sóc ưu tiên', 'Lời mời sự kiện riêng tư', 'Quà tặng kèm đơn hàng', 'Quà tặng sinh nhật x3'] },
  { name: 'Platinum', range: '10,000+', color: '#E5E4E2', perks: ['3 điểm mỗi 1.000 VNĐ', 'Tư vấn phong cách riêng', 'Quyền mua sớm bộ sưu tập mới', 'Quà tặng độc quyền hàng tháng', 'Sự kiện VIP'] },
];

const history = [
  { id: 'h1', action: 'Đơn hàng #ORD-2026-0312', points: 478, type: 'earned', date: '2026-03-12' },
  { id: 'h2', action: 'Đơn hàng #ORD-2026-0228', points: 289, type: 'earned', date: '2026-02-28' },
  { id: 'h3', action: 'Đổi mã giảm giá', points: -500, type: 'spent', date: '2026-02-20' },
  { id: 'h4', action: 'Thưởng sinh nhật', points: 200, type: 'earned', date: '2026-02-15' },
  { id: 'h5', action: 'Thưởng giới thiệu bạn bè', points: 100, type: 'earned', date: '2026-01-30' },
];

export default function RewardsPage() {
  const { user, redeemPoints, showNotification, rewardItems, pointsConfig, isLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'exchange' | 'history'>('dashboard');
  const [redeemLoading, setRedeemLoading] = useState<string | null>(null);

  // Use only active rewards from context
  const activeRewards = rewardItems.filter(r => r.active);

  const currentTier = user
    ? user.points >= 10000 ? tiers[3]
    : user.points >= 5000 ? tiers[2]
    : user.points >= 1000 ? tiers[1]
    : tiers[0]
    : tiers[0];

  const nextTier = tiers[tiers.indexOf(currentTier) + 1];
  const pointsToNext = nextTier
    ? parseInt(nextTier.range.split(' – ')[0].replace('.', '').replace(',', '')) - (user?.points || 0)
    : 0;
  const progressPercent = nextTier
    ? Math.min(100, ((user?.points || 0) / parseInt(nextTier.range.split(' – ')[0].replace('.', '').replace(',', ''))) * 100)
    : 100;

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
              <p className="text-white/50 text-sm tracking-wide">Tích điểm, mở khóa đặc quyền, nâng tầm phong cách sống.</p>
            </div>

            {user && isLoggedIn && (
              <div className="bg-white/5 border border-white/10 p-8 min-w-[280px]">
                <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-2">Thành viên {user.tier}</p>
                <p className="font-['Cormorant_Garamond'] text-5xl text-white mb-1">{user.points.toLocaleString()}</p>
                <p className="text-white/40 text-xs tracking-wide">điểm khả dụng</p>
                {nextTier && (
                  <div className="mt-5">
                    <div className="flex justify-between text-[9px] tracking-wider text-white/30 mb-2">
                      <span>{currentTier.name}</span>
                      <span>{pointsToNext.toLocaleString()} điểm nữa để lên {nextTier.name}</span>
                    </div>
                    <div className="h-1 bg-white/10">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                )}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 mb-12">
              {[
                { label: 'Tổng điểm', value: user?.points.toLocaleString() || '0' },
                { label: 'Hạng hiện tại', value: user?.tier || 'Bronze' },
                { label: 'Tổng đơn hàng', value: user?.totalOrders.toString() || '0' },
                { label: 'Thành viên từ', value: user?.joinDate?.split('-')[0] || '2026' },
              ].map(stat => (
                <div key={stat.label} className="bg-white p-8">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 mb-3">{stat.label}</p>
                  <p className="font-['Cormorant_Garamond'] text-4xl">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-10">
              <h2 className="font-['Cormorant_Garamond'] text-3xl mb-8">Các hạng thành viên</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/10">
                {tiers.map(tier => {
                  const isCurrent = currentTier.name === tier.name;
                  return (
                    <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      className={`bg-white p-8 ${isCurrent ? 'ring-2 ring-black' : ''}`}>
                      {isCurrent && <span className="text-[9px] tracking-[0.2em] uppercase bg-black text-white px-2 py-1 mb-4 inline-block">Hạng của bạn</span>}
                      <div className="w-8 h-1 mb-4" style={{ backgroundColor: tier.color }} />
                      <p className="text-[9px] tracking-[0.25em] uppercase text-black/40 mb-1">{tier.range} điểm</p>
                      <h3 className="font-['Cormorant_Garamond'] text-2xl mb-6">{tier.name}</h3>
                      <ul className="space-y-2.5">
                        {tier.perks.map(perk => (
                          <li key={perk} className="flex items-start gap-2 text-xs text-black/60 tracking-wide">
                            <Check size={12} className="shrink-0 mt-0.5 text-black" />{perk}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            {/* How to earn - using dynamic pointsConfig */}
            <div className="bg-[#F8F6F2] p-8 md:p-12">
              <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Cách tích điểm</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: '🛍️', action: 'Mua sắm', pts: `${pointsConfig[0]?.pointsPerUnit || 1} điểm mỗi 1.000 VNĐ trở lên` },
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
