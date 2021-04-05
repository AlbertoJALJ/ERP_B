import express from "express";
const router = express.Router();

import Stripe from 'stripe'
const stripe = new Stripe('sk_test_51HtyyOCeqd7JruHi38OyhZTcHNwMEbJu28JNYWsaC9hPZZDg30SYGR1z0MOT4c3emku0W1rqt79lweRithKz7IyW00o7wCJMPd')

router.post('/enmarcate/checkout', async (req, res) => {
    try {
        const payment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: req.body.currency,
            description: req.body.sale_description,
            payment_method: req.body.paymentMethod.id,
            metadata: {
                benafi_admin_order_id: "asdjlasldnal"
            },
            confirm: true
        })
        res.send(payment)
    } catch (error) {
        res.json(error)
    }
})
module.exports = router;


