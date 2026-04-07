'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Gem, Palette, Scissors, Users, ShoppingBag, Globe, Award } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useApp } from '../context/AppContext';

// --- Reveal Animation Wrapper ---
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Map icon indices for core values
const valueIcons = [Palette, Gem, Leaf, Scissors];

export default function AboutPage() {
  const { aboutContent: content } = useApp();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Stat icons
  const statIcons = [Users, ShoppingBag, Globe, Award];

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <ImageWithFallback
            src={content.hero.image}
            alt="KUMO About Hero"
            className="w-full h-full object-cover scale-110"
          />
        </motion.div>
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-6"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/50 text-[10px] tracking-[0.5em] uppercase mb-6"
          >
            Câu chuyện của chúng tôi
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="font-['Cormorant_Garamond'] text-white text-5xl md:text-7xl lg:text-8xl leading-none mb-6"
          >
            {content.hero.title.includes('KUMO') ? (
              <>{content.hero.title.split('KUMO')[0]}<em>KUMO</em>{content.hero.title.split('KUMO')[1]}</>
            ) : content.hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/50 text-sm tracking-wider max-w-md mx-auto"
          >
            {content.hero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <Reveal>
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Câu chuyện thương hiệu</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl leading-tight mb-8">
                Sinh ra từ<br />
                <em>sự tĩnh lặng</em>
              </h2>
              <div className="space-y-5 text-black/60 text-sm leading-relaxed tracking-wide">
                {content.brandStory.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="overflow-hidden aspect-[3/4]">
                <ImageWithFallback
                  src={content.brandStory.image}
                  alt="KUMO Brand Story"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-black/10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-black/10" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== GALLERY / LOOKBOOK ===== */}
      {content.gallery.length > 0 && (
        <section className="bg-[#F8F6F2] py-20 md:py-28 overflow-hidden">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <Reveal>
              <div className="text-center mb-16">
                <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Nghệ thuật & Phong cách</p>
                <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Thế giới của KUMO</h2>
              </div>
            </Reveal>

            {/* Masonry-style gallery grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {content.gallery.map((img, i) => {
                // Alternate sizes for visual interest
                const isLarge = i === 0 || i === 3 || i === 5;
                return (
                  <Reveal key={img.id} delay={i * 0.06} className={isLarge ? 'row-span-2' : ''}>
                    <div className={`overflow-hidden group relative ${isLarge ? 'aspect-[3/5]' : 'aspect-square'} h-full`}>
                      <ImageWithFallback
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-end">
                        <p className="text-white text-xs tracking-wider p-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          {img.alt}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== FOUNDER ===== */}
      <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">Người sáng lập</p>
              <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-5xl">Đằng sau KUMO</h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-5 gap-12 md:gap-16 items-center">
            <Reveal className="md:col-span-2">
              <div className="relative mx-auto max-w-sm">
                <div className="overflow-hidden aspect-[3/4]">
                  <ImageWithFallback
                    src={content.founder.image}
                    alt={`${content.founder.name} — ${content.founder.title}`}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="font-['Cormorant_Garamond'] text-white text-2xl">{content.founder.name}</p>
                  <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">{content.founder.title}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2} className="md:col-span-3">
              <div>
                <div className="space-y-5 text-white/50 text-sm leading-relaxed tracking-wide">
                  {content.founder.bio.map((paragraph, i) => (
                    <p key={i}>
                      {i === 0 ? (
                        <>{paragraph.split(content.founder.name)[0]}<span className="text-white/80">{content.founder.name}</span>{paragraph.split(content.founder.name).slice(1).join(content.founder.name)}</>
                      ) : paragraph}
                    </p>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-white/10">
                  <blockquote>
                    <p className="font-['Cormorant_Garamond'] text-white/70 text-xl md:text-2xl italic leading-relaxed mb-4">
                      &ldquo;{content.founder.quote}&rdquo;
                    </p>
                    <footer className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                      — {content.founder.name}
                    </footer>
                  </blockquote>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-10">
                  {content.founder.stats.map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="font-['Cormorant_Garamond'] text-white text-3xl mb-1">{item.value}</p>
                      <p className="text-white/30 text-[9px] tracking-[0.2em] uppercase">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== CORE VALUES ===== */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Giá trị cốt lõi</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Bốn trụ cột của KUMO</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10">
            {content.coreValues.map((value, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <Reveal key={value.id} delay={i * 0.1}>
                  <div className="bg-white p-8 md:p-10 h-full group hover:bg-black transition-all duration-500 cursor-default">
                    <Icon
                      size={28}
                      className="mb-6 text-black/30 group-hover:text-white/60 transition-colors duration-500"
                      strokeWidth={1.2}
                    />
                    <p className="text-[9px] tracking-[0.35em] uppercase text-black/30 group-hover:text-white/30 mb-1 transition-colors duration-500">
                      {value.subtitle}
                    </p>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl mb-4 group-hover:text-white transition-colors duration-500">
                      {value.title}
                    </h3>
                    <p className="text-sm text-black/50 leading-relaxed tracking-wide group-hover:text-white/50 transition-colors duration-500">
                      {value.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE HISTORY ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Hành trình phát triển</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Lịch sử KUMO</h2>
            </div>
          </Reveal>

          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-black/10 md:-translate-x-px" />

            {content.timeline.map((event, i) => (
              <Reveal key={event.id} delay={i * 0.08}>
                <div className={`relative flex items-start gap-8 mb-12 md:mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 mt-2 z-10">
                    <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20" />
                  </div>

                  <div className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <span className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-black/20 block mb-2">
                      {event.year}
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-xl md:text-2xl mb-3">
                      {event.title}
                    </h3>
                    <p className="text-sm text-black/50 tracking-wide leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY / STATS ===== */}
      <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-12">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4">Sự uy tín</p>
              <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-5xl mb-4">
                Con số không nói dối
              </h2>
              <p className="text-white/40 text-sm tracking-wide max-w-lg mx-auto">
                Từ một xưởng nhỏ đến thương hiệu được tin tưởng — hành trình của KUMO được viết bằng sự tin tưởng của khách hàng.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {content.stats.map((stat, i) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <Reveal key={stat.label} delay={i * 0.1}>
                  <div className="bg-black p-8 md:p-12 text-center group hover:bg-white/5 transition-colors duration-500">
                    <Icon size={24} className="mx-auto mb-4 text-white/20 group-hover:text-white/40 transition-colors" strokeWidth={1.2} />
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-white mb-2"
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-[10px] tracking-[0.25em] uppercase text-white/40">
                      {stat.label}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 mt-12 md:mt-16">
              {['Chất lượng ISO 9001', 'Sản xuất bền vững', 'Nguyên liệu hữu cơ', 'Đóng gói thân thiện'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-white/20 text-[10px] tracking-[0.2em] uppercase">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                  {badge}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== TRENDS & VISION ===== */}
      <section className="py-20 md:py-28">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <Reveal>
              <div className="relative overflow-hidden aspect-[4/5]">
                <ImageWithFallback
                  src={content.vision.image}
                  alt="KUMO Trends"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div>
                <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Xu hướng & Tầm nhìn</p>
                <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl leading-tight mb-8">
                  Tương lai của<br />
                  <em>sự tối giản</em>
                </h2>

                <div className="space-y-6">
                  {content.trends.map((trend, i) => (
                    <div key={trend.id} className="group">
                      <div className="flex items-start gap-4">
                        <span className="font-['Cormorant_Garamond'] text-2xl text-black/15 mt-[-2px]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-['Cormorant_Garamond'] text-lg mb-1.5">{trend.title}</h3>
                          <p className="text-sm text-black/50 leading-relaxed tracking-wide">{trend.desc}</p>
                        </div>
                      </div>
                      {i < content.trends.length - 1 && <div className="border-b border-black/5 mt-6" />}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== BRAND QUOTE ===== */}
      <section className="bg-[#F8F6F2] py-20 md:py-28">
        <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <Reveal>
            <blockquote>
              <p className="font-['Cormorant_Garamond'] text-3xl md:text-4xl lg:text-5xl leading-snug italic text-black/80 mb-8">
                &ldquo;{content.brandQuote.text}&rdquo;
              </p>
              <footer className="text-[10px] tracking-[0.35em] uppercase text-black/40">
                — {content.brandQuote.author}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src={content.cta.image}
          alt="KUMO CTA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase mb-4">Bắt đầu hành trình của bạn</p>
            <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-6xl mb-8">
              {content.cta.title}
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/shop"
                className="inline-flex items-center gap-3 bg-white text-black text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-white/90 transition-all duration-300 group"
              >
                Mua ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/blog"
                className="inline-flex items-center gap-3 border border-white/40 text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Đọc Tạp chí
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
