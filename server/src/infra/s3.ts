import {S3Client} from "@aws-sdk/client-s3";
import env from "../config/env";

export const s3Client =
    env.LIARA_ENDPOINT && env.LIARA_BUCKET_NAME
        ? new S3Client({
            region: env.LIARA_REGION,
            endpoint: env.LIARA_ENDPOINT,
            credentials: {accessKeyId: env.LIARA_ACCESS_KEY, secretAccessKey: env.LIARA_SECRET_KEY},
            forcePathStyle: true
        })
        : null;