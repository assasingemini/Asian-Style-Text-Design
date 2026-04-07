'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function BlogDetailPage() {
  const { blogPosts } = useApp();
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);
  const related = blogPosts.filter(p => p.id !== id).slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="font-['Cormorant_Garamond'] text-4xl text-black/20 mb-4">Không tìm thấy bài viết</p>
          <Link href="/blog" className="text-xs tracking-[0.2em] uppercase border border-black px-8 py-3 hover:bg-black hover:text-white transition-all">
            Quay lại Tạp chí
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <ImageWithFallback
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12"
        >
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-black/40 hover:text-black transition-colors mb-8">
            <ArrowLeft size={14} /> Tạp chí
          </Link>

          <span className="inline-block text-[9px] tracking-[0.3em] uppercase border border-black/20 px-3 py-1.5 mb-6 text-black/60">
            {post.category}
          </span>

          <h1 className="font-['Cormorant_Garamond'] text-4xl md:text-6xl leading-tight mb-8">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-black/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-black/10">
                <ImageWithFallback src={post.authorAvatar} alt={post.author} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs tracking-wide">{post.author}</p>
                <p className="text-[10px] text-black/40 tracking-wide">Tác giả</p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs text-black/40 tracking-wide">
              <span className="flex items-center gap-1.5"><Clock size={11} />{post.readTime} phút đọc</span>
              <span>{post.date}</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pb-16"
        >
          <p className="font-['Cormorant_Garamond'] text-xl md:text-2xl text-black/70 leading-relaxed mb-10 italic">
            {post.excerpt}
          </p>

          {post.content.split('\n\n').map((paragraph, i) => (
            <p key={i} className="text-black/70 leading-relaxed tracking-wide mb-7 text-[15px]">
              {paragraph}
            </p>
          ))}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-black/10 mt-10">
            <Tag size={14} className="text-black/30 mt-0.5" />
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] tracking-[0.2em] uppercase border border-black/15 px-3 py-1.5 text-black/50 hover:border-black hover:text-black transition-all cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Related Articles */}
      <div className="border-t border-black/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-['Cormorant_Garamond'] text-3xl">Xem thêm từ Tạp chí</h2>
            <Link href="/blog" className="hidden md:flex items-center gap-2 text-xs tracking-[0.2em] uppercase hover:gap-4 transition-all">
              Tất cả bài viết <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {related.map((relPost, i) => (
              <motion.div
                key={relPost.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={`/blog/${relPost.id}`} className="group block">
                  <div className="overflow-hidden aspect-[4/3] mb-4">
                    <ImageWithFallback
                      src={relPost.image}
                      alt={relPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <p className="text-[9px] tracking-[0.3em] uppercase text-black/40 mb-2">{relPost.category}</p>
                  <h3 className="font-['Cormorant_Garamond'] text-xl leading-snug group-hover:opacity-60 transition-opacity">
                    {relPost.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
