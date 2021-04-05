import Product from "../models/Product";
import Project from "../models/Project";
import Image from "../models/Image";
import Listado_precio from "../models/Listado_precio";
import { image } from "faker";
let Variant;
let tests = {};

tests.generarProductos = async (req, res) => {
  const data = await CuadroCat.findOne({ "Modelo.nombre": "Canvas" });
  const formatos = ["rectangular", "Panoramico"];
  const nombre_modelo = data.nombre;
  let Productos = [];
  let cantidad_productos = 0;
  let cant_formatos = data.Modelo.Formatos.length;
  let cantidad_caracteristicas = 0;
  let cantidad_addons = 0;

  data.Modelo.Formatos.forEach((formato) => {
    formato.caracteristicas.forEach((caracteristicas) => {
      cantidad_caracteristicas += 1;
      caracteristicas.add_on.forEach((add_ons) => {
        cantidad_addons += 1;
      });
    });
  });
  cantidad_productos = cantidad_caracteristicas * cantidad_addons;
  console.log(cantidad_productos);
  res.send(data.Modelo.Formatos);
};
tests.newImage = async (req, res) => {
  const { createdAt, title, url, status, provider_name, code } = req.body;

  const imagen = new Image({
    createdAt,
    title,
    url,
    status,
    provider_name,
    code,
  });
  imagen.save((err, imagen) => {
    if (err) console.log(err);
    res.send(imagen);
  });
};
tests.newCuadro = async (req, res) => {
  const { modelo, formato, dimension, marco, precio } = req.body;
  const Cuadro = new Listado_precio({
    modelo,
    formato,
    dimension,
    marco,
    precio
  });
  await Cuadro.save((err, cuadro) => {
    if (err) res.send(err);
    res.send(cuadro);
  });
};
tests.newProducto = async (req, res) => {
  const {
    sku,
    titles,
    base_price,
    description,
    shipping,
    cuadro,
    stock,
  } = req.body;
  const producto = new Product({
    sku,
    titles,
    base_price,
    description,
    shipping,
    cuadro,
    stock,
  });
  await producto.save((err, producto) => {
    err ? res.send(err) : res.send(producto);
  });
};
tests.getProductos = async (req, res) => {
  await Product.find((err, products) => {
    err ? res.send(err) : res.send(products);
  })
    .populate({
      path: "cuadro.caracteristicas",
      model: Listado_precio,
    })
    .populate({
      path: "cuadro.imagen",
      model: Image,
    })
};
module.exports = tests;
