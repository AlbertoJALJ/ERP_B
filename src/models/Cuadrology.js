import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Cuadrology = new Schema({
    precio_unitario: {
        type: Number,
    },
    cantidad_minima_cuadros: {
        type: Number,
    },
    precio_cantidad_minima_cuadros: {
        type: Number
    }
})

module.exports = mongoose.model('Cuadrology', Cuadrology)