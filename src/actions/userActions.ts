"use server";

import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { joinDate: "desc" },
    });
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Lỗi tải người dùng" };
  }
}

export async function updateUserRole(id: string, role: string) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function updateUserPoints(id: string, points: number) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { points },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error updating user points:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function updateUserCart(id: string, cart: string) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { cart },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error updating user cart:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function updateUserWishlist(id: string, wishlist: string) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { wishlist },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error updating user wishlist:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function toggleUserBlock(id: string, isBlocked: boolean) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked },
    });
    return { success: true, user };
  } catch (error: any) {
    console.error("Error toggling user block:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}
