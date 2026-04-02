import { Link } from 'react-router';
import { Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl mb-2">Cập nhật tin mới nhất</h3>
            <p className="text-white/50 text-sm tracking-wider">Nhận thông tin về sản phẩm mới, các bộ sưu tập giới hạn và tạp chí thời trang.</p>
          </div>
          {subscribed ? (
            <p className="text-sm tracking-[0.2em] text-white/60">Cảm ơn bạn đã đăng ký.</p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-0 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email-cua-ban@vi-du.com"
                required
                className="bg-white/5 border border-white/20 px-5 py-3 text-sm tracking-wider placeholder-white/30 outline-none focus:border-white/60 transition-colors w-full md:w-72"
              />
              <button
                type="submit"
                className="bg-white text-black px-5 py-3 flex items-center gap-2 hover:bg-white/90 transition-colors shrink-0"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <p className="font-['Cormorant_Garamond'] text-2xl tracking-[0.3em] mb-6">KUMO</p>
          <p className="text-white/40 text-xs tracking-wider leading-relaxed">
            Tái định nghĩa sự tối giản.<br />
            Thủ công Việt Nam,<br />
            Triết lý thẩm mỹ Á Đông.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-5 text-white/60">Cửa hàng</p>
          <ul className="flex flex-col gap-3">
            {['Hàng mới về', 'Áo khoác', 'Áo', 'Quần & Váy', 'Đầm', 'Phụ kiện'].map(item => (
              <li key={item}>
                <Link to="/shop" className="text-white/50 text-sm hover:text-white transition-colors tracking-wide">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-5 text-white/60">Hỗ trợ</p>
          <ul className="flex flex-col gap-3">
            {[
              { label: 'Về chúng tôi', path: '/about' },
              { label: 'Chính sách vận chuyển', path: '/' },
              { label: 'Đổi trả & Hoàn tiền', path: '/' },
              { label: 'Hướng dẫn chọn size', path: '/' },
              { label: 'Liên hệ', path: '/' },
              { label: 'Câu hỏi thường gặp', path: '/' }
            ].map(item => (
              <li key={item.label}>
                <Link to={item.path} className="text-white/50 text-sm hover:text-white transition-colors tracking-wide">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase mb-5 text-white/60">Theo dõi</p>
          <div className="flex gap-4 mb-8">
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-white/50 hover:text-white transition-colors">
              <Youtube size={18} />
            </a>
          </div>
          <p className="text-white/40 text-xs tracking-wider leading-relaxed">
            Trụ sở tại TP. Hồ Chí Minh.<br />
            Giao hàng toàn quốc & quốc tế.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © 2026 KUMO. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white/30 text-xs tracking-wider hover:text-white/60 transition-colors">Chính sách bảo mật</Link>
            <Link to="/" className="text-white/30 text-xs tracking-wider hover:text-white/60 transition-colors">Điều khoản dịch vụ</Link>
            <Link to="/admin" className="text-white/20 text-xs tracking-wider hover:text-white/40 transition-colors">Quản trị</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
