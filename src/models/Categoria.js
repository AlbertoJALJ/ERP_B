import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Categoria = new Schema({//crear index en code
    nombre: {
        type: String,
        unique: true
    },
    subcategoria: {
        type: String,
        unique: true
    }
})
module.exports = mongoose.model('Categoria', Categoria)