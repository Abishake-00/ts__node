import { Router } from "express";
import express from "express";
import {getshopController} from "@modules/shop/controller/shop.controller"

const shopRouter = express.Router();

shopRouter.get("/getshops", getshopController);

export default shopRouter;