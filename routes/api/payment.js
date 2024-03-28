const stripe = require("stripe")(process.env.STRIPE_SECRET);
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Subscription = require("../../models/Subscription");

router.post("/checkout",auth, async (req, res) => {
  const {amt,name } = req.body;
  console.log(amt,name);
  try {
    const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data:{
              currency:"inr",
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
        success_url: 'http://localhost:5173',
        cancel_url: 'http://localhost:5173',
      });

    res.status(200).json({id:session.id});
  } catch (err) {
    res.status(500).json(err);
  }
});


router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    console.log('Payment completed:', session);
    

  }

  res.json({ received: true });
});


module.exports = router;
