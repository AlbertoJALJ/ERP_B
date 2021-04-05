import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema

const Role = new Schema({
    name: {
        type: String,
        required: true,
        enum: ['Admin', 'User', 'Production', 'Client', 'Sales']
    },
    description: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('Role', Role)