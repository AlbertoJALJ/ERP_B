import express from "express";
const router = express.Router();
import Categoria from "../models/Categoria";
import Image from "../models/Image";
import Pedido from "../models/Pedido";
import Cliente from "../models/Cliente";
import { find } from "../controllers/image.controller";
import passport from 'passport'
import {
  create_pedido,
  update_pedido,
  delete_pedido,
  read_pedido,
  all_pedidos,
  create_pedido_enmarcate
} from "../controllers/pedido.controller";
import {
  create_producto,
  update_producto,
  delete_producto,
  read_producto,
} from "../controllers/producto.controller";

import { isAdmin } from '../utils/auth'


router.post("/categoria/new", async (req, res) => {
  const categoria = new Categoria({ ...req.body });
  await categoria.save();
  res.send(categoria);
});
router.post("/image/new", async (req, res) => {
  const imagen = new Image({ ...req.body });
  await imagen.save();
  res.send(imagen);
});
/*router.get("/pedidos", async (req, res) => {
  const pedidos = await Pedido.find()
    .populate({ path: "cliente", modelo: Cliente })
    .populate({ path: "productos.image", modelo: Image });
  res.send(pedidos);
});*/
router.post("/pedidos/edit/:id", async (req, res) => {
  const { direccion, notas } = req.body;
});
router.get("/images", find);

router.post("/pedido/create", create_pedido);
router.post("/pedido/update/:pedidoId", update_pedido);
router.post("/pedido/delete/:pedidoId", delete_pedido);
router.get("/pedido/:pedidoId", read_pedido);
router.get("/pedidos", all_pedidos)

router.post("/producto/create", create_producto);
router.post("/producto/update/:productoId", update_producto);
router.post("/producto/delete/:productoId", delete_producto);
router.get("/producto/:productoId", read_producto);


router.get('/lel', [passport.authenticate('jwt', { session: false }), isAdmin], (req, res) => {
  res.send({
    message: 'You made it to the secure route',
    user: req.user,
    token: req.headers['secret_token']
  })
})

module.exports = router;