import mongoose from "../utils/db_connection";
const Schema = mongoose.Schema;

const Listado_precio = new Schema({
  modelo: String,
  formato: String,
  dimension: String, // 45 x 30 cm., 60 x 40 cm.
  precio: Number, // $595, $695
  marco: {
    modelo: String,
    color: String,
    precio: Number, // $595, $695
  },
});
module.exports = mongoose.model("Listado_precio", Listado_precio);
