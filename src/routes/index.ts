import { Router } from "express";
// import { baseAuth } from "@middleware/auth";
import shopRouter from "@modules/shop/routes/shop.routes";

const routes = Router();

routes.use("/shop", shopRouter);

export {routes as HHH};