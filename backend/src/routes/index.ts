import { Router } from "express";
import auth from "./auth";
import bank from "./bank-account";
import loan from "./loan-request";
import owned from "./owned-credentials";

const router = Router();

router.use("/auth", auth);
router.use("/bank-account", bank);
router.use("/loan-request", loan);
router.use("/owned-credentials", owned);

export default router;
