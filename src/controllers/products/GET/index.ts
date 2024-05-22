import { Request, Response } from "express";
import db from "../../../lib/sequelize";
import { getSecureUrl } from "../../../lib";

const User = db.User;
const Product = db.Product;

export const getProducts = async (req: Request, res: Response) => {
  try {
    const user = await User.findByPk(req.body.user_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const allProducts = await user.getProducts();
    if (!allProducts.length)
      return res
        .status(400)
        .json({ error: "El usuario no tiene productos cargados" });
    const products = allProducts.filter(
      (producto: { state: boolean }) => producto.state === true
    );

    if (Array.isArray(products)) {
      const productDetails = await Promise.all(
        products.map(async (product) => {
          const productFromDB = await Product.findByPk(product.product_id);
          const category = await productFromDB.getCategory();
          const categoryValue = category
            ? category.values.find(
                (e: { id: string }) => e.id === productFromDB.category_value
              )
            : null;
          const size = await productFromDB.getSize();
          const sizeValue = size
            ? size.values.find(
                (e: { id: string }) => e.id === productFromDB.size_value
              )
            : null;

          const details = await productFromDB.getProduct_details();
          const urlCloudinary = getSecureUrl(
            product.primary_image,
            user.user_id
          );

          const {
            name,
            product_id,
            description,
            price,
            state,
            code,
            stock,
            discount,
          } = productFromDB;

          return {
            category: categoryValue.value,
            details,
            size: sizeValue.value,
            name,
            product_id,
            description,
            primary_image: urlCloudinary || "",
            price,
            state,
            code,
            stock,
            discount,
          };
        })
      );

      return res
        .status(200)
        .json(productDetails.sort((a, b) => a.code - b.code));
    }

    return res.status(400).json({ error: "No hay productos cargados" });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getImageProduct = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const query = req.query;
    if (!query.public_id)
      return res.status(400).json({ error: "Falta public_id" });
    if (typeof query.public_id !== "string")
      return res.status(400).json({ error: "public_id invalido" });
    const image_url = getSecureUrl(query.public_id, user_id);

    if (!image_url) {
      return res.status(400).json({ error: "Invalid image URL" });
    }

    return res.status(200).json(image_url);
  } catch (error) {
    console.error("Error in getImageProduct:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
