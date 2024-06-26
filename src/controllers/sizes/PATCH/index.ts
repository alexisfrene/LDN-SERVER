import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../../../lib/sequelize";

const Size = db.Size;
const User = db.User;

export const addSizeValue = async (req: Request, res: Response) => {
  const size_id = req.params.id;
  const { value, user_id } = req.body;
  try {
    if (!user_id)
      return res
        .status(401)
        .json({ error: true, message: "Usuario no autorizado" });
    if (!size_id)
      return res
        .status(400)
        .json({ error: true, message: "No se proporciono un id de categoría" });

    const user = await User.findByPk(user_id);
    const userSizes = await user.getSizes();
    const validateExistSize = userSizes.find(
      (size: { size_id: string }) => size.size_id === size_id
    );
    if (!validateExistSize)
      return res
        .status(400)
        .json({ error: true, message: "La categoría no existe en el usuario" });
    const selectedSize = await Size.findByPk(size_id);
    const validateRepeatValue = selectedSize.values.find(
      (e: { value: string }) => e.value === value
    );
    if (validateRepeatValue)
      return res.status(400).json({
        error: true,
        message: `Èl valor ( ${value} , ya esta cargado )`,
      });
    const newValue = {
      id: uuidv4(),
      value,
    };
    const updateSize = await selectedSize.update({
      values: [...selectedSize.values, newValue],
    });

    return res.status(200).json(updateSize);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: "Error in addValue" });
  }
};

export const modifyTitleCollectionSize = async (
  req: Request,
  res: Response
) => {
  try {
    const size_id = req.params.id;
    const { user_id, title } = req.body;
    if (!user_id)
      return res
        .status(401)
        .json({ error: true, message: "Usuario no autorizado" });
    if (!size_id)
      return res.status(400).json({
        error: true,
        message: "No se proporciono un id del numero/talla",
      });
    const sizeSelected = await Size.findByPk(size_id);
    if (!sizeSelected)
      return res
        .status(400)
        .json({ error: true, message: "No se encontró la numero/talla" });
    const updateSize = await sizeSelected.update({
      title,
    });
    return res.status(200).json(updateSize);
  } catch (error) {
    return res.status(500).json({ error: true, message: error });
  }
};
