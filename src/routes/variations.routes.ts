import express, { Request, Response } from "express";
import path from "node:path";
import multer from "multer";
import { Uuid } from "../types";
import {
  getAllVariations,
  insertVariants,
  createVariation,
  addVariation,
  updateProduct,
  removeCollection,
  deleteVariationById,
  getVariationById,
  updateCollection,
  addImagesCollection,
  getVariationForCategory,
} from "../controllers";
import { authenticateToken } from "../middleware";

const router = express.Router();
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: (__, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, "temp/");
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  }),
});

router.get("/variations", authenticateToken, async (req, res) => {
  const { query } = req;
  if (query.category && query.value) {
    return getVariationForCategory(req, res);
  } else {
    return getAllVariations(req, res);
  }
});
router.get("/variations/:id", authenticateToken, getVariationById);
router.post(
  "/variations/:id",
  upload.array("files", 10),
  authenticateToken,
  async (req: Request, res: Response) => {
    const productId = req.query.product_id;
    const variationId = req.params.id;
    if (productId && variationId) {
      return insertVariants(req, res);
    } else {
      return res
        .status(400)
        .json({ error: true, message: "Faltan parámetros" });
    }
  }
);
router.post(
  "/variations",
  upload.array("files", 10),
  authenticateToken,
  createVariation
);
router.put(
  "/variations/:id",
  authenticateToken,
  upload.array("files", 10),
  async (req: Request, res: Response) => {
    const { variation_add, id_collection } = req.query;
    if (variation_add) {
      return addVariation(req, res);
    }
    if (id_collection) {
      return updateCollection(req, res);
    }
    return updateProduct(req, res);
  }
);
router.patch(
  "/variations/:id",
  upload.single("file"),
  authenticateToken,
  async (req: Request, res: Response) => {
    const { edit } = req.query;
    if (edit === "add_image") return addImagesCollection(req, res);
    return res.status(400).json({ msj: "nada que ver pa" });
  }
);
router.delete(
  "/variations/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const collectionId: Uuid = req.query.variation_remove as Uuid;
    if (collectionId) {
      return removeCollection(req, res);
    } else {
      return deleteVariationById(req, res);
    }
  }
);

export { router };
