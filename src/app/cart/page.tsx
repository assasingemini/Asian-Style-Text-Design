'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ArrowRight, Tag, ShoppingBag, ArrowLeft, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../data/products';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, discountCode, discountAmount, applyDiscount, isLoggedIn } = useApp();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const navigate = useRouter();

  const discountValue = discountAmount > 0 ? Math.round(cartTotal * discountAmount / 100) : 0;
  const shipping = cartTotal >= 500000 ? 0 : 30000;
  const finalTotal = cartTotal - discountValue + shipping;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const success = applyDiscount(couponInput.trim());
    if (!success) setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    else setCouponError('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <LogIn size={48} className="mx-auto mb-6 text-black/20" strokeWidth={1} />
          <p className="font-['Cormorant_Garamond'] text-4xl mb-4">Vui lòng đăng nhập</p>
          <p className="text-black/40 text-sm tracking-wide mb-10">Bạn cần đăng nhập để xem giỏ hàng và mua sắm.</p>
          <Link href="/login"
            className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all group"
          >
            Đăng nhập <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <p className="mt-4 text-xs text-black/30 tracking-wide">
            Chưa có tài khoản? <Link href="/register" className="text-black underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <ShoppingBag size={48} className="mx-auto mb-6 text-black/20" />
          <p className="font-['Cormorant_Garamond'] text-4xl mb-4">Giỏ hàng đang trống</p>
          <p className="text-black/40 text-sm tracking-wide mb-10">Hãy khám phá bộ sưu tập và tìm món đồ bạn yêu thích.</p>
          <Link href="/shop"
            className="inline-flex items-center gap-3 bg-black text-white text-xs tracking-[0.25em] uppercase px-10 py-4 hover:bg-black/90 transition-all group"
          >
            Mua ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors mb-6">
            <ArrowLeft size={14} /> Tiếp tục mua sắm
          </Link>
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Giỏ hàng</h1>
          <p className="text-black/40 text-sm mt-1">{cart.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 md:gap-16">
          {/* Cart Items */}
          <div>
            {/* Header */}
            <div className="hidden md:grid grid-cols-[1fr_120px_120px_40px] gap-4 pb-4 border-b border-black/10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40">Sản phẩm</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 text-center">Số lượng</p>
              <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 text-right">Tổng cộng</p>
              <div />
            </div>

            <AnimatePresence>
              {cart.map(item => {
                const price = item.product.isFlashSale && item.product.flashSalePrice
                  ? item.product.flashSalePrice
                  : item.product.price;
                return (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-[1fr_120px_120px_40px] gap-4 items-center py-6 border-b border-black/10"
                  >
                    {/* Product */}
                    <div className="flex gap-5 items-start">
                      <Link href={`/shop/${item.product.id}`} className="shrink-0 w-24 h-28 overflow-hidden bg-[#F5F5F3]">
                        <ImageWithFallback
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-1">{item.product.category}</p>
                        <Link href={`/shop/${item.product.id}`} className="font-['Cormorant_Garamond'] text-xl hover:opacity-60 transition-opacity">
                          {item.product.name}
                        </Link>
                        <div className="flex gap-4 mt-2">
                          <p className="text-xs text-black/40 tracking-wide">Size: {item.size}</p>
                          <p className="text-xs text-black/40 tracking-wide">Màu: {item.color}</p>
                        </div>
                        {item.product.isFlashSale && (
                          <p className="text-red-500 text-xs mt-1 tracking-wide">Giá Giảm Sốc</p>
                        )}
                        <p className="md:hidden text-sm mt-2">{formatPrice(price * item.quantity)}</p>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-black/20 w-fit md:mx-auto">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total */}
                    <p className="hidden md:block text-right text-sm tracking-wide">{formatPrice(price * item.quantity)}</p>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                      className="w-8 h-8 flex items-center justify-center text-black/30 hover:text-black transition-colors md:ml-auto"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="border border-black/10 p-8">
              <h2 className="font-['Cormorant_Garamond'] text-2xl mb-8">Tóm tắt đơn hàng</h2>

              {/* Coupon */}
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-black/60 mb-3">Mã giảm giá</p>
                {discountCode ? (
                  <div className="flex items-center gap-3 bg-black/5 px-4 py-3">
                    <Tag size={14} className="text-black/60" />
                    <span className="text-sm tracking-wider flex-1">{discountCode}</span>
                    <span className="text-green-700 text-sm">-{discountAmount}%</span>
                  </div>
                ) : (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      placeholder="KUMO10"
                      className="flex-1 border border-black/20 px-4 py-2.5 text-sm tracking-wider outline-none focus:border-black transition-colors"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-black text-white text-xs tracking-wider px-5 py-2.5 hover:bg-black/90 transition-colors shrink-0"
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
                {couponError && <p className="text-red-500 text-xs mt-2 tracking-wide">{couponError}</p>}
                <p className="text-[10px] text-black/30 mt-2 tracking-wide">Thử dùng: KUMO10, WELCOME20, FLASH30</p>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 pb-6 border-b border-black/10">
                <div className="flex justify-between text-sm tracking-wide">
                  <span className="text-black/60">Tạm tính</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-sm tracking-wide text-green-700">
                    <span>Giảm giá ({discountAmount}%)</span>
                    <span>-{formatPrice(discountValue)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm tracking-wide">
                  <span className="text-black/60">Vận chuyển</span>
                  <span>{shipping === 0 ? 'Miễn phí' : formatPrice(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-black/30 tracking-wide">Mua thêm {formatPrice(500000 - cartTotal)} để được miễn phí vận chuyển</p>
                )}
              </div>

              <div className="flex justify-between py-5">
                <span className="font-['Cormorant_Garamond'] text-xl">Tổng cộng</span>
                <span className="font-['Cormorant_Garamond'] text-xl">{formatPrice(finalTotal)}</span>
              </div>

              <button
                onClick={() => navigate.push('/checkout')}
                className="w-full bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                Tiến hành thanh toán <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-5 flex justify-center gap-6">
                {['visa', 'mastercard', 'paypal', 'momo'].map(method => (
                  <span key={method} className="text-[9px] tracking-[0.15em] uppercase text-black/30">{method}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
