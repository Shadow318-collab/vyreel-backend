import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"] || "3000";
const port = Number(rawPort);

app.listen(port, () => {
  logger.info({ port }, "Server listening");
});
