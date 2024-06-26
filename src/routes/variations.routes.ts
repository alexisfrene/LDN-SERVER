import express, { Request, Response } from "express";
import {
  getAllVariations,
  insertVariants,
  createVariation,
  updateProduct,
  deleteVariationById,
  getVariationById,
  addImagesCollection,
  getVariationForCategory,
  removeImagesCollection,
} from "../controllers";
import { authenticateToken } from "../middleware";
import { upload } from "../lib/multer";

const router = express.Router();

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
    if (edit === "remove_image") return removeImagesCollection(req, res);
    return res.status(400).json({ msj: "nada que ver pa" });
  }
);
router.delete(
  "/variations/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    return deleteVariationById(req, res);
  }
);

export { router };
