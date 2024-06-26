import { Request, Response } from "express";
import db from "../../../lib/sequelize";

const Product = db.Product;

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByPk(req.params.id);
    await product.update({ state: false });
    if (!product.state) {
      return res.status(200).json("Eliminación exitosa!");
    }

    return res.status(500).json("No se pudo eliminar");
  } catch (error) {
    console.log("Error al eliminar ", error);
    return res.status(500).json("Error in delete products");
  }
};
