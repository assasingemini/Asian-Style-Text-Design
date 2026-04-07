'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Heart, Star, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, ArrowRight, Share2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reviews, formatPrice } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/product/ProductCard';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useRouter();
  const { addToCart, toggleWishlist, wishlist, isLoggedIn, products, getSalePrice } = useApp();

  const product = products.find(p => p.id === id);
  const productReviews = reviews.filter(r => r.productId === id);
  const relatedProducts = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [sizeError, setSizeError] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="font-['Cormorant_Garamond'] text-5xl text-black/20 mb-4">Không tìm thấy sản phẩm</p>
          <Link href="/shop" className="text-xs tracking-[0.2em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all">
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const { isSale, price: displayPrice } = getSalePrice(product);

  const handleAddToCart = () => {
    if (!isLoggedIn) { navigate.push('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    const success = addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    if (success) setSizeError(false);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) { navigate.push('/login'); return; }
    if (!selectedSize) { setSizeError(true); return; }
    const success = addToCart(product, selectedSize, selectedColor || product.colors[0], quantity);
    if (success) navigate.push('/cart');
  };

  const getColorTranslation = (color: string) => {
    const translations: Record<string, string> = {
      'Black': 'Đen',
      'White': 'Trắng',
      'Charcoal': 'Than',
      'Cream': 'Kem',
      'Oat': 'Yến mạch',
      'Tan': 'Nâu vàng',
      'Sage': 'Xanh xám',
      'Ivory': 'Ngà',
      'Silver': 'Bạc',
      'Slate': 'Xám đá',
      'Deep Red': 'Đỏ đậm',
      'Light Gray': 'Xám nhạt',
      'Deep Navy': 'Xanh navy đậm',
      'Dark Brown': 'Nâu đậm'
    };
    return translations[color] || color;
  };

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex items-center gap-2 text-xs tracking-wider text-black/40">
        <Link href="/" className="hover:text-black transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black transition-colors">Cửa hàng</Link>
        <span>/</span>
        <span className="text-black">{product.name}</span>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Gallery */}
          <div className="flex gap-4">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-2 w-20">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`aspect-square overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-black' : 'border-transparent opacity-50 hover:opacity-80'}`}
                >
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative">
              <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F5F3]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <ImageWithFallback
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(i => (i - 1 + product.images.length) % product.images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedImage(i => (i + 1) % product.images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <span className="bg-black text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase">Mới</span>}
                  {product.isBestseller && <span className="bg-white text-black text-[9px] tracking-[0.2em] px-2 py-1 uppercase border border-black/20">Bán chạy</span>}
                  {isSale && <span className="bg-red-600 text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase flex items-center gap-1">
                    <Zap size={8} className="fill-white" /> Flash Sale
                  </span>}
                  {product.stock <= 5 && <span className="bg-red-600 text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase">Chỉ còn {product.stock} sản phẩm</span>}
                </div>
              </div>

              {/* Mobile thumbnails */}
              <div className="md:hidden flex gap-2 mt-3">
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-1 h-1 transition-all ${selectedImage === i ? 'bg-black' : 'bg-black/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:py-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-black/40 mb-2">{product.category}</p>
                <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">{product.name}</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-10 h-10 border border-black/20 flex items-center justify-center hover:border-black transition-colors"
                >
                  <Heart size={16} className={isWishlisted ? 'fill-black stroke-black' : ''} />
                </button>
                <button className="w-10 h-10 border border-black/20 flex items-center justify-center hover:border-black transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6">
              {isSale ? (
                <>
                  <span className="font-['Cormorant_Garamond'] text-3xl text-red-600">{formatPrice(displayPrice)}</span>
                  <span className="text-black/30 line-through text-xl">{formatPrice(product.price)}</span>
                  <span className="bg-red-600 text-white text-xs px-2 py-0.5">
                    -{Math.round((1 - displayPrice / product.price) * 100)}%
                  </span>
                </>
              ) : product.originalPrice ? (
                <>
                  <span className="font-['Cormorant_Garamond'] text-3xl">{formatPrice(product.price)}</span>
                  <span className="text-black/30 line-through text-xl">{formatPrice(product.originalPrice)}</span>
                </>
              ) : (
                <span className="font-['Cormorant_Garamond'] text-3xl">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-black/10">
              <div className="flex gap-0.5">
                {Array(5).fill(null).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < Math.floor(product.rating) ? 'fill-black stroke-black' : 'fill-black/20 stroke-black/20'}
                  />
                ))}
              </div>
              <span className="text-xs text-black/60 tracking-wide">{product.rating} ({product.reviewCount} đánh giá)</span>
            </div>

            {/* Color */}
            <div className="mb-6">
              <p className="text-[10px] tracking-[0.25em] uppercase text-black/60 mb-3">
                Màu sắc: <span className="text-black">{getColorTranslation(selectedColor || product.colors[0])}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={getColorTranslation(color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      (selectedColor || product.colors[0]) === color ? 'border-black scale-110' : 'border-transparent hover:border-black/40'
                    }`}
                    style={{
                      backgroundColor: color === 'Black' ? '#0a0a0a' :
                        color === 'White' ? '#fafafa' :
                        color === 'Charcoal' ? '#3d3d3d' :
                        color === 'Cream' ? '#f5f0e8' :
                        color === 'Oat' ? '#e8e0d0' :
                        color === 'Tan' ? '#c4a882' :
                        color === 'Sage' ? '#8a9e8a' :
                        color === 'Ivory' ? '#f8f4e8' :
                        color === 'Silver' ? '#c0c0c0' :
                        color === 'Slate' ? '#6b7280' :
                        color === 'Deep Red' ? '#8b0000' :
                        color === 'Light Gray' ? '#d1d5db' :
                        color === 'Deep Navy' ? '#0a1628' :
                        color === 'Dark Brown' ? '#3d1c02' : '#888'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[10px] tracking-[0.25em] uppercase ${sizeError ? 'text-red-500' : 'text-black/60'}`}>
                  {sizeError ? 'Vui lòng chọn kích cỡ' : 'Kích cỡ'}
                  {selectedSize && <span className="text-black ml-2">{selectedSize}</span>}
                </p>
                <button className="text-[10px] tracking-wider text-black/40 underline hover:text-black transition-colors">
                  Hướng dẫn chọn size
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-4 py-2.5 text-xs tracking-wider border transition-all duration-200 ${
                      selectedSize === size
                        ? 'bg-black text-white border-black'
                        : sizeError
                        ? 'border-red-300 text-black/60 hover:border-red-400'
                        : 'border-black/20 text-black/60 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-[10px] tracking-[0.25em] uppercase text-black/60">Số lượng</p>
              <div className="flex items-center border border-black/20">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm tracking-wider">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className="text-xs text-black/30 tracking-wide">còn {product.stock} sản phẩm</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 border-2 border-black text-black text-xs tracking-[0.25em] uppercase py-4 hover:bg-black hover:text-white transition-all duration-300 group"
              >
                <ShoppingBag size={16} /> Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white text-xs tracking-[0.25em] uppercase py-4 hover:bg-black/90 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Mua ngay <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 py-6 border-t border-black/10">
              {['Miễn phí vận chuyển từ 500k', 'Đổi trả miễn phí trong 30 ngày', 'Tích lũy điểm thưởng', 'Thanh toán an toàn'].map(perk => (
                <div key={perk} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-black rounded-full" />
                  <p className="text-xs text-black/50 tracking-wide">{perk}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-black/10 mt-4">
              <div className="flex">
                {(['description', 'details', 'reviews'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-4 text-[10px] tracking-[0.25em] uppercase border-b-2 transition-all ${
                      tab === t ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'
                    }`}
                  >
                    {t === 'reviews' ? `Đánh giá (${productReviews.length})` : 
                     t === 'description' ? 'Mô tả' : 'Chi tiết'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="py-6"
                >
                  {tab === 'description' && (
                    <p className="text-black/60 text-sm leading-relaxed tracking-wide">{product.description}</p>
                  )}
                  {tab === 'details' && (
                    <ul className="space-y-2">
                      {product.details.map(detail => (
                        <li key={detail} className="flex items-center gap-3 text-sm text-black/60 tracking-wide">
                          <div className="w-1 h-1 bg-black/40 rounded-full" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tab === 'reviews' && (
                    <div className="space-y-6">
                      {productReviews.length === 0 ? (
                        <p className="text-black/40 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá.</p>
                      ) : (
                        productReviews.map(review => (
                          <div key={review.id} className="border-b border-black/10 pb-6">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <p className="text-sm tracking-wide">{review.userName}</p>
                                {review.verified && (
                                  <span className="text-[9px] tracking-wider text-black/40 border border-black/20 px-2 py-0.5">Đã xác thực</span>
                                )}
                              </div>
                              <p className="text-xs text-black/30">{review.date}</p>
                            </div>
                            <div className="flex gap-0.5 mb-2">
                              {Array(5).fill(null).map((_, i) => (
                                <Star key={i} size={11} className={i < review.rating ? 'fill-black stroke-black' : 'fill-black/20 stroke-black/20'} />
                              ))}
                            </div>
                            <p className="text-sm text-black/60 tracking-wide">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 md:mt-28">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">Có thể bạn cũng thích</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl">Sản phẩm tương tự</h2>
              </div>
              <Link href="/shop" className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:gap-4 transition-all">
                Xem tất cả <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
