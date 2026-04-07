'use client';

import React from 'react';
import { X, Package, Truck, CreditCard, User, Calendar, MapPin, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order } from '../../context/AppContext';
import { formatPrice } from '../../data/products';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  isAdminView?: boolean;
}

export function OrderDetailsModal({ order, isOpen, onClose, isAdminView = false }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/10">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl">Chi tiết đơn hàng</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] tracking-widest uppercase text-black/40">{order.id}</span>
                  <span className="w-1 h-1 rounded-full bg-black/20" />
                  <span className="text-[10px] tracking-widest uppercase text-black/40">{order.date}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black transition-colors rounded-full hover:bg-black/5"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              {/* Status Banner */}
              <div className={`p-4 flex items-center gap-3 ${
                order.status === 'Đã giao' ? 'bg-green-50 text-green-700' :
                order.status === 'Đang xử lý' ? 'bg-blue-50 text-blue-700' :
                order.status === 'Đang giao' ? 'bg-amber-50 text-amber-700' :
                'bg-red-50 text-red-700'
              }`}>
                {order.status === 'Đang xử lý' && <Calendar size={18} />}
                {order.status === 'Đang giao' && <Truck size={18} />}
                {order.status === 'Đã giao' && <CheckCircle size={18} />}
                {order.status === 'Đã hủy' && <X size={18} />}
                <span className="text-xs font-medium tracking-[0.1em] uppercase">Trạng thái: {order.status}</span>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-black/40">
                    <User size={14} />
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold">Thông tin khách hàng</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.customerName || 'Khách hàng'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-black/40">
                    <CreditCard size={14} />
                    <p className="text-[10px] tracking-[0.2em] uppercase font-semibold">Thanh toán</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">Tổng cộng: {formatPrice(order.total)}</p>
                    {order.pointsEarned ? (
                      <p className="text-xs text-green-600 font-medium">+{order.pointsEarned} Điểm tích lũy</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4 pt-4 border-t border-black/10">
                <div className="flex items-center gap-2 text-black/40 mb-2">
                  <Package size={14} />
                  <p className="text-[10px] tracking-[0.2em] uppercase font-semibold">Sản phẩm đã đặt</p>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 border border-black/5 hover:border-black/10 transition-colors bg-[#F9F9F9]">
                      <div className="w-16 h-20 bg-white overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={item.product?.images?.[0] || ''}
                          alt={item.product?.name || 'Sản phẩm'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-['Cormorant_Garamond'] text-lg truncate leading-tight">{item.product?.name}</p>
                        <div className="flex gap-3 text-[10px] text-black/40 mt-1 uppercase tracking-wider">
                          <span>Size: {item.size}</span>
                          <span>Màu: {item.color}</span>
                          <span>SL: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatPrice((item.product?.flashSalePrice || item.product?.price || 0) * item.quantity)}</p>
                        <p className="text-[10px] text-black/40 mt-1">{formatPrice(item.product?.flashSalePrice || item.product?.price || 0)}/sp</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-black/10 bg-[#F9F9F9] flex justify-between items-center">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-black/40 mb-1">Phương thức thanh toán</p>
                <p className="text-xs font-medium">Thanh toán khi nhận hàng (COD)</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-black/40 mb-1">Tổng giá trị</p>
                <p className="font-['Cormorant_Garamond'] text-2xl">{formatPrice(order.total)}</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CheckCircle({ size, className }: { size: number; className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
