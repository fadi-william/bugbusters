import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient({
  // Enable Logging.
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

// Log queries
prisma.$on("query", (e) => {
  logger.debug("Query: " + e.query);
  logger.debug("Params: " + e.params);
  logger.debug("Duration: " + e.duration + "ms");
});

// Log errors
prisma.$on("error", (e) => {
  logger.error("Prisma Error:", e);
});

// Log info
prisma.$on("info", (e) => {
  logger.info("Prisma Info:", e);
});

// Log warnings
prisma.$on("warn", (e) => {
  logger.warn("Prisma Warning:", e);
});

export default prisma;
