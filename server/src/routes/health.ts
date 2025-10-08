import {Router} from "express";
import {redis} from "../infra/redis";

const router = Router();

router.get("/health", (_req, res) => res.status(200).send("ok"));

router.get("/ready", async (_req, res) => {
    try {
        const pong = await redis.ping();
        if (pong !== "PONG") return res.status(503).json({ok: false});
        res.json({ok: true});
    } catch (e) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        res.status(503).json({ok: false, error: "redis unavailable " + e.message});
    }
});

export default router;