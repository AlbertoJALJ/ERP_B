import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import swaggerOptions from '../swagger.json'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import indexRouter from './routes/index'
import usersRouter from './routes/users'
import cuadrologyRouter from './routes/cuadrology'
import testsRouter from './routes/tests'
import stripe from './routes/stripe'
import clientsRouter from './routes/clients'
import './utils/auth'

const app = express()
const port = process.env.port || 3000
app.set('port', port)

//Middlewares

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerOptions, { explorer: true })
);

app.use(cors())
app.use(morgan('dev'))
app.use('/public', express.static('../public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/', indexRouter)
app.use('/clients', clientsRouter)
app.use('/users', usersRouter)
app.use('/test', testsRouter)
app.use('/stripe', stripe)
app.use('/cuadrology', cuadrologyRouter)

app.listen(app.get('port'), () => {
    console.log(`Server Lintening on http://localhost:${app.get('port')}`)
})

module.exports = app