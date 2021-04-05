import mongoose from '../utils/db_connection'
const Schema = mongoose.Schema;

const Return = new Schema({//crear index en code
    createdAt: {
        type: String,
        required: true,
    },
})
module.exports = mongoose.model('Return', Return)