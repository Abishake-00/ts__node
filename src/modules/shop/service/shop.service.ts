import { PrismaClient, Shop, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const ShopService = {
  create: async (data: Prisma.ShopCreateInput) => {
    const createdShop = await prisma.shop.create({ data });
    return createdShop;
  },

  getAll: async () => {
    const activeShops = await prisma.shop.findMany({
      where: { isActive: true },
      include: { products: true },
    });
    return activeShops;
  },

  getById: async (id: number) => {
    const shop = await prisma.shop.findFirst({
      where: { id, isActive: true },
    });
    return shop;
  },

  update: async (id: number, data: Partial<Shop>) => {
    const updatedShop = await prisma.shop.update({
      where: { id },
      data,
    });
    return updatedShop;
  },

  Delete: async (id: number) => {
    const DeletedShop = await prisma.shop.update({
      where: { id },
      data: { isActive: false },
    });
    return DeletedShop;
  },
};
