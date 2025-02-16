import { Router } from "express";
import { uploadImageToS3 } from "../controllers/uploadController";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), uploadImageToS3);

export default router;
