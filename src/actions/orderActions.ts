"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./authActions";

export async function createOrder(data: {
  items: Array<{
    productId: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  customerName?: string;
}) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return { error: "Bạn chưa đăng nhập" };
    }

    const order = await prisma.order.create({
      data: {
        userId: session.id as string,
        total: data.total,
        status: "Đang xử lý",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    // Award points (example: 10 points for every 100k, handled dynamically from pointsConfig in real logic, but here we can add basic)
    // For now we just create the order
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order error:", error);
    return { error: "Lỗi trong quá trình tạo đơn hàng" };
  }
}

export async function getUserOrders() {
  const session = await getSession();
  if (!session?.id) return [];

  const orders = await prisma.order.findMany({
    where: { userId: session.id as string },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getAllOrders() {
  const session = await getSession();
  if (!session || session.role !== "admin") return { error: "Permission denied" };

  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
      user: {
        select: { name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, orders };
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return { success: true, order };
  } catch (error: any) {
    console.error("Error updating order:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}

export async function deleteOrder(id: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") return { success: false, error: "Permission denied" };

    await prisma.order.delete({ where: { id } });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting order:", error);
    return { success: false, error: "Lỗi nội bộ DB: " + (error.message || String(error)) };
  }
}
