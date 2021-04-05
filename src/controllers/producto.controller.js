import Producto from "../models/Producto";
let producto = {};

producto.create_producto = async (req, res) => {
  const {
    marca,
    image,
    sku,
    titles,
    modelo,
    formato,
    dimension,
    precio,
    marco,
    description,
    stock,
  } = req.body;
  const producto = new Producto({
    marca,
    image,
    sku,
    titles,
    modelo,
    formato,
    dimension,
    precio,
    marco,
    description,
    stock,
  });
  producto.save((err, producto) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "No se pudo guardar el producto",
        },
      });
    res.json({
      code: 200,
      response: producto,
    });
  });
};
producto.update_producto = async (req,res) => {
  const productoId = req.params.productoId
}
producto.delete_producto = async (req,res) => {}
producto.read_producto = async (req,res) => {}
module.exports = producto;
