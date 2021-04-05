import mongoose from "../utils/db_connection";
const Schema = mongoose.Schema;

const Producto = new Schema({
  marca: {
    type: String,
    enum: [
      'Pixelarte',
      'Canvas Revolution',
      'Cuadrology'
    ],
    required: true
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: "Image",
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  titles: [
    {
      channel: String,
      name: String,
    },
  ],
  modelo: String,
  formato: String,
  dimension: String,
  precio: Number,
  marco: {
    modelo: String,
    color: String,
    precio: Number,
  },
  descripcion: {
    type: String,
  },
  stock: Number,
});
module.exports = mongoose.model("Producto", Producto);
