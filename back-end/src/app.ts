import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import { requestLogger } from "./middlewares/logger/request-logger";
import { errorHandler } from "./middlewares/logger/error-handler-logger";
import { APP_PORT } from "./utils/env";
import eventRoutes from "./routes/event.routes";

const app = express();

// Add request logging middleware early in the middleware chain
app.use(requestLogger);

// Middlewares
app.use(cors());
app.use(express.static("public", { dotfiles: "ignore" }));
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/events", eventRoutes);

// Error handling middleware should be last
app.use(errorHandler);

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}`);
});

export default app;
