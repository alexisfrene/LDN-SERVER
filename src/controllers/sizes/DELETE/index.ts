import { Request, Response } from "express";
import db from "../../../lib/sequelize";

const Size = db.Size;
const User = db.User;

export const deleteSizeCollection = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const size_id = req.params.id;
    if (!size_id)
      return res
        .status(400)
        .json({ error: true, message: "no se proporciono un size id" });
    if (!user_id)
      return res
        .status(401)
        .json({ error: true, message: "El usuario no esta autentificado" });
    const sizeSelected = await Size.findByPk(size_id);
    const userProducts = await User.findByPk(user_id)
      .then((user: { getProducts: () => any }) => user.getProducts())
      .then((products: any[]) =>
        products.filter(
          (product: { size_id: string; size_value: string }) =>
            product.size_id === size_id
        )
      );
    if (userProducts) {
      userProducts.forEach(async (product: any) => {
        await product.update({ size_value: null, size_id: null });
      });
    }
    const destroySize = await sizeSelected.destroy();

    return res.status(200).json({ message: destroySize });
  } catch (error) {
    console.log("Error in deleteSizeCollection ->", error);
    return res.status(500).json({ error: true, message: error });
  }
};

export const deleteSizeValue = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.body;
    const size_id = req.params.id;
    const size_value = req.query.value_id;
    if (!size_id)
      return res
        .status(400)
        .json({ error: true, message: "no se proporciono un size id" });
    if (!size_value)
      return res.status(400).json({
        error: true,
        message: "no se proporciono un size value id",
      });
    if (!user_id)
      return res
        .status(401)
        .json({ error: true, message: "El usuario no esta autentificado" });
    const sizeSelected = await Size.findByPk(size_id);
    const newValues = sizeSelected?.values.filter(
      (value: { id: string }) => value.id !== size_value
    );
    const userProducts = await User.findByPk(user_id)
      .then((user: { getProducts: () => any }) => user.getProducts())
      .then((products: any[]) =>
        products.filter(
          (product: { size_id: string; size_value: string }) =>
            product.size_id === size_id && product.size_value === size_value
        )
      );
    if (userProducts) {
      userProducts.forEach(async (product: any) => {
        await product.update({ size_value: null });
      });
    }

    const newValuesInSize = await sizeSelected.update({
      values: newValues,
    });
    return res.status(200).json({ message: newValuesInSize });
  } catch (error) {
    console.log("Error in deleteSizeValue ->", error);
    return res.status(500).json({ error: true, message: error });
  }
};
