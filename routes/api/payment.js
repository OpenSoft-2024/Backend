const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.post("/checkout", auth, async (req, res) => {
  const {amt } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: amt,
            quantity: 1,
          },
        ],
        mode: 'payment',
        payment_method_type:["card"],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });

    res.status(200).json({id:session.id});
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
