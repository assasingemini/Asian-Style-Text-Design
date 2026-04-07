"use server";

import { prisma } from "@/lib/prisma";

export async function getSetting<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const setting = await prisma.systemSetting.findUnique({
      where: { key },
    });
    if (setting) {
      return JSON.parse(setting.value) as T;
    }
  } catch (error) {
    console.error(`Error fetching setting ${key}:`, error);
  }
  return defaultValue;
}

export async function saveSetting(key: string, value: any) {
  try {
    const stringValue = JSON.stringify(value);
    await prisma.systemSetting.upsert({
      where: { key },
      update: { value: stringValue },
      create: { key, value: stringValue },
    });
    return { success: true };
  } catch (error) {
    console.error(`Error saving setting ${key}:`, error);
    return { success: false, error: "Lỗi lưu cấu hình" };
  }
}
