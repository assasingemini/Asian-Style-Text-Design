'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { categories } from '../data/products';
import { ProductCard } from '../components/product/ProductCard';
import { useApp } from '../context/AppContext';

type SortOption = 'newest' | 'bestseller' | 'price-asc' | 'price-desc';

const priceRanges = [
  { label: 'Tất cả mức giá', min: 0, max: Infinity },
  { label: 'Dưới 200k', min: 0, max: 200000 },
  { label: '200k – 350k', min: 200000, max: 350000 },
  { label: 'Trên 350k', min: 350000, max: Infinity },
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function ProductList() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { products } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      const selectedCatObj = categories.find(c => c.id === selectedCategory);
      if (selectedCatObj) {
        result = result.filter(p => p.category === selectedCatObj.name);
      }
    }

    const priceRange = priceRanges[selectedPriceRange];
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    if (selectedSizes.length > 0) {
      result = result.filter(p => selectedSizes.some(s => p.sizes.includes(s)));
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'bestseller': result.sort((a, b) => b.reviewCount - a.reviewCount); break;
      default: result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }

    return result;
  }, [selectedCategory, selectedPriceRange, selectedSizes, sortBy, searchQuery]);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Mới nhất',
    bestseller: 'Bán chạy nhất',
    'price-asc': 'Giá: Thấp đến Cao',
    'price-desc': 'Giá: Cao đến Thấp',
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedPriceRange(0);
    setSelectedSizes([]);
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPriceRange !== 0 || selectedSizes.length > 0;

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="border-b border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
          {searchQuery ? (
            <>
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">Kết quả Tìm kiếm</p>
              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">"{searchQuery}"</h1>
              <p className="text-black/40 text-sm mt-2">{filteredProducts.length} sản phẩm được tìm thấy</p>
            </>
          ) : (
            <>
              <p className="text-xs tracking-[0.3em] uppercase text-black/40 mb-2">Bộ sưu tập</p>
              <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl">Tất cả sản phẩm</h1>
            </>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="border-b border-black/10 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex gap-0">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[10px] tracking-[0.25em] uppercase px-6 py-5 border-b-2 transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'border-black text-black'
                  : 'border-transparent text-black/40 hover:text-black hover:border-black/20'
              }`}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Toolbar */}
        <div className="flex items-center justify-between py-5 border-b border-black/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:opacity-60 transition-opacity"
            >
              <SlidersHorizontal size={14} />
              Bộ lọc
              {hasActiveFilters && (
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-black/40 hover:text-black transition-colors"
              >
                <X size={12} /> Xóa tất cả
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <p className="text-xs text-black/40 tracking-wide hidden md:block">
              {filteredProducts.length} sản phẩm
            </p>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-xs tracking-[0.15em] border border-black/20 px-4 py-2 hover:border-black transition-colors"
              >
                {sortLabels[sortBy]}
                <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-1 bg-white border border-black/10 shadow-lg z-20 min-w-[200px]"
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        className={`w-full text-left px-5 py-3 text-xs tracking-wider hover:bg-black/5 transition-colors ${sortBy === opt ? 'text-black' : 'text-black/50'}`}
                      >
                        {sortLabels[opt]}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-b border-black/10"
            >
              <div className="py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Price */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-4 text-black/60">Khoảng giá</p>
                  <div className="flex flex-col gap-2">
                    {priceRanges.map((range, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPriceRange(i)}
                        className={`text-left text-sm tracking-wide py-1 border-l-2 pl-3 transition-all ${
                          selectedPriceRange === i ? 'border-black text-black' : 'border-transparent text-black/40 hover:border-black/30'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-4 text-black/60">Kích cỡ</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-10 h-10 text-xs tracking-wider border transition-all duration-200 ${
                          selectedSizes.includes(size)
                            ? 'bg-black text-white border-black'
                            : 'border-black/20 hover:border-black text-black/60'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-4 text-black/60">Bộ lọc đang chọn</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== 'all' && (
                        <span className="flex items-center gap-1.5 bg-black text-white text-[10px] tracking-wider px-3 py-1.5">
                          {categories.find(c => c.id === selectedCategory)?.name}
                          <button onClick={() => setSelectedCategory('all')}><X size={10} /></button>
                        </span>
                      )}
                      {selectedSizes.map(s => (
                        <span key={s} className="flex items-center gap-1.5 bg-black text-white text-[10px] tracking-wider px-3 py-1.5">
                          {s}
                          <button onClick={() => toggleSize(s)}><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-['Cormorant_Garamond'] text-4xl text-black/20 mb-4">Không tìm thấy sản phẩm</p>
            <p className="text-black/40 text-sm tracking-wide mb-8">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            <button onClick={clearFilters} className="text-xs tracking-[0.2em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all duration-300">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 py-10">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white pt-16 flex items-center justify-center font-['Cormorant_Garamond'] text-2xl text-black/50">Đang tải...</div>}>
      <ProductList />
    </Suspense>
  );
}
