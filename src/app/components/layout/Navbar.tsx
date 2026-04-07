import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, User, Menu, X, Search, Zap, LogIn, Settings } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { label: 'Cửa hàng', href: '/shop' },
  { label: 'Về chúng tôi', href: '/about' },
  { label: 'Flash Sale', href: '/flash-sale' },
  { label: 'Ưu đãi', href: '/rewards' },
  { label: 'Tạp chí', href: '/blog' },
];

export function Navbar() {
  const { cartCount, wishlist, isLoggedIn, isAdmin, user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const navigate = useRouter();

  const isHome = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  if (isAdminPage || isAuthPage) return null;

  const navBg = scrolled || !isHome
    ? 'bg-white border-b border-black/10'
    : 'bg-transparent';

  const textColor = scrolled || !isHome ? 'text-black' : 'text-white';
  const logoColor = scrolled || !isHome ? 'text-black' : 'text-white';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className={`font-['Cormorant_Garamond'] text-2xl tracking-[0.3em] ${logoColor} transition-colors duration-500`}>
            KUMO
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                  key={link.href}
                  href={link.href}
                className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:opacity-60 ${textColor} relative group ${link.label === 'Flash Sale' ? 'flex items-center gap-1' : ''}`}
              >
                {link.label === 'Flash Sale' && <Zap size={10} className="fill-current" />}
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`${textColor} transition-all duration-300 hover:opacity-60`}
            >
              <Search size={18} />
            </button>

            {isLoggedIn ? (
              <>
                {/* Admin link */}
                {isAdmin && (
                  <Link href="/admin" className={`${textColor} transition-all duration-300 hover:opacity-60`} title="Quản trị">
                    <Settings size={18} />
                  </Link>
                )}

                {/* Wishlist */}
                <Link href="/account" className={`${textColor} transition-all duration-300 hover:opacity-60 relative`}>
                  <Heart size={18} />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>

                {/* User */}
                <Link href="/account" className={`${textColor} transition-all duration-300 hover:opacity-60 relative`}>
                  {user?.avatar ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-current/20">
                      <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <User size={18} />
                  )}
                </Link>

                {/* Cart */}
                <Link href="/cart" className={`${textColor} transition-all duration-300 hover:opacity-60 relative`}>
                  <ShoppingBag size={18} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </>
            ) : (
              <>
                {/* Login & Register buttons */}
                <Link
                  href="/login"
                  className={`hidden md:flex items-center gap-1.5 text-xs tracking-[0.15em] uppercase ${textColor} transition-all duration-300 hover:opacity-60`}
                >
                  <LogIn size={14} />
                  Đăng nhập
                </Link>
                <Link
                  href="/register"
                  className={`hidden md:flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase px-4 py-2 transition-all duration-300 ${
                    scrolled || !isHome
                      ? 'bg-black text-white hover:bg-black/90'
                      : 'bg-white text-black hover:bg-white/90'
                  }`}
                >
                  Đăng ký
                </Link>
                {/* Mobile: single login icon */}
                <Link
                  href="/login"
                  className={`md:hidden ${textColor} transition-all duration-300 hover:opacity-60`}
                >
                  <LogIn size={18} />
                </Link>
              </>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden ${textColor} transition-all duration-300 hover:opacity-60`}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white border-b border-black/10"
            >
              <form onSubmit={handleSearch} className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center gap-4">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="flex-1 text-sm tracking-wider outline-none bg-transparent placeholder-gray-400"
                  autoFocus
                />
                <button type="button" onClick={() => setSearchOpen(false)}>
                  <X size={16} className="text-gray-400 hover:text-black transition-colors" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-40 bg-black text-white flex flex-col pt-20 px-8"
          >
            <div className="flex flex-col gap-8 mt-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link href="/account" className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity">
                    Tài khoản
                  </Link>
                  <Link href="/cart" className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity">
                    Giỏ hàng ({cartCount})
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity">
                      Quản trị
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="font-['Cormorant_Garamond'] text-3xl tracking-wider hover:opacity-60 transition-opacity">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>

            <div className="mt-auto mb-12 pt-8 border-t border-white/20">
              <p className="text-xs tracking-[0.3em] text-white/40">KUMO — Tái định nghĩa sự tối giản</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
