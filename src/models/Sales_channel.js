import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Sales_channel = new Schema({
    name: {
        type: String,
        required: true
    },

})
module.exports = mongoose.model('Sales_channel', Sales_channel)