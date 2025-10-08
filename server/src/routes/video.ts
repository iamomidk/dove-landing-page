import {Router} from "express";
import {videoQuerySchema} from "../utils/validators";
import {s3Client} from "../infra/s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {GetObjectCommand} from "@aws-sdk/client-s3";
import createHttpError from "http-errors";

const router = Router();

router.get("/api/video-url", async (req, res, next) => {
    const parse = videoQuerySchema.safeParse({key: req.query.key ?? "input.mp4"});
    if (!parse.success) return next(createHttpError(400, "bad key", {errors: parse.error.flatten()}));
    const key = parse.data.key;

    if (!s3Client) return next(createHttpError(500, "S3 not configured"));

    const cmd = new GetObjectCommand({Bucket: process.env.LIARA_BUCKET_NAME!, Key: key});
    try {
        const url = await getSignedUrl(s3Client, cmd, {expiresIn: 60});
        res.setHeader("Cache-Control", "private, max-age=30");
        res.json({url});
    } catch (err) {
        next(err);
    }
});

export default router;