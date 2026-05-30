import { Router } from "express";
const router = Router();
router.post("/stripe/create-checkout", async (_req, res) => {
  res.json({ message: "Stripe not configured yet" });
});
router.post("/stripe/webhook", async (_req, res) => {
  res.json({ received: true });
});
export default router;
