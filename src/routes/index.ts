import { Router } from "express";
import authRoute from "./auth.route";
import categoryRouter from "./category.route";
import fileUploadRoute from "./file-upload.route";
import userRoute from "./user.route";

const router = Router();

router.use("/auth", authRoute);
router.use("/categories", categoryRouter);
router.use("/file", fileUploadRoute);
router.use("/users", userRoute);

export default router;
