import { ShopService } from "../service/shop.service";
import { PrismaClient, Shop, Prisma } from "@prisma/client";

// Create Shop
export const createShopUsecase = async (data: Prisma.ShopCreateInput) => {
  const shop = await ShopService.create(data);
  return shop;
};

// Get all active shops with products
export const getAllShopsUsecase = async () => {
  const shops = await ShopService.getAll();
  return shops;
};

// Get a single shop by ID
export const getShopByIdUsecase = async (id: number) => {
  const shop = await ShopService.getById(id);
  return shop;
};

// Update a shop by ID
export const updateShopUsecase = async (id: number, data: Partial<Shop>) => {
  const updatedShop = await ShopService.update(id, data);
  return updatedShop;
};

// Soft delete a shop (set isActive to false)
export const deleteShopUsecase = async (id: number) => {
  const deletedShop = await ShopService.Delete(id);
  return deletedShop;
};
