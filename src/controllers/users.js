let users = {}
import passport from 'passport'
import jwt from 'jsonwebtoken'
import User from '../models/User'
const jwt_token = process.env.jwt_token

users.create = async (req, res, next) => {
	res.json({
		message: 'Usuario creado correctamente',
		user: req.user
	});
}
users.login = async (req, res, next) => {
	console.log(req.body)
	passport.authenticate('login', async (err, user, info) => {

		if (info.error) {
			res.json({
				code: 401,
				error: { message: info.error }
			})
		} else if (user) {
			req.login(user, { session: false }, async (error) => {
				if (error) return next(error);
				const body = { _id: user._id, email: user.email, role: user.role };
				const token = jwt.sign({ user: body }, jwt_token);
				return res.json({ token });
			});
		} else res.json({
			code: 401,
			error: { message: err }
		})
	}
	)(req, res, next);
}
users.list = async (req, res) => {
	try {
		const users = await User.find({})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).send(error.message)
	}
}
users.update = async (req, res) => {
	const user_id = req.params.id
	const {
		email, name
	} = req.body
	try {
		const user = await User.findByIdAndUpdate(user_id, { email, name }, { returnOriginal: false });
		(user) ? res.json(user)
			: res.status(404).json({ message: "user not found" })
	} catch (error) {
		res.status(500).json({
			message: "Error del server"
		})
	}

}
users.update_password = async (req, res) => {
	const update_password = async (user, password) => {
		try {
			user.password = password
			await user.save()
			res.status(200).json({ message: "Contraseña actualizada correctamente", ok: true })
		} catch (error) {
			res.status(500).json({ message: "Problema en el servidor" })
		}
	}
	const user_id = req.params.id
	const { old_password, password } = req.body
	const user = await User.findById(user_id)
	const validate = await user.isValidPassword(old_password);
	(validate) ? update_password(user, password)
		: res.status(400).json({
			message: "Contraseña actual incorrecta"
		})
}

module.exports = users