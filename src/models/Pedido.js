import mongoose from "../utils/db_connection";
const Schema = mongoose.Schema;

const Pedido = new Schema({
  marca: {
    type: String,
    enum: [
      'Pixelarte',
      'Canvas Revolution',
      'Cuadrology'
    ],
    required: true
  },
  fecha: {
    type: String,
    required: true,
  },
  productos: [{
    type: Schema.Types.ObjectId,
    ref: "Producto",
  }],
  productos_cuadrology: {
    isGift: Boolean,
    tiles_quantity: Number,
    tiles_color: {
      type: String,
      enum: ["Red", "Black", "White"]
    },
    tiles_images: [String]
  },
  detalles_facturacion: {
    nombre_facturacion: String,
    rfc: String,
    forma_pago: String,
    metodo_pago: String,
    direccion_facturacion: String,
    uso_cfdi: Boolean,
  },
  envio: {
    compania: String,
    codigo_seguimiento: String,
    direccion: {
      calle: String,
      numero: Number,
      municipio: String,
      colonia: String,
      estado: String,
      pais: String,
      cp: String,
    },
  },
  costos: {
    impuestos: Number,
    total: Number,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Client",
  },
  canal_venta: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: "No preparado",
    enum: [
      "No preparado",
      "espera",
      "diseno",
      "impresion",
      "ensamble",
      "empaque",
      "por_entregar",
      "entregado",
      "finalizado",
    ],
  },
  devoluciones: {
    //Crear coleccion y ligarlo con pedido, enum de razones
    razon: String,
    status: {
      enum: [
        "espera",
        "diseno",
        "impresion",
        "ensamble",
        "empaque",
        "por_entregar",
        "entregado",
        "finalizado",
      ],
    },
  },
  vendedor: {
    type: String,
  },
  notas: {
    type: String,
  },
});
module.exports = mongoose.model("Pedido", Pedido);
