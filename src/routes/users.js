import express from 'express'
import passport from 'passport'
const router = express.Router()
import { create, login, list, update, update_password } from '../controllers/users'
import { isAdmin } from '../utils/auth'

router.post('/signup', passport.authenticate('signup', { session: false }), create)
router.post('/login', login)
router.get('/', [passport.authenticate('jwt', { session: false }), isAdmin], list)
router.post('/update/:id', [passport.authenticate('jwt', { session: false }), isAdmin], update)
router.post('/update/password/:id', [passport.authenticate('jwt', { session: false }), isAdmin], update_password)


module.exports = router