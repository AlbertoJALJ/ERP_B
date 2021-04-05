import express from 'express'
const router = express.Router()
import {
    newCuadro,
    newImage,
    newProducto,
    getProductos
} from '../controllers/test'

router.post('/cuadro/new', newCuadro)
router.post('/images/new', newImage)
router.post('/producto/new', newProducto)
router.get('/productos',getProductos)

module.exports = router