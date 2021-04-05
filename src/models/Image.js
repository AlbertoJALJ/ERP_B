import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Image = new Schema({//crear index en code
    createdAt: {
        type: String,
        required: true,
    },
    nombre: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    proveedor: String,
    codigo: {
        type: String,
        required: true
    },
    /*productos: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],*/
    categoria: [{
        type: Schema.Types.ObjectId,
        ref: 'Categoria'
    }]
})
module.exports = mongoose.model('Image', Image)