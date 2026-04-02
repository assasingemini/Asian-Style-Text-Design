import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoggedIn } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate('/account');
    return null;
  }

  const passwordChecks = [
    { label: 'Ít nhất 6 ký tự', valid: form.password.length >= 6 },
    { label: 'Mật khẩu khớp nhau', valid: form.password === form.confirmPassword && form.confirmPassword.length > 0 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (form.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const success = register(form.name, form.email, form.password);
      if (success) {
        navigate('/');
      } else {
        setError('Email đã được sử dụng');
      }
    } catch {
      setError('Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img
            src="https://images.unsplash.com/photo-1683642765591-2370edc15193?w=1200&h=1600&fit=crop"
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
            <p className="text-white/40 text-[10px] tracking-[0.4em] uppercase mb-4">Gia nhập KUMO</p>
            <h2 className="font-['Cormorant_Garamond'] text-white text-5xl leading-tight mb-4">
              Tối giản<br />là nghệ thuật
            </h2>
            <p className="text-white/50 text-sm tracking-wide max-w-sm">
              Trở thành thành viên để tích điểm, đổi ưu đãi và trải nghiệm thời trang đẳng cấp.
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
          <Link to="/" className="font-['Cormorant_Garamond'] text-3xl tracking-[0.3em] text-black mb-2 block">
            KUMO
          </Link>
          <p className="text-black/30 text-[10px] tracking-[0.3em] uppercase mb-12">Tạo tài khoản mới</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => updateForm('name', e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full border border-black/20 px-5 py-3.5 text-sm outline-none focus:border-black transition-colors tracking-wide"
              />
            </div>

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => updateForm('email', e.target.value)}
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
                  value={form.password}
                  onChange={e => updateForm('password', e.target.value)}
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

            <div>
              <label className="block text-[10px] tracking-[0.25em] uppercase text-black/50 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={e => updateForm('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className="w-full border border-black/20 px-5 py-3.5 text-sm outline-none focus:border-black transition-colors tracking-wide"
              />
            </div>

            {/* Password checks */}
            {form.password.length > 0 && (
              <div className="flex gap-4">
                {passwordChecks.map(check => (
                  <div key={check.label} className="flex items-center gap-1.5">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${check.valid ? 'bg-black' : 'border border-black/20'}`}>
                      {check.valid && <Check size={8} className="text-white" />}
                    </div>
                    <span className={`text-[10px] tracking-wide ${check.valid ? 'text-black' : 'text-black/30'}`}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

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
                  Tạo tài khoản
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-black/10">
            <p className="text-sm text-black/40 tracking-wide text-center">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-black hover:opacity-60 transition-opacity underline underline-offset-4">
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Perks */}
          <div className="mt-8 grid grid-cols-3 gap-px bg-black/10">
            {[
              { emoji: '🎁', label: 'Tích điểm\nmỗi đơn hàng' },
              { emoji: '🚚', label: 'Miễn phí\nvận chuyển' },
              { emoji: '⚡', label: 'Ưu đãi\nđộc quyền' },
            ].map(perk => (
              <div key={perk.label} className="bg-white p-4 text-center">
                <div className="text-xl mb-2">{perk.emoji}</div>
                <p className="text-[9px] tracking-wider text-black/40 uppercase whitespace-pre-line">{perk.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
