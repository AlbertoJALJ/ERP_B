import Pedido from "../models/Pedido";
import Cliente from "../models/Cliente";
import Producto from "../models/Producto";
import Image from "../models/Image";
import Categoria from "../models/Categoria";
import mongoose from "mongoose";
let pedido = {};

pedido.create_pedido = async (req, res) => {
  const client = await Cliente.findById(req.body.cliente, (err, client) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "Ocurrió un error con respecto al cliente",
        },
      });
    if (!client)
      res.json({
        code: 404,
        error: {
          message: "Cliente no encontrado",
        },
      });
  });
  const clienteDir = await Cliente.aggregate([
    { $unwind: "$direcciones" },
    {
      $match: {
        "direcciones._id": mongoose.Types.ObjectId(req.body.envio.direccion),
      },
    },
  ]);
  const {
    detalles_facturacion,
    productos,
    cliente,
    numero_venta,
    status,
    vendedor,
    notas,
    canal_venta,
    costos,
    fecha,
  } = req.body;
  const envio = {
    compania: req.body.envio.compania,
    codigo_seguimiento: req.body.envio.codigo_seguimiento,
    direccion: clienteDir[0].direcciones,
  };
  const pedido = new Pedido({
    detalles_facturacion,
    fecha,
    cliente,
    numero_venta,
    canal_venta,
    status,
    vendedor,
    notas,
    envio,
    productos,
    costos,
  });
  await pedido.save((err) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "No se pudo guardar el pedido",
        },
      });
  });
  client.pedidos.push(pedido);
  await client.save((err) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message:
            "Ocurrió un error al guardar al asignar el pedido al cliente",
        },
      });
  });
  res.json({
    code: 200,
    response: pedido,
  });
};
pedido.update_pedido = async (req, res) => {
  const pedidoId = req.params.pedidoId;
};
pedido.delete_pedido = async (req, res) => {
  const pedidoId = req.params.pedidoId;
  await Pedido.findByIdAndRemove(pedidoId, (err, pedido) => {
    if (err) {
      res.json({
        code: 200,
        response: "Pedido eliminado correctamente",
      });
    } else {
      res.json({
        code: 200,
        response: "Pedido eliminado correctamente",
      });
    }
  });
};
pedido.read_pedido = async (req, res) => {
  const pedidoId = req.params.pedidoId;
  await Pedido.findById(pedidoId, (err, pedido) => {
    console.log(pedido);
    if (err)
      res.json({
        code: 500,
        error: {
          message: "Ha ocurrido un error",
        },
      });
    if (!pedido) {
      res.json({
        code: 404,
        error: {
          message: "Pedido no encontrado",
        },
      });
    }
    if (pedido) {
      res.json({
        code: 200,
        response: pedido,
      });
    }
  });
};
pedido.all_pedidos = async (req, res) => {
  await Pedido.find((err, pedidos) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "Ha ocurrido un error",
        },
      });
    if (!pedidos) {
      res.json({
        code: 404,
        error: {
          message: "No hay pedidos en existencia",
        },
      });
    }
    if (pedidos) {
      res.json({
        code: 200,
        response: pedidos,
      });
    }
  })
    //.populate({ path: "productos", model: Producto })
    .populate({ path: "cliente", model: Cliente })
    .populate({
      path: "productos",
      populate: {
        path: "producto",
        model: Producto,
        populate: {
          path: "image",
          model: Image,
          populate: {
            path: "categoria",
            model: Categoria,
          },
        },
      },
    });
};
pedido.create_pedido_enmarcate = async (req, res) => {
  const {
    nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    correo_electronico,
    fecha,
    calle,
    numero,
    cp,
    colonia,
    municipio,
    estado,
    pais,
    costos,
    notas,
    productos,
  } = req.body;
  const cliente = new Cliente({
    nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    correo_electronico,
  });
  const clientID = await cliente.save((err) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "Ha ocurrido un error",
        },
      });
  });
  const pedido = new Pedido({
    fecha,
    envio: {
      calle,
      numero,
      cp,
      colonia,
      municipio,
      estado,
      pais,
    },
    costos,
    cliente: clientID,
    notas,
    productos,
  });
  await pedido.save((err, pedido) => {
    if (err)
      res.json({
        code: 500,
        error: {
          message: "No se pudo guardar el pedido",
        },
      });
    res.json({
      code: 200,
      response: pedido,
    });
  });
};
module.exports = pedido;
