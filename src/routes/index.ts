import { Router } from "express";
import authRoute from "./auth.route";
import categoryRouter from "./category.route";
import fileUploadRoute from "./file-upload.route";
import userRoute from "./user.route";
import companyRouter from "./company.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/categories", categoryRouter);
router.use("/file", fileUploadRoute);
router.use("/users", userRoute);
router.use("/companies", companyRouter);

export default router;
