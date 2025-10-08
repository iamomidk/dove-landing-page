import express from "express";
import helmet from "helmet";
import compression from "compression";
import {requestLogger} from "./middleware/requestLogger";
import {corsMiddleware} from "./middleware/cors";
import {notFoundHandler, errorHandler} from "./middleware/errorHandler";
import healthRoutes from "./routes/health";
import videoRoutes from "./routes/video";
import otpRoutes from "./routes/otp";

const app = express();

app.set("trust proxy", true);
app.disable("x-powered-by");

// middleware
app.use(requestLogger);
app.use((req, res, next) => {
    // attach child logger convenience on res.locals
    // pino-http attaches req.log already; copy requestId to res header is done by requestLogger
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res.locals as any).requestId = (req as any).id;
    (res.locals as any).log = (req as any).log || {};
    next();
});
app.use(helmet());
app.use(compression());
app.use(express.json({limit: "10kb", type: ["application/json", "application/*+json"]}));
app.use(corsMiddleware);
app.options("*", corsMiddleware);
app.use((_, res, next) => {
    res.header("Vary", "Origin");
    next();
});

// routes
app.use(healthRoutes);
app.use(videoRoutes);
app.use(otpRoutes);

// 404 + error handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;