import mongoose from "../utils/db_connection";
const Schema = mongoose.Schema;

const Product = new Schema({
  //stock de un producto y cantidad
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
  base_price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  shipping: {
    weight: Number,
    dimensions: {
      width: Number,
      height: Number,
    },
  },
  cuadro: {
    caracteristicas: {
      type: Schema.Types.ObjectId,
      ref: "Listado_precio",
    },
    imagen: {
      type: Schema.Types.ObjectId,
      ref: "Listado_precio",
    },
  },
  stock: Number,
});
module.exports = mongoose.model("Product", Product);
