import winston from "winston";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const path = process.env.LOG_PATH || "";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "dev";
  const isDevelopment = env === "dev";
  return isDevelopment ? "debug" : "http";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}] ${info.message}`
  )
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: path + "/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: path + "/all.log" }),
];

const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default Logger;
