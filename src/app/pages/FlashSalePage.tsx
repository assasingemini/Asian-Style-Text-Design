import { useState, useEffect, useMemo } from 'react';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { products, formatPrice } from '../data/products';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });
  
  // Convert targetDate to timestamp to avoid Date object comparison issues
  const targetTime = targetDate.getTime();
  
  useEffect(() => {
    const tick = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) { 
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); 
        return; 
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  
  return timeLeft;
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <div className="bg-black text-white w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2">
        <span className="font-['Cormorant_Garamond'] text-3xl md:text-4xl">{String(value).padStart(2, '0')}</span>
      </div>
      <p className="text-[9px] tracking-[0.25em] uppercase text-black/40">{label}</p>
    </div>
  );
}

export default function FlashSalePage() {
  // Memoize flash sales to prevent re-creation of Date objects
  const flashSales = useMemo(() => [
    {
      id: 'fs1',
      name: 'Ưu đãi Nửa đêm',
      endDate: new Date(Date.now() + 7 * 3600000 + 23 * 60000),
      badge: 'Sắp kết thúc',
      products: products.filter(p => p.isFlashSale),
    },
    {
      id: 'fs2',
      name: 'Đặc biệt Cuối tuần',
      endDate: new Date(Date.now() + 2 * 86400000 + 5 * 3600000),
      badge: 'Đang diễn ra',
      products: products.filter((_, i) => i % 3 === 0),
    },
  ], []);

  const [activeSale, setActiveSale] = useState(flashSales[0]);
  const countdown = useCountdown(activeSale.endDate);
  const { addToCart } = useApp();

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Zap size={16} className="fill-red-500 stroke-red-500" />
              <p className="text-red-500 text-xs tracking-[0.4em] uppercase">Flash Sale</p>
            </div>
            <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl mb-10">
              Ưu đãi có hạn
            </h1>

            {/* Countdown */}
            <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
              <TimeBlock value={countdown.d} label="Ngày" />
              <span className="font-['Cormorant_Garamond'] text-white/30 text-4xl -mt-6">:</span>
              <TimeBlock value={countdown.h} label="Giờ" />
              <span className="font-['Cormorant_Garamond'] text-white/30 text-4xl -mt-6">:</span>
              <TimeBlock value={countdown.m} label="Phút" />
              <span className="font-['Cormorant_Garamond'] text-white/30 text-4xl -mt-6">:</span>
              <TimeBlock value={countdown.s} label="Giây" />
            </div>

            <p className="text-white/40 text-sm tracking-wider">
              <Clock size={12} className="inline mr-2" />
              Nhanh tay! Ưu đãi sẽ kết thúc sớm
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sale Tabs */}
      <div className="border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex gap-0 overflow-x-auto">
          {flashSales.map(sale => (
            <button
              key={sale.id}
              onClick={() => setActiveSale(sale)}
              className={`flex items-center gap-3 px-8 py-5 text-xs tracking-[0.2em] uppercase border-b-2 whitespace-nowrap transition-all ${
                activeSale.id === sale.id ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'
              }`}
            >
              <Zap size={10} className={activeSale.id === sale.id ? 'fill-black stroke-black' : 'fill-black/30 stroke-black/30'} />
              {sale.name}
              <span className={`text-[9px] px-2 py-0.5 ${
                sale.badge === 'Sắp kết thúc' ? 'bg-red-600 text-white' : 'bg-black text-white'
              }`}>
                {sale.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {activeSale.products.map((product, i) => {
            const salePrice = product.flashSalePrice || Math.round(product.price * 0.8);
            const discount = Math.round((1 - salePrice / product.price) * 100);
            const stockLeft = Math.floor(Math.random() * 8) + 1;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="group border border-black/10 hover:border-black/20 transition-all"
              >
                <Link to={`/shop/${product.id}`} className="block relative overflow-hidden aspect-[4/3]">
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-[10px] tracking-[0.2em] px-3 py-1.5 uppercase flex items-center gap-1">
                      <Zap size={9} className="fill-white" /> -{discount}%
                    </span>
                  </div>
                </Link>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[9px] tracking-[0.2em] uppercase text-black/40 mb-1">{product.category}</p>
                      <Link to={`/shop/${product.id}`}>
                        <h3 className="font-['Cormorant_Garamond'] text-xl hover:opacity-60 transition-opacity">{product.name}</h3>
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 text-sm tracking-wide">{formatPrice(salePrice)}</p>
                      <p className="text-black/30 text-xs line-through">{formatPrice(product.price)}</p>
                    </div>
                  </div>

                  {/* Stock urgency */}
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <p className="text-[9px] tracking-wider text-black/40">Số lượng còn lại</p>
                      <p className="text-[9px] tracking-wider text-red-500">còn {stockLeft}</p>
                    </div>
                    <div className="h-1 bg-black/10">
                      <div
                        className="h-full bg-red-500 transition-all"
                        style={{ width: `${(stockLeft / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product, product.sizes[2] || product.sizes[0], product.colors[0])}
                    className="w-full bg-black text-white text-xs tracking-[0.2em] uppercase py-3 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <Zap size={12} className="fill-white" /> Thêm vào giỏ hàng
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-[#F8F6F2] py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: '⚡', title: 'Ưu đãi chớp nhoáng', desc: 'Ưu đãi mới cập nhật mỗi vài giờ. Hãy kiểm tra thường xuyên.' },
            { icon: '📦', title: 'Giao hàng nhanh', desc: 'Đơn hàng trong đợt giảm giá sẽ được giao trong vòng 24 giờ.' },
            { icon: '✓', title: 'Cam kết chính hãng', desc: 'Tất cả sản phẩm giảm giá đều là hàng KUMO chính hãng.' },
          ].map(item => (
            <div key={item.title}>
              <p className="text-3xl mb-3">{item.icon}</p>
              <h3 className="font-['Cormorant_Garamond'] text-xl mb-2">{item.title}</h3>
              <p className="text-black/50 text-sm tracking-wide">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
