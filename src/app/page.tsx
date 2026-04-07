'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Zap, Star, Award } from 'lucide-react';
import { motion, useInView } from 'motion/react';
import { formatPrice } from './data/products';
import { useApp } from './context/AppContext';
import { ProductCard } from './components/product/ProductCard';
import { ImageWithFallback } from './components/figma/ImageWithFallback';

// --- Countdown Timer ---
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
  
  // Convert targetDate to timestamp to avoid Date object comparison issues
  const targetTime = targetDate.getTime();
  
  useEffect(() => {
    const tick = () => {
      const diff = targetTime - Date.now();
      if (diff <= 0) { 
        setTimeLeft({ h: 0, m: 0, s: 0 }); 
        return; 
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  
  return timeLeft;
}

function CountBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-white leading-none w-20 text-center">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white/40 text-[9px] tracking-[0.25em] uppercase mt-1">{label}</span>
    </div>
  );
}

// --- Section Reveal ---
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  const { products, blogPosts, initialized, flashSaleCampaigns } = useApp();
  const featuredProducts = products.slice(0, 4);
  const recentPosts = blogPosts.slice(0, 3);

  const activeCampaign = useMemo(() => {
    if (!flashSaleCampaigns) return null;
    const now = new Date();
    return flashSaleCampaigns.find(c => c.isActive && new Date(c.endDate) > now);
  }, [flashSaleCampaigns]);

  const saleEnd = useMemo(() => activeCampaign ? new Date(activeCampaign.endDate) : new Date(), [activeCampaign]);
  const countdown = useCountdown(saleEnd);
  
  const flashSaleProducts = useMemo(() => {
    if (!activeCampaign) return [];
    return activeCampaign.products.map(fp => products.find(p => p.id === fp.productId)).filter(Boolean).slice(0, 2);
  }, [activeCampaign, products]);

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1770363759574-3aa49179bc67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhc2hpb24lMjBlZGl0b3JpYWwlMjBibGFjayUyMHdoaXRlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzQyODI3MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="KUMO Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-6 md:px-12 pb-20 md:pb-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
          >
            <p className="text-white/60 text-xs tracking-[0.4em] uppercase mb-5">Bộ sưu tập Xuân Hè 2026</p>
            <h1 className="font-['Cormorant_Garamond'] text-white text-6xl md:text-8xl lg:text-[120px] leading-none mb-8 max-w-4xl">
              Khoảng không<br />
              <em>ở giữa</em>
            </h1>
            <p className="text-white/60 text-sm tracking-wider max-w-sm mb-10">
              Tĩnh lặng là ngôn ngữ thiết kế. Khám phá khoảng trống giữa hình thể và sự tự do.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop"
                className="inline-flex items-center gap-3 bg-white text-black text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-white/90 transition-all duration-300 group"
              >
                Khám phá Bộ sưu tập
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/flash-sale"
                className="inline-flex items-center gap-3 border border-white/40 text-white text-xs tracking-[0.25em] uppercase px-8 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                <Zap size={12} className="fill-white" /> Giảm giá Sốc
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40"
        >
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-black text-white py-4 overflow-hidden">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="text-[10px] tracking-[0.4em] uppercase mx-8 text-white/50">
              Hàng mới về &nbsp;&bull;&nbsp; Miễn phí vận chuyển từ 500k &nbsp;&bull;&nbsp; Giảm giá Sốc đang diễn ra &nbsp;&bull;&nbsp; Thủ công tại Việt Nam
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <RevealSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">Tuyển chọn đặc biệt</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Sản phẩm Nổi bật</h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:gap-4 transition-all duration-300">
              Xem tất cả <ArrowRight size={14} />
            </Link>
          </div>
        </RevealSection>

        {!initialized ? (
          <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="text-center mt-12 md:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300">
            Xem tất cả <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="grid md:grid-cols-2 min-h-[600px]">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1683642765591-2370edc15193?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwZmFzaGlvbiUyMGNsb3RoaW5nJTIwc3RvcmUlMjBkYXJrfGVufDF8fHx8MTc3NDI4MjcwNHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Editorial"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
        <div className="bg-black flex items-center justify-center p-12 md:p-20">
          <RevealSection>
            <div>
              <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-6">Triết lý của chúng tôi</p>
              <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-5xl leading-tight mb-8">
                Thiết kế cất lời<br />
                <em>từ sự tĩnh lặng</em>
              </h2>
              <p className="text-white/50 text-sm leading-relaxed tracking-wide max-w-xs mb-10">
                Chúng tôi tin rằng những thiết kế mạnh mẽ nhất luôn để lại không gian cho người mặc. Ít trang trí hơn, nhiều ý niệm hơn. Mỗi đường may, mỗi phom dáng đều có lý do của nó.
              </p>
              <Link href="/shop"
                className="inline-flex items-center gap-3 border border-white/30 text-white text-xs tracking-[0.25em] uppercase px-8 py-4 hover:border-white hover:bg-white hover:text-black transition-all duration-300 group"
              >
                Khám phá thương hiệu <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* FLASH SALE */}
      {activeCampaign && flashSaleProducts.length > 0 && (
        <section className="bg-black py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative max-w-[1440px] mx-auto px-6 md:px-12">
            <RevealSection>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="fill-red-500 stroke-red-500" />
                    <p className="text-red-500 text-[10px] tracking-[0.35em] uppercase">Giảm giá Sốc</p>
                  </div>
                  <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-5xl">{activeCampaign.name}</h2>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <CountBox value={countdown.h} label="Giờ" />
                  <span className="font-['Cormorant_Garamond'] text-white/30 text-5xl -mt-4">:</span>
                  <CountBox value={countdown.m} label="Phút" />
                  <span className="font-['Cormorant_Garamond'] text-white/30 text-5xl -mt-4">:</span>
                  <CountBox value={countdown.s} label="Giây" />
                </div>
              </div>
            </RevealSection>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              {flashSaleProducts.map((product: any, i: number) => {
                const campaignProduct = activeCampaign.products.find(cp => cp.productId === product.id);
                const salePrice = campaignProduct?.salePrice || product.price;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                  >
                    <Link href={`/shop/${product.id}`} className="group block">
                      <div className="relative overflow-hidden aspect-[3/4] bg-zinc-900">
                        <ImageWithFallback
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5">
                          <p className="text-white/60 text-[9px] tracking-[0.2em] uppercase mb-1">{product.category}</p>
                          <h3 className="font-['Cormorant_Garamond'] text-white text-xl mb-2">{product.name}</h3>
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 text-sm">{formatPrice(salePrice)}</span>
                            <span className="text-white/30 text-xs line-through">{formatPrice(product.price)}</span>
                            <span className="bg-red-600 text-white text-[9px] tracking-wider px-2 py-0.5">
                              -{Math.round((1 - salePrice / product.price) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/flash-sale"
                className="inline-flex items-center gap-3 border border-white/30 text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:border-white transition-all duration-300"
              >
                Xem tất cả sản phẩm khuyến mãi <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* REWARDS */}
      <section className="py-20 md:py-28 bg-[#F8F6F2]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <RevealSection>
            <div className="text-center mb-16">
              <Award size={24} className="mx-auto mb-4 text-black/40" />
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mb-4">Ưu đãi KUMO</h2>
              <p className="text-black/50 text-sm tracking-wide max-w-lg mx-auto">
                Tích điểm với mỗi đơn hàng. Đổi điểm lấy mã giảm giá độc quyền, quyền truy cập sớm và những món quà được tuyển chọn.
              </p>
            </div>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10">
            {[
              { title: 'Tích điểm', subtitle: 'Mua sắm', perks: ['Mua sản phẩm, tự động nhận điểm', 'Điểm tính theo giá sản phẩm', 'Mua càng nhiều, tích càng nhanh'] },
              { title: 'Đổi ưu đãi', subtitle: 'Đặc quyền', perks: ['Mã giảm giá độc quyền', 'Miễn phí vận chuyển', 'Quà tặng đặc biệt'] },
              { title: 'Thêm điểm', subtitle: 'Thưởng', perks: ['200 điểm thưởng sinh nhật', '100 điểm giới thiệu bạn bè', 'Ưu đãi theo mùa'] },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 md:p-12"
              >
                <p className="text-[10px] tracking-[0.35em] uppercase text-black/40 mb-2">{item.subtitle}</p>
                <h3 className="font-['Cormorant_Garamond'] text-3xl mb-6">{item.title}</h3>
                <ul className="space-y-3">
                  {item.perks.map(perk => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-black/60 tracking-wide">
                      <div className="w-1 h-1 bg-black rounded-full" />
                      {perk}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/rewards"
              className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all duration-300 group"
            >
              Tham gia ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <RevealSection>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-3">Tạp chí</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Từ Nhật ký Thời trang</h2>
            </div>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:gap-4 transition-all duration-300">
              Tất cả bài viết <ArrowRight size={14} />
            </Link>
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={`/blog/${post.id}`} className="group block">
                <div className="overflow-hidden aspect-[4/3] mb-5">
                  <ImageWithFallback
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">{post.category} · {post.readTime} phút đọc</p>
                <h3 className="font-['Cormorant_Garamond'] text-xl md:text-2xl mb-3 group-hover:opacity-60 transition-opacity leading-snug">
                  {post.title}
                </h3>
                <p className="text-black/50 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1562693538-b13cc8095b97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNsb3RoaW5nJTIwc3RvcmUlMjBkYXJrfGVufDF8fHx8MTc3NDI4MjcxN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="CTA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="text-white/60 text-[10px] tracking-[0.4em] uppercase mb-4">Đã có Bộ sưu tập mới</p>
          <h2 className="font-['Cormorant_Garamond'] text-white text-5xl md:text-6xl mb-8">
            Tạo nên câu chuyện của bạn
          </h2>
          <Link href="/shop"
            className="inline-flex items-center gap-3 bg-white text-black text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-white/90 transition-all duration-300 group"
          >
            Mua ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
