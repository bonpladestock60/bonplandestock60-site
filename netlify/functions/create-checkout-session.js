const Stripe = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Méthode non autorisée",
    };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Paiement test Bonplandestock60",
            },
            unit_amount: 100,
          },
          quantity: 1,
        },
      ],
      success_url: "https://fluffy-flan-b0edea.netlify.app/test-stripe.html?paiement=succes",
      cancel_url: "https://fluffy-flan-b0edea.netlify.app/test-stripe.html?paiement=annule",
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: session.url,
      }),
    };
  } catch (error) {
    console.error("Erreur Stripe :", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};
