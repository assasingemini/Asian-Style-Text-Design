"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "./authActions";
import { startOfMonth, subMonths, endOfMonth, format } from "date-fns";

export async function getDashboardStats() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return { success: false, error: "Permission denied" };
    }

    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // 1. Overall Stats
    const [
      totalRevenueData,
      currentMonthOrders,
      lastMonthOrders,
      currentMonthUsers,
      lastMonthUsers,
      activeProductsCount,
    ] = await Promise.all([
      // Total Revenue (excluding cancelled)
      prisma.order.aggregate({
        _sum: { total: true },
        where: { NOT: { status: "Đã hủy" } },
      }),
      // Orders count
      prisma.order.count({
        where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
      }),
      prisma.order.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      // Users count
      prisma.user.count({
        where: { createdAt: { gte: currentMonthStart, lte: currentMonthEnd } },
      }),
      prisma.user.count({
        where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
      }),
      // Active products
      prisma.product.count({
        where: { stock: { gt: 0 } },
      }),
    ]);

    const totalRevenue = totalRevenueData._sum.total || 0;

    // Calculate growth percentages
    const calculateGrowth = (current: number, last: number) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - last) / last) * 1000) / 10;
    };

    const ordersGrowth = calculateGrowth(currentMonthOrders, lastMonthOrders);
    const usersGrowth = calculateGrowth(currentMonthUsers, lastMonthUsers);

    // 2. Revenue Chart Data (last 6 months)
    const revenueMonths = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const monthName = `Th${format(monthDate, "M")}`;

      const monthlyRev = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: start, lte: end },
          NOT: { status: "Đã hủy" },
        },
      });

      const monthlyOrders = await prisma.order.count({
        where: {
          createdAt: { gte: start, lte: end },
        },
      });

      revenueMonths.push({
        month: monthName,
        revenue: monthlyRev._sum.total || 0,
        orders: monthlyOrders,
      });
    }

    // 3. Category Distribution (Revenue share)
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: { NOT: { status: "Đã hủy" } },
      },
      include: {
        product: { select: { category: true } },
      },
    });

    const categoryRevenue: Record<string, number> = {};
    let totalItemsRevenue = 0;

    orderItems.forEach((item) => {
      const cat = item.product.category;
      const rev = item.price * item.quantity;
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + rev;
      totalItemsRevenue += rev;
    });

    const colors = ["#0a0a0a", "#3d3d3d", "#6b6b6b", "#9a9a9a", "#c8c8c8"];
    const categoryData = Object.entries(categoryRevenue)
      .map(([name, revenue], index) => ({
        name,
        value: totalItemsRevenue > 0 ? Math.round((revenue / totalItemsRevenue) * 100) : 0,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    return {
      success: true,
      stats: {
        totalRevenue,
        ordersThisMonth: currentMonthOrders,
        ordersGrowth,
        newUsers: currentMonthUsers,
        usersGrowth,
        activeProducts: activeProductsCount,
      },
      revenueChart: revenueMonths,
      categoryChart: categoryData,
    };
  } catch (error: any) {
    console.error("Dashboard stats error:", error);
    return { success: false, error: error.message || "Failed to fetch stats" };
  }
}
