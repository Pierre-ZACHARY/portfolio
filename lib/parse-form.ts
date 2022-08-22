import type { NextApiRequest } from "next";
const mime = require('mime');
import { join } from "path";
import * as dateFn from "date-fns";
const formidable = require('formidable');
import { mkdir, stat } from "fs/promises";

export const FormidableError = formidable.errors.FormidableError;

export const parseForm = async (
    req: NextApiRequest
): Promise<{ fields: any; files: any }> => {
    return await new Promise(async (resolve, reject) => {
        const uploadDir = join(
            process.env.ROOT_DIR || process.cwd(),
            `public/uploads/${dateFn.format(Date.now(), "dd-MM-Y")}`
        );

        try {
            await stat(uploadDir);
        } catch (e: any) {
            if (e.code === "ENOENT") {
                await mkdir(uploadDir, { recursive: true });
            } else {
                console.error(e);
                reject(e);
                return;
            }
        }

        let filename = ""; //  To avoid duplicate upload
        const form = formidable({
            maxFiles: 2,
            maxFileSize: 1024 * 1024 * 10, // 10mb
            uploadDir,
            filename: (_name: any, _ext: any, part: any) => {
                if (filename !== "") {
                    return filename;
                }

                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                filename = `${part.name || "unknown"}-${uniqueSuffix}.${
                    mime.getExtension(part.mimetype || "") || "unknown"
                }`;
                return filename;
            },
            filter: (part: any) => {
                return (
                    part.name === "media" && (part.mimetype?.includes("image") || false)
                );
            },
        });

        form.parse(req, function (err: any, fields: any, files: any) {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};