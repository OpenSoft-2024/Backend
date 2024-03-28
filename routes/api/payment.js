const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

router.post("/checkout",auth, async (req, res) => {
  const {amt,name } = req.body;
  console.log(amt,name);
  try {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
              currency:"usd",
              product_data:{
                name:name
              },
              unit_amount:amt*100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        payment_method_types:["card"],
        success_url: 'http://localhost:5173/plans',
        cancel_url: 'http://localhost:5173/plans',
      });

    res.status(200).json({id:session.id});
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
