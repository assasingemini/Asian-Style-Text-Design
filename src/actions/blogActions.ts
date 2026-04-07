"use server";

import { prisma } from "@/lib/prisma";

export async function getBlogPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
    return posts;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function createBlogPost(data: any) {
  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/ /g, '-'),
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        author: data.author,
        readTime: data.readTime,
        tags: data.tags,
      },
    });
    return { success: true, post };
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function updateBlogPost(id: string, data: any) {
  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image,
        category: data.category,
        author: data.author,
        readTime: data.readTime,
        tags: data.tags,
      },
    });
    return { success: true, post };
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await prisma.blogPost.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting blog post:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}
