import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Leaf, Gem, Palette, Scissors, Users, ShoppingBag, Globe, Award } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

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

// --- Core Values Data ---
const coreValues = [
  {
    icon: Palette,
    title: 'Tối giản',
    subtitle: 'MINIMALISM',
    description: 'Chúng tôi tin rằng vẻ đẹp nằm ở sự tinh gọn. Mỗi thiết kế loại bỏ những gì thừa thãi, giữ lại tinh hoa, tạo nên phong cách vượt thời gian.',
  },
  {
    icon: Gem,
    title: 'Chất lượng',
    subtitle: 'QUALITY',
    description: 'Từ chất liệu cao cấp đến đường may tỉ mỉ, mỗi sản phẩm KUMO đều trải qua quy trình kiểm soát chất lượng nghiêm ngặt trước khi đến tay bạn.',
  },
  {
    icon: Leaf,
    title: 'Bền vững',
    subtitle: 'SUSTAINABILITY',
    description: 'Cam kết sử dụng nguyên liệu thân thiện với môi trường và quy trình sản xuất có trách nhiệm. Thời trang đẹp không nên đánh đổi bằng tương lai.',
  },
  {
    icon: Scissors,
    title: 'Thủ công',
    subtitle: 'CRAFTSMANSHIP',
    description: 'Mỗi sản phẩm mang dấu ấn của những nghệ nhân lành nghề Việt Nam, kết hợp kỹ thuật thủ công truyền thống với thiết kế hiện đại.',
  },
];

// --- Timeline Data ---
const timelineEvents = [
  {
    year: '2020',
    title: 'Khởi nguồn',
    description: 'KUMO ra đời tại một xưởng nhỏ ở TP. Hồ Chí Minh với tầm nhìn mang triết lý tối giản Á Đông vào thời trang đường phố Việt Nam.',
  },
  {
    year: '2021',
    title: 'Bộ sưu tập đầu tiên',
    description: 'Ra mắt BST "Khoảng Không" — bộ sưu tập đầu tay lấy cảm hứng từ thiền định và kiến trúc Nhật Bản, nhận được nhiều đánh giá tích cực.',
  },
  {
    year: '2022',
    title: 'Mở rộng quy mô',
    description: 'Mở studio thiết kế chính thức tại Quận 1. Hợp tác với các nghệ nhân dệt truyền thống tại Hội An và Đà Lạt.',
  },
  {
    year: '2023',
    title: 'Vươn tầm quốc tế',
    description: 'Sản phẩm KUMO có mặt tại 5 quốc gia Đông Nam Á. Ra mắt BST "Tĩnh Lặng" gây tiếng vang lớn trong cộng đồng thời trang.',
  },
  {
    year: '2024',
    title: 'Bền vững & Đổi mới',
    description: 'Chuyển đổi 80% nguyên liệu sang nguồn bền vững. Ra mắt chương trình tái chế vải và đóng gói thân thiện với môi trường.',
  },
  {
    year: '2025',
    title: 'Kỷ nguyên số',
    description: 'Ra mắt nền tảng thương mại điện tử mới, chương trình Loyalty KUMO Points, và trải nghiệm cá nhân hóa cho khách hàng.',
  },
  {
    year: '2026',
    title: 'Tương lai phía trước',
    description: 'BST Xuân Hè 2026 "Khoảng Không Ở Giữa" — tiếp tục hành trình tái định nghĩa sự tối giản trong thời trang Á Đông.',
  },
];

