'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdFromUrl = searchParams.get('id');
  const [orderId, setOrderId] = useState(orderIdFromUrl || 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const { user } = useApp();
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Simulate fetching points earned or calculate based on dummy order value
    setPointsEarned(Math.floor(Math.random() * 150) + 50);
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={40} strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase text-black/40 mb-4">Đặt hàng thành công</p>
          <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl mb-6 truncate px-4 pb-2">
            Cảm ơn bạn, {user?.name ? user.name.split(' ').pop() : 'quý khách'}!
          </h1>
          <p className="text-black/60 text-sm leading-relaxed max-w-md mx-auto mb-10 tracking-wide">
            Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý. 
            KUMO chân thành cảm ơn bạn đã tin tưởng và lựa chọn sản phẩm của chúng tôi.
          </p>

          <div className="bg-white border border-black/5 p-8 mb-12 shadow-sm rounded-none">
            <div className="grid grid-cols-2 gap-8 text-left">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-semibold">Mã đơn hàng</p>
                <p className="font-medium text-sm tracking-widest">{orderId}</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-black/40 mb-2 font-semibold">Điểm tích lũy</p>
                <div className="flex items-center gap-2">
                  <span className="font-['Cormorant_Garamond'] text-2xl">+{pointsEarned}</span>
                  <span className="text-[9px] tracking-wider uppercase text-black/40">Điểm</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-black/5 text-left italic opacity-60">
                <p className="text-xs">Thông tin xác nhận chi tiết đã được gửi về email của bạn.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/account" className="w-full sm:w-auto bg-black text-white text-[10px] tracking-[0.3em] uppercase px-12 py-5 hover:bg-black/90 transition-all flex items-center justify-center gap-3 text-center">
              Quản lý đơn hàng <Package size={14} />
            </Link>
            <Link href="/shop" className="w-full sm:w-auto border border-black text-black text-[10px] tracking-[0.3em] uppercase px-12 py-5 hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 text-center">
              Tiếp tục mua sắm <ShoppingBag size={14} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FBFBFB] pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
