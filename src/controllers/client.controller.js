import Client from "../models/Cliente";
import Pedido from '../models/Pedido'
let client = {};

client.create = async (req, res) => {
  const {
    nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    genero,
    direcciones,
    detalles_facturacion,
    edad,
    correo_electronico,
    status,
  } = req.body;

  const client = new Client({
    nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    genero,
    direcciones,
    edad,
    correo_electronico,
    status,
    detalles_facturacion
  });
  try {
    await client.save((error, cliente) => {
      (error) ? res.status(400).json({
        error: "El cliente ya existe",
        key: error.keyValue
      }) : res.status(200).json({
        ok: true,
        data: cliente
      })
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
};
client.update = async (req, res) => {
  let cliente = await Client.findById(req.params.id)
  if (!cliente) res.status(400)
  const { nombres,
    apellido_paterno,
    apellido_materno,
    telefono,
    direcciones,
    detalles_facturacion,
    edad,
    correo_electronico } = req.body

  cliente = {
    nombres: nombres || cliente.nombres,
    apellido_paterno: apellido_paterno || cliente.apellido_paterno,
    apellido_materno: apellido_materno || cliente.apellido_materno,
    telefono: telefono || cliente.telefono,
    direcciones: direcciones || cliente.direcciones,
    detalles_facturacion: detalles_facturacion || cliente.detalles_facturacion,
    edad: edad || cliente.edad,
    correo_electronico: correo_electronico || cliente.correo_electronico,
  }
  try {
    await Client.findByIdAndUpdate(req.params.id, cliente, { returnOriginal: false }, (error, cliente) => {
      res.status(200).json({
        ok: true,
        data: cliente
      })
    })
  } catch (error) {
    res.status(500).json(error)
  }
};
client.read = async (req, res) => {
  const id = req.params.id;
  try {
    const cliente = await Client.findById(id)
    if (!cliente) res.status(404).json({
      error: "No existe ese cliente"
    })
    res.status(200).json({
      ok: true,
      data: cliente
    })
  } catch (error) {
    res.status(500).json(error.message)
  }

};
client.remove = async (req, res) => {
  const id = req.params.id
  try {
    await Client.findByIdAndRemove(id, (error, cliente) => {
      res.status(200).json({
        ok: true
      })
    })
  } catch (error) {
    res.send(500).json(error.message)
  }
};
client.all = async (req, res) => {
  const id = req.params.id;
  try {
    await Client.find((error, clientes) => {
      res.status(200).json({
        ok: true,
        data: clientes
      })
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
};
client.newAddress = async (req, res) => {
  const id = req.params.id
  const {
    calle, municipio, colonia, estado, pais, cp
  } = req.body
  try {
    let cliente = await Client.findById(id)
    if (!cliente) res.send(400);
    cliente.direcciones.push({
      calle, municipio, colonia, estado, pais, cp
    });
    await cliente.save((error, cliente) => {
      res.status(200).json({
        ok: true,
        data: cliente
      });
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
  // res.send(cliente.direcciones[cliente.direcciones.length - 1])
}

module.exports = client;
