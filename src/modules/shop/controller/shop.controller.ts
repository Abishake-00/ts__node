import { NextFunction, Request, Response } from "express";
import responses, { ResponseProps } from "@utils/responses";
import { getshopusecase } from "../usecase/shop.usecase";

let response: ResponseProps;
export const getshopController = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
    const shops = await getshopusecase();

    response = responses.generate("success",{
        data: shops,
    });

    res.status(response?.statusCode).send(response);
    }catch (error: any){
        console.error(error);
        next(error);
    }

};