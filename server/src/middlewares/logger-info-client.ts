import { NextFunction, Request, Response } from "express";
import Logger from "../log/logger";

export default function loggerInfoClient(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const clientIP = req.headers["x-real-ip"] || req.socket.remoteAddress;
  const requestInfo = `${req.method} ${req.originalUrl}`;
  Logger.info(`Client IP: ${clientIP}, Request: ${requestInfo}`);

  next();
}
