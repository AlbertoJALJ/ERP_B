import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Address = new Schema({
    street: String,
    town: String, // municipio o delegación
    suburb: String, //colonia
    state: String,
    country: String,
    zip_code: Number,
    quotation_type: {
        type: String,
        enum: ['Envio', 'Facturacion']
    }

})
module.exports = mongoose.model('Address', Address)