import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Order = new Schema({
    date: {
        type: String,
        required: true
    },
    products: [
        {//especificar campo de cantidad y descuento
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },
        {
            quantity: Number,
            discount: Number
        },
    ],
    invoice: { // especificar data
        type: Boolean
    },
    shipping: {
        company: String,
        tracking_code: String,
        address: String// desglozar
    },
    amounts: {
        taxes: Number,
        total: Number
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    origin: { //origen de la compra
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'No preparado',
        enum: ['espera', 'diseno', 'impresion', 'ensamble', 'empaque', 'por_entregar', 'entregado', 'finalizado']
    },
    devoluciones: {//Crear coleccion y ligarlo con pedido, enum de razones
        type: String,
        razon: String,
        status: {
            enum: ['espera', 'diseno', 'impresion', 'ensamble', 'empaque', 'por_entregar', 'entregado', 'finalizado']
        }
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    sales_channel: {
        type: String, 
        required: true
    }

})
module.exports = mongoose.model('Order', Order)