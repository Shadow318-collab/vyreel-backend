import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";
import router from "./routes/index";
import { logger } from "./lib/logger";

const app = express();

app.use(pinoHttp({ logger }));
app.use(cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  })
);

app.use("/api/stripe/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Vyreel backend running on port ${PORT}`);
});

export default app;
