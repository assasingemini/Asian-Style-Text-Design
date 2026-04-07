'use client';

import Link from 'next/link';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrderConfirmPage() {
  const orderId = 'ORD-2026-' + Math.floor(Math.random() * 9000 + 1000);
  const estimatedDate = new Date(Date.now() + 4 * 24 * 3600000).toLocaleDateString('vi-VN', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white pt-16 flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.6, delay: 0.1 }}
        >
          <CheckCircle size={56} className="mx-auto mb-8 text-black" strokeWidth={1} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-3">Cảm ơn bạn</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl mb-4">Đặt hàng thành công</h1>
          <p className="text-black/50 text-sm tracking-wide mb-10">
            Đơn hàng <span className="text-black font-medium">{orderId}</span> đã được đặt thành công.
            Chúng tôi đã gửi email xác nhận cho bạn.
          </p>

          <div className="border border-black/10 p-8 mb-10 text-left space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-black/10">
              <Package size={18} className="text-black/40" />
              <p className="text-sm tracking-wide">Dự kiến giao hàng</p>
            </div>
            <p className="font-['Cormorant_Garamond'] text-2xl">{estimatedDate}</p>
            <p className="text-black/40 text-xs tracking-wide">Giao hàng tiêu chuẩn · 3-5 ngày làm việc</p>

            <div className="pt-4 border-t border-black/10 space-y-2">
              <p className="text-xs tracking-[0.2em] uppercase text-black/40 mb-3">Bạn đã tích lũy được</p>
              <p className="font-['Cormorant_Garamond'] text-3xl">+150 Điểm</p>
              <p className="text-xs text-black/40 tracking-wide">Đã được cộng vào tài khoản Ưu đãi KUMO của bạn</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account"
              className="flex items-center justify-center gap-2 border border-black text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-black hover:text-white transition-all duration-300"
            >
              Xem đơn hàng
            </Link>
            <Link href="/shop"
              className="flex items-center justify-center gap-2 bg-black text-white text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-black/90 transition-all duration-300 group"
            >
              Tiếp tục mua sắm <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
