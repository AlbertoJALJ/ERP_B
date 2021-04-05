import mongoose from '../utils/db_connection'
import bcrypt from 'bcrypt'
const Schema = mongoose.Schema

const User = new Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	role: {
		type: Schema.Types.ObjectId,
		ref: 'Role',
		required: true
	},
	name: {
		type: String,
	}
})

User.pre('save', async function (next) {
	const user = this;
	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
});
User.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);
	return compare;
}
module.exports = mongoose.model('User', User)