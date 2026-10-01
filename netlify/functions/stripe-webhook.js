const Stripe = require("stripe");

exports.handler = async (event) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const signature = event.headers["stripe-signature"];

  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      console.log("Paiement Bonplandestock60 confirmé :", session.id);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error("Erreur webhook Stripe :", error.message);

    return {
      statusCode: 400,
      body: `Webhook Error: ${error.message}`,
    };
  }
};
