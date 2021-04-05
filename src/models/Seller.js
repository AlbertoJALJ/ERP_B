import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Seller = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: [{
        name: String,
        number: Number
    }],
    email: {
        type: String,
    },
    status: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Seller', Seller)