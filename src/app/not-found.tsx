'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center">
        <p className="font-['Cormorant_Garamond'] text-[120px] md:text-[180px] leading-none text-black/5 select-none">
          404
        </p>
        <div className="-mt-10 md:-mt-16">
          <p className="text-xs tracking-[0.4em] uppercase text-black/40 mb-4">Không tìm thấy trang</p>
          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl mb-6">Lạc giữa khoảng không</h1>
          <p className="text-black/40 text-sm tracking-wide mb-10 max-w-xs mx-auto">
            Trang bạn đang tìm kiếm dường như đã đi lạc. Hãy để chúng tôi dẫn bạn trở lại.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-black text-white text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-black/90 transition-all group">
              Về Trang chủ <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 border border-black text-xs tracking-[0.25em] uppercase px-8 py-4 hover:bg-black hover:text-white transition-all">
              Khám phá Bộ sưu tập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
