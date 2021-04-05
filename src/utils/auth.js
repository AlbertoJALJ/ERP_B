import passport from 'passport'
import localStrategy from 'passport-local'
import Roles from '../models/Role'
import { Strategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import User from '../models/User'
import { Error } from 'mongoose'
const token = process.env.jwt_token;

passport.use(
  'signup',
  new localStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      const user = await User.findOne({ email })
      if (!user) {
        let usuario = new User({ email, password, role: req.body.role, name: req.body.name })
        await usuario.save()
        return done(null, usuario)
      } else {
        const error = new Error('Usuario existente')
        return done(error)
      }
    }
  )
);
passport.use('login', new localStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
  async (email, password, done) => {
    const user = await User.findOne({ email }).populate({ path: 'role', model: Roles });
    console.log(user)
    if (!user) done(null, false, { error: 'No existe el nombre de usuario' })
    const validate = await user.isValidPassword(password);
    if (!validate) done(null, false, { error: 'Contraseña incorrecta' })
    if (user && validate) {
      return done(null, user, { message: 'Inicio de sesión exitoso' })
    }
  }
)
);

passport.use(new Strategy({ secretOrKey: token, jwtFromRequest: ExtractJwt.fromHeader('secret_token') },
  async (token, done) => {
    try {
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
));

function isAdmin(req, res, next) {
  let usuario = req.user;
  if (usuario.role.name === 'Admin') {
    next()
  } else {
    res.status(401).json({
      error: { message: 'Unauthorized' }
    })
  }
}

function isUser(req, res, next) {
  let usuario = req.user;
  if (usuario.role.name === 'User') {
    next()
  } else {
    res.status(401).json({
      error: { message: 'Unauthorized' }
    })
  }
}
function isProduction(req, res, next) {
  let usuario = req.user;
  if (usuario.role.name === 'Production') {
    next()
  } else {
    res.status(401).json({
      error: { message: 'Unauthorized' }
    })
  }
}
function isClient(req, res, next) {
  let usuario = req.user;
  if (usuario.role.name === 'Client') {
    next()
  } else {
    res.status(401).json({
      error: { message: 'Unauthorized' }
    })
  }
}
function isSales(req, res, next) {
  let usuario = req.user;
  if (usuario.role.name === 'Sales') {
    next()
  } else {
    res.status(401).json({
      error: { message: 'Unauthorized' }
    })
  }
}
module.exports = { isAdmin, isUser, isProduction, isClient, isSales }