import { Router } from "express";
import express from "express";
import { handleGetAllShop, handleCreateShop, handleShopById, handleDeleteShop } from "@modules/shop/controller/shop.controller"

const shopRouter = express.Router();

shopRouter.post("/createShop", handleCreateShop);
shopRouter.get("/getShops", handleGetAllShop);
shopRouter.get("/getShopById/:id", handleShopById);
shopRouter.get("/deleteShop", handleDeleteShop);

export default shopRouter;