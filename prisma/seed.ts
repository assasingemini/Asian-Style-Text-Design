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
