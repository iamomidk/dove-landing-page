import app from "./app";
import env from "./config/env";
import {logger} from "./config/logger";
import {redis} from "./infra/redis";

const server = app.listen(env.PORT, () => {
    logger.info({
        port: env.PORT,
        sendMode: env.OTP_SEND_MODE,
        ttl: env.OTP_TTL_SECONDS,
        nodeEnv: env.NODE_ENV
    }, "✅ OTP API listening");
});

function shutdown(signal: string) {
    logger.warn({signal}, "🛑 Shutting down...");
    server.close(async () => {
        try {
            await redis.quit();
        } catch (e) {
            logger.warn({err: e}, "Redis quit failed");
        }
        logger.info("👋 Bye.");
        process.exit(0);
    });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason: any) => {
    logger.error({err: reason}, "Unhandled promise rejection");
});
process.on("uncaughtException", (err) => {
    logger.error({err}, "Uncaught exception");
    if (env.NODE_ENV === "production") process.exit(1);
});