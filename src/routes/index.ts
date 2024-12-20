import { Router } from "express";
import authRoute from "./auth.route";
import categoryRouter from "./category.route";
import userRoute from "./user.route";
import companyRouter from "./company.route";
import menuRouter from "./menu.route";
import reviewRouter from "./review.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/categories", categoryRouter);
router.use("/users", userRoute);
router.use("/companies", companyRouter);
router.use("/menus", menuRouter);
router.use("/reviews", reviewRouter);

export default router;
