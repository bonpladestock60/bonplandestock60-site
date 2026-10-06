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

  const lignes = await stripe.checkout.sessions.listLineItems(
    session.id,
    { limit: 100 }
  );

  const produits = lignes.data
    .map((item) => {
      const prix = (item.amount_total / 100)
        .toFixed(2)
        .replace(".", ",");

      return `${item.quantity} × ${item.description} — ${prix} €`;
    })
    .join("\n");

  const total = ((session.amount_total || 0) / 100)
    .toFixed(2)
    .replace(".", ",");

  const m = session.metadata || {};

  const texte =
`Nouvelle commande payée ✅

${produits}

Total : ${total} €

Nom : ${m.client_nom || "-"}
Téléphone : ${m.client_tel || "-"}
Mode : ${m.mode || "-"}
Adresse : ${m.adresse || "-"}
Instructions : ${m.note || "-"}

Paiement Stripe confirmé.
Commande : ${session.id}`;

  const reponseMail = await fetch(
    "https://api.resend.com/emails",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Bonplandestock60 <onboarding@resend.dev>",
        to: ["Bonplandestock60@gmail.com"],
        subject: `Nouvelle commande payée — ${total} €`,
        text: texte
      })
    }
  );

  if (!reponseMail.ok) {
    const erreurMail = await reponseMail.text();
    console.error("Erreur Resend :", erreurMail);
  }

  console.log(
    "Paiement Bonplandestock60 confirmé :",
    session.id
  );
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
