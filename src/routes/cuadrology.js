import express from "express";
import passport from "passport";
const router = express.Router();
import { isAdmin } from "../utils/auth";

import {
  check_pago,
  create_cupon,
  comprobar_cupon,
  delete_cupon,
  review_pedido,
  update_cupon,
  nuevo_pedido,
} from "../controllers/cuadrology.controller";

//rutas de cupones
router.post(
  "/cupon/create",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  create_cupon
);
router.get(
  "/cupon/comprobar/:cupon",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  comprobar_cupon
);
router.post(
  "/cupon/delete/:cupon",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  delete_cupon
);
router.post(
  "/cupon/update/:cupon_id",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  update_cupon
);
//rutas de pedidos
router.post(
  "/pedido/check",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  review_pedido
);
router.post(
  "/pedido/create",
  [passport.authenticate("jwt", { session: false }), isAdmin],
  nuevo_pedido
);

// router.post('/check', check_pago)
module.exports = router;
