import mongoose from "../utils/db_connection";
const Schema = mongoose.Schema;

const Client = new Schema({
  nombres: {
    type: String,
    required: true,
  },
  apellido_paterno: {
    type: String,
    required: true,
  },
  apellido_materno: {
    type: String
  },
  telefono: {
    type: Number,
    unique: true
  },
  genero: {
    type: String,
    enum: ["M", "F"]
  },
  direcciones: [{
    tipo: String, //facturacion o de envio
    calle: String,
    numero: Number,
    municipio: String,
    colonia: String,
    estado: String,
    pais: String,
    cp: Number,
  }],
  detalles_facturacion: {
    company_name: String,
    rfc: String,
    uso_cfdi: String,
    metodo_pago: String,
    correo_electronico: String,
    telefono: Number,
  },
  edad: {
    type: Number
  },
  correo_electronico: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ["lead", "client"],
    default: "lead",
  },
  pedidos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Pedido",
    },
  ]
});
module.exports = mongoose.model("Client", Client);
