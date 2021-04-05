import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Provider = new Schema({//crear index en code
    createdAt: {
        type: String,
        required: true,
    },
})
module.exports = mongoose.model('Provider', Provider)