import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Project = new Schema({
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'Seller'
    },
    starting_date: {
        type: String,
        required: true
    },
    stage: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    expected_closing_date: {
        type: String,
    },
    quotations: [{
        type: Schema.Types.ObjectId,
        ref: 'Quotation'
    }],
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
    sales_channel: {
        type: String, 
        required: true
    }
})
module.exports = mongoose.model('Project', Project)