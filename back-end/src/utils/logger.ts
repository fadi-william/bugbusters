import winston from "winston";
import { APP_LOG_LEVEL } from "./env";

const logger = winston.createLogger({
  // Show the different log levels.
  level: APP_LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    // Write all logs to 'combined.log'
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
