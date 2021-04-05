import express from "express";
const router = express.Router();
import { create, update, read, remove, all, newAddress } from "../controllers/client.controller";

router.post('/create', create)
router.post('/update/:id', update)
router.post('/update/address/add/:id', newAddress)
router.post('/remove/:id', remove)
router.get('/:id', read)
router.get('/', all)

module.exports = router;