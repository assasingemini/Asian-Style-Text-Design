'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Wallet, Building, LogIn, HandCoins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

type Step = 'shipping' | 'payment' | 'confirm';

const STEPS: { key: Step; label: string }[] = [
  { key: 'shipping', label: 'Vận chuyển' },
  { key: 'payment', label: 'Thanh toán' },
  { key: 'confirm', label: 'Xác nhận' },
];



export default function CheckoutPage() {
  const navigate = useRouter();
  const { cart, cartTotal, discountAmount, clearCart, user, redeemPoints, isLoggedIn, earnPoints, addOrder, paymentSettings } = useApp();
  const [step, setStep] = useState<Step>('shipping');
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: 'TP. Hồ Chí Minh',
    note: '',
  });

  const discountValue = discountAmount > 0 ? Math.round(cartTotal * discountAmount / 100) : 0;
  const shippingFee = cartTotal >= 500000 ? 0 : 30000;
  const pointsDiscount = usePoints ? Math.min(Math.floor(pointsToRedeem / 100) * 1000, cartTotal * 0.2) : 0;
  const finalTotal = cartTotal - discountValue - pointsDiscount + shippingFee;

  const stepIndex = STEPS.findIndex(s => s.key === step);

  const availablePaymentMethods = [
    { id: 'cod', label: 'Thanh toán khi nhận hàng', icon: HandCoins },
    ...(paymentSettings?.momoEnabled ? [{ id: 'momo', label: 'Ví MoMo', icon: Wallet }] : []),
    ...(paymentSettings?.bankEnabled ? [{ id: 'bank', label: 'Chuyển khoản Ngân hàng', icon: Building }] : []),
  ];

  const handleNext = () => {
    if (step === 'shipping') {
      if (!shipping.name || !shipping.email || !shipping.phone || !shipping.address) {
        setShippingError('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
        return;
      }
      setShippingError('');
      setStep('payment');
    } else if (step === 'payment') {
      setStep('confirm');
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    if (usePoints && pointsToRedeem > 0) {
      redeemPoints(pointsToRedeem);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Earn points based on admin-configured price thresholds per product
    earnPoints(finalTotal, cart);
    // Create real order
    await addOrder(cart, finalTotal);
    clearCart();
    navigate.push('/checkout/confirm');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <LogIn size={48} className="mx-auto mb-6 text-black/20" strokeWidth={1} />
          <p className="font-['Cormorant_Garamond'] text-4xl mb-4">Vui lòng đăng nhập</p>
          <p className="text-black/40 text-sm tracking-wide mb-10">Bạn cần đăng nhập để thanh toán.</p>
          <Link href="/login" className="text-xs tracking-[0.25em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && step !== 'confirm') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Cormorant_Garamond'] text-4xl mb-4">Giỏ hàng đang trống</p>
          <Link href="/shop" className="text-xs tracking-[0.25em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all">
            Mua ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs text-black/40 hover:text-black transition-colors mb-6 tracking-wider">
            <ArrowLeft size={14} /> Quay lại giỏ hàng
          </Link>
          <div className="font-['Cormorant_Garamond'] text-3xl mb-8">Thanh toán</div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className={`flex items-center gap-2 ${i <= stepIndex ? 'text-black' : 'text-black/30'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all ${
                    i < stepIndex ? 'bg-black border-black text-white' :
                    i === stepIndex ? 'border-black text-black' :
                    'border-black/20'
                  }`}>
                    {i < stepIndex ? <Check size={12} /> : i + 1}
                  </div>
                  <span className="text-[10px] tracking-[0.2em] uppercase hidden md:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-16 md:w-24 h-px mx-3 transition-all ${i < stepIndex ? 'bg-black' : 'bg-black/20'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          {/* Form */}
          <div>
            <AnimatePresence mode="wait">
              {step === 'shipping' && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Thông tin vận chuyển</h2>
                  {shippingError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm tracking-wide">
                      {shippingError}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Họ và tên *</label>
                      <input
                        type="text"
                        value={shipping.name}
                        onChange={e => setShipping(s => ({ ...s, name: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Email *</label>
                      <input
                        type="email"
                        value={shipping.email}
                        onChange={e => setShipping(s => ({ ...s, email: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                        placeholder="email@vi-du.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Số điện thoại *</label>
                      <input
                        type="tel"
                        value={shipping.phone}
                        onChange={e => setShipping(s => ({ ...s, phone: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                        placeholder="0901 234 567"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Địa chỉ *</label>
                      <input
                        type="text"
                        value={shipping.address}
                        onChange={e => setShipping(s => ({ ...s, address: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                        placeholder="123 Lê Lợi, Quận 1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Thành phố</label>
                      <select
                        value={shipping.city}
                        onChange={e => setShipping(s => ({ ...s, city: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors bg-white tracking-wide"
                      >
                        {['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Biên Hòa'].map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.25em] uppercase text-black/60 mb-2">Ghi chú (Tùy chọn)</label>
                      <input
                        type="text"
                        value={shipping.note}
                        onChange={e => setShipping(s => ({ ...s, note: e.target.value }))}
                        className="w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black transition-colors tracking-wide"
                        placeholder="Chỉ dẫn đặc biệt..."
                      />
                    </div>
                  </div>

                  {/* Reward Points */}
                  {user && user.points > 0 && (
                    <div className="mt-8 p-6 border border-black/10 bg-[#F8F6F2]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm tracking-wide">Sử dụng điểm thưởng</p>
                          <p className="text-xs text-black/40 mt-1">Bạn đang có {user.points.toLocaleString()} điểm khả dụng</p>
                        </div>
                        <button
                          onClick={() => setUsePoints(!usePoints)}
                          className={`w-12 h-6 rounded-full transition-all duration-300 relative ${usePoints ? 'bg-black' : 'bg-black/20'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${usePoints ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                      {usePoints && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-3"
                        >
                          <input
                            type="range"
                            min={0}
                            max={Math.min(user.points, 5000)}
                            step={100}
                            value={pointsToRedeem}
                            onChange={e => setPointsToRedeem(Number(e.target.value))}
                            className="w-full accent-black"
                          />
                          <div className="flex justify-between text-xs text-black/60 tracking-wide">
                            <span>Đang đổi: {pointsToRedeem.toLocaleString()} điểm</span>
                            <span>Giảm giá: -{formatPrice(Math.floor(pointsToRedeem / 100) * 1000)}</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Phương thức thanh toán</h2>
                  <div className="space-y-3 mb-8">
                    {availablePaymentMethods.map(method => {
                      const Icon = method.icon;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-4 p-5 border-2 transition-all text-left ${
                            paymentMethod === method.id ? 'border-black' : 'border-black/15 hover:border-black/30'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === method.id ? 'border-black' : 'border-black/20'
                          }`}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                          </div>
                          <Icon size={18} className="text-black/60" />
                          <span className="text-sm tracking-wide">{method.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === 'cod' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-6 border border-black/10 bg-[#F8F6F2] text-center space-y-2"
                    >
                      <p className="text-sm tracking-wide">Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng.</p>
                      <p className="text-xs text-black/40">Vui lòng chuẩn bị sẵn số tiền {formatPrice(finalTotal)}.</p>
                    </motion.div>
                  )}

                  {paymentMethod === 'momo' && (
                    <div className="p-6 border border-black/10 bg-[#F8F6F2] text-center">
                      <div className="w-40 h-40 bg-white border border-black/10 mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        {paymentSettings?.momoQrUrl ? (
                          <img src={paymentSettings.momoQrUrl} alt="Mã QR MoMo" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <p className="text-xs text-black/40">Mã QR MoMo</p>
                        )}
                      </div>
                      <p className="text-sm text-black/60 tracking-wide">Quét mã bằng ứng dụng MoMo để thanh toán</p>
                      <p className="font-['Cormorant_Garamond'] text-xl mt-2">{formatPrice(finalTotal)}</p>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="p-6 border border-black/10 bg-[#F8F6F2] space-y-3">
                      {[
                        ['Ngân hàng', paymentSettings?.bankName || 'Chưa thiết lập'],
                        ['Số tài khoản', paymentSettings?.bankAccount || 'Chưa thiết lập'],
                        ['Tên tài khoản', paymentSettings?.bankAccountName || 'Chưa thiết lập'],
                        ['Số tiền', formatPrice(finalTotal)],
                        ['Nội dung', 'KUMO-' + Date.now().toString().slice(-6)],
                      ].map(([label, value]) => (
                        <div key={label as string} className="flex justify-between">
                          <span className="text-xs text-black/40 tracking-wide">{label}</span>
                          <span className="text-sm tracking-wide">{value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Kiểm tra đơn hàng</h2>

                  <div className="space-y-4 mb-8">
                    {cart.map(item => {
                      const price = item.product.isFlashSale && item.product.flashSalePrice
                        ? item.product.flashSalePrice : item.product.price;
                      return (
                        <div key={`${item.product.id}-${item.size}`} className="flex gap-4 items-center">
                          <div className="w-16 h-20 overflow-hidden bg-[#F5F5F3] shrink-0">
                            <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-['Cormorant_Garamond'] text-base">{item.product.name}</p>
                            <p className="text-xs text-black/40 tracking-wide mt-0.5">{item.size} · {item.color} · SL: {item.quantity}</p>
                          </div>
                          <p className="text-sm tracking-wide">{formatPrice(price * item.quantity)}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-black/10 pt-6 space-y-2 mb-8">
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Giao đến:</span>
                      <span className="text-right text-sm">{shipping.address}, {shipping.city}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-black/60">Thanh toán:</span>
                      <span>{availablePaymentMethods.find(m => m.id === paymentMethod)?.label}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-4 mt-10">
              {step !== 'shipping' && (
                <button
                  onClick={() => setStep(step === 'confirm' ? 'payment' : 'shipping')}
                  className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase border border-black px-6 py-3 hover:bg-black hover:text-white transition-all"
                >
                  <ArrowLeft size={14} /> Quay lại
                </button>
              )}
              {step !== 'confirm' ? (
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all group"
                >
                  Tiếp tục <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    <>Đặt hàng — {formatPrice(finalTotal)} <ArrowRight size={14} /></>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border border-black/10 p-6">
              <h3 className="font-['Cormorant_Garamond'] text-xl mb-6">Tóm tắt</h3>
              <div className="space-y-3 pb-5 border-b border-black/10">
                <div className="flex justify-between text-sm text-black/60 tracking-wide">
                  <span>Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountValue)}</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Giảm giá bằng điểm</span>
                    <span>-{formatPrice(pointsDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-black/60 tracking-wide">
                  <span>Vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>
              </div>
              <div className="flex justify-between py-5">
                <span className="font-['Cormorant_Garamond'] text-lg">Tổng cộng</span>
                <span className="font-['Cormorant_Garamond'] text-lg">{formatPrice(finalTotal)}</span>
              </div>

              {/* Cart items preview */}
              <div className="space-y-3 border-t border-black/10 pt-5">
                {cart.slice(0, 3).map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-12 h-14 overflow-hidden bg-[#F5F5F3] shrink-0">
                      <ImageWithFallback src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs tracking-wide truncate">{item.product.name}</p>
                      <p className="text-[10px] text-black/40">{item.size} · ×{item.quantity}</p>
                    </div>
                  </div>
                ))}
                {cart.length > 3 && (
                  <p className="text-xs text-black/40 tracking-wide text-center">+{cart.length - 3} sản phẩm khác</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
