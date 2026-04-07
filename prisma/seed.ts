import { PrismaClient } from "@prisma/client";
import { products } from "../src/app/data/products";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Seed Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kumo.vn" },
    update: {},
    create: {
      name: "KUMO Admin",
      email: "admin@kumo.vn",
      password: adminPassword,
      role: "admin", 
      // Note: role field is missing in Prisma Schema User model? Wait. 
      // Let's modify schema dynamically or rely on email check for simplicity, 
      // since the original code relies on email === "admin@kumo.vn".
    },
  });
  console.log("Admin seeded:", admin.email);

  // Seed Products
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || null,
        category: p.category,
        subcategory: p.subcategory,
        description: p.description,
        details: p.details,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        isNew: p.isNew || false,
        isBestseller: p.isBestseller || false,
        isFlashSale: p.isFlashSale || false,
        flashSalePrice: p.flashSalePrice || null,
        tags: p.tags,
      },
      create: {
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice || null,
        category: p.category,
        subcategory: p.subcategory,
        description: p.description,
        details: p.details,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        isNew: p.isNew || false,
        isBestseller: p.isBestseller || false,
        isFlashSale: p.isFlashSale || false,
        flashSalePrice: p.flashSalePrice || null,
        tags: p.tags,
      },
    });
    console.log("Seeded Product:", product.name);
  }

  // Seed Blog Posts
  const { blogPosts } = await import("../src/app/data/blog");
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        author: post.author,
        readTime: post.readTime,
        tags: post.tags,
        createdAt: new Date(post.date),
      },
    });
    console.log("Seeded Blog Post:", post.title);
  }

  // Seed a test user 
  const testPassword = await bcrypt.hash("123456", 10);
  await prisma.user.upsert({
    where: { email: "customer@kumo.vn" },
    update: {},
    create: {
      name: "Nguyễn Văn Khách",
      email: "customer@kumo.vn",
      password: testPassword,
      role: "customer",
    },
  });
  console.log("Seeded test customer");

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
