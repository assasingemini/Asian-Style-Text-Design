'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';
import { blogPosts, blogCategories } from '../data/blog';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const filtered = selectedCategory === 'Tất cả'
    ? blogPosts
    : blogPosts.filter(p => p.category === selectedCategory);

  const [featured, ...rest] = filtered;

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <p className="text-xs tracking-[0.4em] uppercase text-black/40 mb-4">Tạp chí</p>
        <h1 className="font-['Cormorant_Garamond'] text-6xl md:text-8xl">Nhật ký Thời trang</h1>
      </section>

      {/* Category Filter */}
      <div className="border-y border-black/10 overflow-x-auto">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex gap-0">
          {blogCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-4 text-[10px] tracking-[0.25em] uppercase border-b-2 whitespace-nowrap transition-all ${
                selectedCategory === cat ? 'border-black text-black' : 'border-transparent text-black/40 hover:text-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
        {/* Featured Post */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Link href={`/blog/${featured.id}`} className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="overflow-hidden aspect-[4/3]">
                <ImageWithFallback
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-black text-white text-[9px] tracking-[0.2em] uppercase px-3 py-1">Nổi bật</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-black/40">{featured.category}</span>
                </div>
                <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl leading-tight mb-4 group-hover:opacity-60 transition-opacity">
                  {featured.title}
                </h2>
                <p className="text-black/50 text-sm leading-relaxed tracking-wide mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-5 mb-8 text-xs text-black/40 tracking-wide">
                  <span className="flex items-center gap-1.5"><User size={12} />{featured.author}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} />{featured.readTime} phút đọc</span>
                  <span>{featured.date}</span>
                </div>
                <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase group-hover:gap-4 transition-all duration-300">
                  Đọc bài viết <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Grid */}
        {rest.length > 0 && (
          <>
            <div className="h-px bg-black/10 mb-16" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
              {rest.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`} className="group block">
                    <div className="overflow-hidden aspect-[4/3] mb-5">
                      <ImageWithFallback
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-black/40">{post.category}</span>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl mt-2 mb-3 leading-tight group-hover:opacity-60 transition-opacity">
                      {post.title}
                    </h3>
                    <p className="text-black/50 text-sm leading-relaxed line-clamp-2 mb-5">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-black/30 tracking-wide">
                      <span>{post.author}</span>
                      <span>·</span>
                      <span>{post.readTime} phút đọc</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-['Cormorant_Garamond'] text-3xl text-black/20">Không có bài viết nào trong danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
}
