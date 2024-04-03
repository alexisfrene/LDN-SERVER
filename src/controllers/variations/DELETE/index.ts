import { Request, Response } from "express";
import { supabase } from "../../../lib/supabase";
import { deleteEmptyFolders, removeImage } from "../../../utils";

interface CollectionType {
  id: string;
  name: string;
  images: string[];
}

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.id;
  try {
    const { data, error } = await supabase
      .from("ldn_image_manager")
      .select("*")
      .eq("id", productId);
    if (error) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    const productSelected = data[0];
    if (productSelected.variations && productSelected.variations.length > 0) {
      await Promise.all(
        productSelected.variations.map(
          async (variation: { images: string[] }) => {
            await Promise.all(
              variation.images.map(async (routeImage) => {
                await removeImage(routeImage);
              })
            );
            await deleteEmptyFolders(variation.images[0]);
            await deleteEmptyFolders(variation.images[0], 2);
          }
        )
      );
    }
    await removeImage(productSelected.miniature_image);
    await deleteEmptyFolders(productSelected.miniature_image);
    await deleteEmptyFolders(productSelected.miniature_image, 2);

    await supabase.from("ldn_image_manager").delete().eq("id", productId);

    return res
      .status(200)
      .json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el producto",
      error: error,
    });
  }
};

export const removeCollection = async (req: Request, res: Response) => {
  const collectionId = req.query.variation_remove;
  const variationsId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("ldn_image_manager")
      .select("*")
      .eq("id", variationsId);

    if (!error && data) {
      const filteredCollection = data[0]?.variations
        .map((collection: { id: string }) =>
          collection.id !== collectionId ? collection : null
        )
        .filter((collection: CollectionType) => collection !== null);

      const { error: updateError } = await supabase
        .from("ldn_image_manager")
        .update({ variations: filteredCollection || [] })
        .eq("id", variationsId)
        .single();

      if (!updateError) {
        await Promise.all(
          data[0]?.variations.map(async (variation: CollectionType) => {
            if (variation.id === collectionId) {
              await Promise.all(
                variation.images.map(async (routeImage) => {
                  await removeImage(routeImage);
                })
              );
              await deleteEmptyFolders(variation.images[0]);
              await deleteEmptyFolders(variation.images[0], 2);
            }
          })
        );
      }
      return res.send("Collection eliminada");
    }
  } catch (error) {
    console.log("Error al eliminar la collection", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  return res.status(500).json({ error: "Internal Server Error" });
};