// --- Stats Data ---
const stats = [
  { icon: Users, value: '50.000+', label: 'Khách hàng tin dùng' },
  { icon: ShoppingBag, value: '200+', label: 'Sản phẩm thiết kế' },
  { icon: Globe, value: '6', label: 'Quốc gia phân phối' },
  { icon: Award, value: '15+', label: 'Giải thưởng thời trang' },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-white">
      {/* ===== HERO ===== */}
      <section ref={heroRef} className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1558171813-4c088753af8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxhc2lhbiUyMGZhc2hpb24lMjBtaW5pbWFsJTIwYmxhY2slMjBhbmQlMjB3aGl0ZXxlbnwxfHx8fDE3NDM1NjU2MDB8MA&ixlib=rb-4.1.0&q=80&w=1920"
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
            Về <em>KUMO</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/50 text-sm tracking-wider max-w-md mx-auto"
          >
            Tái định nghĩa sự tối giản — từ Sài Gòn đến thế giới.
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
                <p>
                  KUMO, trong tiếng Nhật có nghĩa là &ldquo;đám mây&rdquo;, được thành lập với niềm tin rằng thời trang đẹp nhất 
                  là khi nó không cần cố gắng thu hút sự chú ý. Giống như những đám mây lặng lẽ trôi trên bầu trời, 
                  thiết kế của chúng tôi tìm kiếm sự cân bằng giữa hiện diện và vắng mặt.
                </p>
                <p>
                  Lấy cảm hứng từ triết lý thẩm mỹ Wabi-Sabi của Nhật Bản — tôn vinh vẻ đẹp trong sự không hoàn hảo 
                  — mỗi sản phẩm KUMO là sự giao thoa giữa nghệ thuật thủ công Việt Nam và tư duy thiết kế tối giản 
                  Á Đông. Chúng tôi không chạy theo xu hướng; chúng tôi tạo ra những tác phẩm vượt thời gian.
                </p>
                <p>
                  Từ xưởng nhỏ đầu tiên ở Sài Gòn, KUMO đã phát triển thành một thương hiệu được yêu mến 
                  khắp Đông Nam Á, nhưng vẫn giữ nguyên tinh thần ban đầu: ít hơn là nhiều hơn.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="relative">
              <div className="overflow-hidden aspect-[3/4]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzQzNTY1NjAwfDA&ixlib=rb-4.1.0&q=80&w=800"
                  alt="KUMO Brand Story"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 border border-black/10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-black/10" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        {/* Subtle glow */}
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
            {/* Portrait */}
            <Reveal className="md:col-span-2">
              <div className="relative mx-auto max-w-sm">
                <div className="overflow-hidden aspect-[3/4]">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHBvcnRyYWl0JTIwbWluaW1hbHxlbnwxfHx8fDE3NDM1NjU2MDB8MA&ixlib=rb-4.1.0&q=80&w=600"
                    alt="Trần Minh Khôi — Nhà sáng lập KUMO"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                {/* Name overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <p className="font-['Cormorant_Garamond'] text-white text-2xl">Trần Minh Khôi</p>
                  <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase">Nhà sáng lập & Giám đốc Sáng tạo</p>
                </div>
              </div>
            </Reveal>

            {/* Story */}
            <Reveal delay={0.2} className="md:col-span-3">
              <div>
                <div className="space-y-5 text-white/50 text-sm leading-relaxed tracking-wide">
                  <p>
                    Sinh năm 1992 tại TP. Hồ Chí Minh, <span className="text-white/80">Trần Minh Khôi</span> lớn lên trong một gia đình 
                    có ba thế hệ làm nghề may. Từ nhỏ, anh đã được bao quanh bởi tiếng máy may và mùi vải mới 
                    — những ký ức đã gieo mầm cho niềm đam mê thời trang suốt đời.
                  </p>
                  <p>
                    Sau khi tốt nghiệp ngành Thiết kế Thời trang tại Đại học Mỹ thuật TP.HCM, Khôi dành 3 năm 
                    làm việc tại Tokyo, nơi anh được đắm chìm trong triết lý thẩm mỹ tối giản của Nhật Bản. 
                    Chính tại đây, ý tưởng về KUMO được hình thành — kết hợp kỹ nghệ thủ công Việt Nam 
                    với tư duy thiết kế Wabi-Sabi.
                  </p>
                  <p>
                    Năm 2020, giữa đại dịch, Khôi quyết định quay về Sài Gòn và thành lập KUMO trong một xưởng 
                    nhỏ 20m² tại Quận 3. Với chỉ 2 thợ may và một cái máy in lụa cũ, anh bắt đầu tạo ra 
                    những thiết kế đầu tiên mang triết lý &ldquo;ít hơn là nhiều hơn&rdquo;.
                  </p>
                  <p>
                    Ngày nay, với đội ngũ hơn 50 nghệ nhân và nhà thiết kế, Khôi vẫn trực tiếp giám sát 
                    từng bộ sưu tập, đảm bảo mỗi sản phẩm KUMO đều mang hơi thở của người sáng lập 
                    — sự tĩnh lặng có chủ đích, nơi mỗi đường may đều kể một câu chuyện.
                  </p>
                </div>

                {/* Founder quote */}
                <div className="mt-10 pt-8 border-t border-white/10">
                  <blockquote>
                    <p className="font-['Cormorant_Garamond'] text-white/70 text-xl md:text-2xl italic leading-relaxed mb-4">
                      &ldquo;Tôi không thiết kế quần áo. Tôi thiết kế khoảng không giữa con người và sự tự do của họ.&rdquo;
                    </p>
                    <footer className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                      — Trần Minh Khôi
                    </footer>
                  </blockquote>
                </div>

                {/* Founder highlights */}
                <div className="grid grid-cols-3 gap-6 mt-10">
                  {[
                    { label: 'Năm kinh nghiệm', value: '10+' },
                    { label: 'BST đã ra mắt', value: '12' },
                    { label: 'Giải thưởng', value: '8' },
                  ].map((item) => (
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
            {coreValues.map((value, i) => {
              const Icon = value.icon;
              return (
                <Reveal key={value.title} delay={i * 0.1}>
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
            {/* Vertical Line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-black/10 md:-translate-x-px" />

            {timelineEvents.map((event, i) => (
              <Reveal key={event.year} delay={i * 0.08}>
                <div className={`relative flex items-start gap-8 mb-12 md:mb-16 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Dot */}
                  <div className="absolute left-6 md:left-1/2 w-3 h-3 bg-black rounded-full -translate-x-1/2 mt-2 z-10">
                    <div className="absolute inset-0 bg-black rounded-full animate-ping opacity-20" />
                  </div>

                  {/* Content */}
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

                  {/* Spacer for alternating */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CREDIBILITY / STATS ===== */}
      <section className="bg-black py-20 md:py-28 relative overflow-hidden">
        {/* Background Glow */}
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
            {stats.map((stat, i) => {
              const Icon = stat.icon;
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

          {/* Trust badges */}
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
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwdHJlbmRzJTIwbW9kZXJuJTIwbWluaW1hbHxlbnwxfHx8fDE3NDM1NjU2MDB8MA&ixlib=rb-4.1.0&q=80&w=800"
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
                  {[
                    {
                      title: 'Thời trang bền vững',
                      desc: 'Xu hướng tất yếu của tương lai. KUMO cam kết 100% nguyên liệu bền vững vào năm 2028, từ vải organic cotton đến sợi tái chế.'
                    },
                    {
                      title: 'Genderless Fashion',
                      desc: 'Xóa nhòa ranh giới giới tính trong thiết kế. BST mới của KUMO hướng đến phong cách phi giới tính, tôn vinh sự tự do cá nhân.'
                    },
                    {
                      title: 'Kỹ thuật số & Thủ công',
                      desc: 'Kết hợp công nghệ in 3D và AI trong thiết kế với kỹ thuật may thủ công truyền thống, tạo nên những sản phẩm độc nhất vô nhị.'
                    },
                    {
                      title: 'Slow Fashion',
                      desc: 'KUMO tin vào thời trang chậm — sản xuất có ý thức, chất lượng vượt trội, và sản phẩm được tạo ra để tồn tại lâu dài, không phải một mùa rồi bỏ.'
                    },
                  ].map((trend, i) => (
                    <div key={trend.title} className="group">
                      <div className="flex items-start gap-4">
                        <span className="font-['Cormorant_Garamond'] text-2xl text-black/15 mt-[-2px]">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <h3 className="font-['Cormorant_Garamond'] text-lg mb-1.5">{trend.title}</h3>
                          <p className="text-sm text-black/50 leading-relaxed tracking-wide">{trend.desc}</p>
                        </div>
                      </div>
                      {i < 3 && <div className="border-b border-black/5 mt-6" />}
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
                &ldquo;Thời trang không chỉ là những gì bạn mặc, mà là cách bạn cảm nhận khoảng không giữa bạn và thế giới.&rdquo;
              </p>
              <footer className="text-[10px] tracking-[0.35em] uppercase text-black/40">
                — Triết lý sáng lập KUMO
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="relative h-96 overflow-hidden">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3RvcmUlMjBkYXJrJTIwbWluaW1hbHxlbnwxfHx8fDE3NDM1NjU2MDB8MA&ixlib=rb-4.1.0&q=80&w=1920"
          alt="KUMO CTA"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <Reveal>
            <p className="text-white/50 text-[10px] tracking-[0.4em] uppercase mb-4">Bắt đầu hành trình của bạn</p>
            <h2 className="font-['Cormorant_Garamond'] text-white text-4xl md:text-6xl mb-8">
              Khám phá Bộ sưu tập KUMO
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-white text-black text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-white/90 transition-all duration-300 group"
              >
                Mua ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/blog"
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
