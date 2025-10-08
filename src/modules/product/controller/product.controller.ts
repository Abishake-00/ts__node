import { NextFunction, Request, Response } from "express";
import responses, { ResponseProps } from "@utils/responses";
import { getAllProductsUsecase,
         getProductByIdUsecase,
         updateProductUsecase,
         deleteProductUsecase,
         createProductUsecase
 } from "../usecase/product.usecase";

let response: ResponseProps;
export const handleGetAllProduct = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const shops = await getAllProductsUsecase();

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleCreateProduct = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const shops = await createProductUsecase(req.body);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleProductById = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await getProductByIdUsecase(id);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleUpdateProduct = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await updateProductUsecase(id, req.body);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleDeleteProduct = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await deleteProductUsecase(id);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};