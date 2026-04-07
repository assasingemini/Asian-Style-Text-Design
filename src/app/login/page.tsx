'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const navigate = useRouter();
  const { login, isLoggedIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate.push('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate.push('/');
      } else {
        setError('Email hoặc mật khẩu không đúng');
      }
    } catch {
      setError('Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1644483878398-b57d19f84ff8?w=1200&h=1600&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-end p-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-4">Chào mừng trở lại</p>
            <h2 className="font-['Cormorant_Garamond'] text-white text-5xl leading-tight mb-4">
              Phong cách<br />bắt đầu tại đây
            </h2>
            <p className="text-white/50 text-sm tracking-wide max-w-sm">
              Đăng nhập để khám phá bộ sưu tập, tích điểm thưởng và nhận ưu đãi độc quyền.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 md:px-16 py-20 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="font-['Cormorant_Garamond'] text-3xl tracking-[0.3em] text-black mb-2 block">
            KUMO
          </Link>
          <p className="text-black/30 text-[10px] tracking-[0.3em] uppercase mb-12">Đăng nhập tài khoản</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@vi-du.com"
                className="w-full border border-black/20 px-5 py-3.5 text-sm outline-none focus:border-black transition-colors tracking-wide"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-black/20 px-5 py-3.5 text-sm outline-none focus:border-black transition-colors tracking-wide pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs tracking-wide bg-red-50 px-4 py-3 border border-red-100"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all flex items-center justify-center gap-3 group disabled:opacity-60"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/10">
            <p className="text-sm text-black/40 tracking-wide text-center">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-black hover:opacity-60 transition-opacity underline underline-offset-4">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <div className="mt-8 p-5 bg-[#F8F6F2] border border-black/5">
            <p className="text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2">Tài khoản demo</p>
            <p className="text-xs text-black/60 tracking-wide">Admin: <span className="text-black">admin@kumo.vn</span> / <span className="text-black">admin123</span></p>
            <p className="text-xs text-black/60 tracking-wide mt-1">Hoặc đăng ký tài khoản mới</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
