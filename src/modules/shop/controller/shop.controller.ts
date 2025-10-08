import { NextFunction, Request, Response, RequestHandler, MediaType } from "express";
import responses, { ResponseProps } from "@utils/responses";
import { getAllShopsUsecase,
         createShopUsecase,
         getShopByIdUsecase,
         updateShopUsecase,
         deleteShopUsecase
 } from "../usecase/shop.usecase";

let response: ResponseProps;
export const handleGetAllShop = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const shops = await getAllShopsUsecase();

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleCreateShop = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const shops = await createShopUsecase(req.body);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleShopById = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await getShopByIdUsecase(id);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleUpdateShop = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await updateShopUsecase(id, req.body);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};

export const handleDeleteShop = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const id = parseInt(req.params.id);
    const shops = await deleteShopUsecase(id);

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};