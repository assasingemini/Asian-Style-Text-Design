import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, formatPrice } from '../../data/products';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [hovered, setHovered] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const isWishlisted = wishlist.includes(product.id);
  const displayPrice = product.isFlashSale && product.flashSalePrice
    ? product.flashSalePrice
    : product.price;

  const handleAddToCart = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors[0], 1);
    setShowSizes(false);
    setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowSizes(false); }}
    >
      <Link to={`/shop/${product.id}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-[#F5F5F3] aspect-[3/4]">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          {product.images[1] && hovered && (
            <ImageWithFallback
              src={product.images[1]}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-100"
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="bg-black text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase">Mới</span>
            )}
            {product.isBestseller && (
              <span className="bg-white text-black text-[9px] tracking-[0.2em] px-2 py-1 uppercase border border-black/10">Bán chạy</span>
            )}
            {product.isFlashSale && (
              <span className="bg-red-600 text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase flex items-center gap-1">
                <Zap size={8} className="fill-white" /> Sale
              </span>
            )}
            {product.stock <= 5 && (
              <span className="bg-zinc-800 text-white text-[9px] tracking-[0.2em] px-2 py-1 uppercase">Sắp hết hàng</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
              hovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            <Heart
              size={16}
              className={`transition-all duration-300 ${isWishlisted ? 'fill-black stroke-black' : 'stroke-black fill-none'}`}
            />
          </button>

          {/* Quick Add */}
          <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${hovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
            {!showSizes ? (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(true); }}
                className="w-full bg-black text-white text-[10px] tracking-[0.25em] uppercase py-3 hover:bg-zinc-800 transition-colors"
              >
                Thêm nhanh
              </button>
            ) : (
              <div className="bg-white border-t border-black/10 p-3 flex flex-wrap gap-1.5 justify-center">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={(e) => handleAddToCart(size, e)}
                    className="px-3 py-1.5 border border-black/20 text-[10px] tracking-wider hover:bg-black hover:text-white transition-all duration-200"
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs tracking-[0.15em] text-black/40 uppercase mb-1">{product.category}</p>
              <h3 className="font-['Cormorant_Garamond'] text-lg tracking-wide text-black leading-tight">{product.name}</h3>
            </div>
            <div className="text-right shrink-0">
              {product.isFlashSale && product.flashSalePrice ? (
                <>
                  <p className="text-red-600 text-sm tracking-wide">{formatPrice(product.flashSalePrice)}</p>
                  <p className="text-black/30 text-xs line-through">{formatPrice(product.price)}</p>
                </>
              ) : product.originalPrice ? (
                <>
                  <p className="text-sm tracking-wide">{formatPrice(product.price)}</p>
                  <p className="text-black/30 text-xs line-through">{formatPrice(product.originalPrice)}</p>
                </>
              ) : (
                <p className="text-sm tracking-wide">{formatPrice(product.price)}</p>
              )}
            </div>
          </div>

          {/* Color dots */}
          <div className="flex gap-1.5 mt-2">
            {product.colors.map(color => (
              <div
                key={color}
                title={color}
                className="w-3 h-3 rounded-full border border-black/20"
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
                    color === 'Deep Navy' ? '#0a1628' :
                    color === 'Dark Brown' ? '#3d1c02' :
                    '#888'
                }}
              />
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
