import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ProductService = {
  create: async (data: any) => {
    const createdProduct = await prisma.product.create({ data });
    return createdProduct;
  },

  getAll: async () => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { shop: true },
    });
    return products;
  },

  getById: async (id: number) => {
    const product = await prisma.product.findFirst({
      where: { id, isActive: true },
      include: { shop: true },
    });
    return product;
  },

  update: async (id: number, data: any) => {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    return updatedProduct;
  },

  Delete: async (id: number) => {
    const deletedProduct = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
    return deletedProduct;
  },
};
