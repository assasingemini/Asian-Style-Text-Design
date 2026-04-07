"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts(options?: {
  category?: string;
  isFlashSale?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
}) {
  try {
    const whereClause: any = {};
    if (options?.category && options.category !== "all") {
      whereClause.category = options.category;
    }
    if (options?.isFlashSale) {
      whereClause.isFlashSale = true;
    }
    if (options?.isBestseller) {
      whereClause.isBestseller = true;
    }
    if (options?.isNew) {
      whereClause.isNew = true;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function getCategories() {
  try {
    const products = await prisma.product.findMany({
      select: { category: true },
    });
    const counts = products.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const total = products.length;
    const result = [
      { id: "all", name: "Tất cả", count: total },
      { id: "outerwear", name: "Áo khoác", count: counts["Áo khoác"] || 0 },
      { id: "tops", name: "Áo", count: counts["Áo"] || 0 },
      { id: "bottoms", name: "Quần & Váy", count: counts["Quần & Váy"] || 0 },
      { id: "dresses", name: "Đầm", count: counts["Đầm"] || 0 },
      { id: "accessories", name: "Phụ kiện", count: counts["Phụ kiện"] || 0 },
    ];
    return result;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}
