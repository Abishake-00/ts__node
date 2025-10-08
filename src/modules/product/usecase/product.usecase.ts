import { ProductService } from "../service/product.service";

export const createProductUsecase = async (data: any) => {
  return await ProductService.create(data);
};

export const getAllProductsUsecase = async () => {
  return await ProductService.getAll();
};

export const getProductByIdUsecase = async (id: number) => {
  return await ProductService.getById(id);
};

export const updateProductUsecase = async (id: number, data: any) => {
  return await ProductService.update(id, data);
};

export const deleteProductUsecase = async (id: number) => {
  return await ProductService.Delete(id);
};
