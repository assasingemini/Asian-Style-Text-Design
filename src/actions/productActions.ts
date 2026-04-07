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

export async function createProduct(data: any) {
  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        details: data.details,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        isNew: data.isNew,
        isBestseller: data.isBestseller,
        stock: data.stock,
      },
    });
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Lỗi thêm sản phẩm" };
  }
}

export async function updateProduct(id: string, data: any) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        originalPrice: data.originalPrice,
        category: data.category,
        subcategory: data.subcategory,
        description: data.description,
        details: data.details,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        isNew: data.isNew,
        isBestseller: data.isBestseller,
        stock: data.stock,
      },
    });
    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Lỗi cập nhật sản phẩm" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}
