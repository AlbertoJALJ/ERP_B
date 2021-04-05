import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Quotation = new Schema({
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Products'
    }],
    date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },

})
module.exports = mongoose.model('Quotation', Quotation)