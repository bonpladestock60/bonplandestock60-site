const Stripe = require("stripe");

const CATALOG = {
  "0": { name: "Skip Cycle Court Parfait", cents: 750 },
  "1": { name: "En Nabeel Lessive Prestige Orient", cents: 500 },
  "2": { name: "En Nabeel Lessive Prestige Ayra", cents: 500 },
  "3": { name: "Ariel 3in1 Pods Original", cents: 1000 },
  "4": { name: "Ariel Todo en 1 Pods — Frescor Floral", cents: 500 },
  "5": { name: "Skip Peaux Sensibles", cents: 800 },
  "6": { name: "Ariel Grandiose Pods", cents: 1000 },
  "7": { name: "Dash 2en1 Extra Fraîcheur", cents: 750 },
  "8": { name: "Génie Détachant", cents: 350 },
  "10": { name: "Soupline Tablettes — Passion", cents: 400 },
  "11": { name: "Soupline Tablettes — Hypoallergénique", cents: 400 },
  "12": { name: "Soupline Tablettes — Lavande", cents: 400 },
  "13": { name: "Soupline Concentré Envoûtant", cents: 500 },
  "14": { name: "Lilas Liquide vaisselle Citron", cents: 130 },
  "15": { name: "Lilas Liquide vaisselle Aloe Vera", cents: 130 },
  "16": { name: "Lilas Liquide vaisselle Agrumes", cents: 130 },
  "17": { name: "Cif Lava Tudo Marinho", cents: 220 },
  "18": { name: "Mr. Proper Spray Wipe Done — Midnight Blossom", cents: 300 },
  "19": { name: "Mr. Proper Spray Wipe Done — Winter Vibes", cents: 300 },
  "20": { name: "Carolin Lavant & Brillant", cents: 270 },
  "21": { name: "Cif Crème Cleanboost Citron", cents: 220 },
  "22": { name: "Cif Crème Cleanboost avec Javel", cents: 220 },
  "23": { name: "Axe Wild Spice", cents: 290 },
  "24": { name: "Cadum Lait de Douche Surgras", cents: 300 },
  "25": { name: "Head & Shoulders", cents: 400 },
  "26": { name: "Bébé Cadum Gel / Eau nettoyante", cents: 450 },
  "27": { name: "Urban Living Brosses à dents souples", cents: 100 },
  "28": { name: "Colgate Double Action Charcoal", cents: 150 },
  "29": { name: "Signal Cavity Fighter", cents: 150 },
  "30": { name: "Signal Whitening", cents: 150 },
  "31": { name: "Colgate Maximum Caries Protection", cents: 130 },
  "32": { name: "Amoos Super Absorbente", cents: 200 },
  "33": { name: "Amoos Aloe Vera", cents: 300 },
  "34": { name: "Pampers Active Baby Taille 6", cents: 1800 },
  "35": { name: "Maître Savon de Marseille — Savon Extra Pur", cents: 200 },
  "36": { name: "ALYA Reed Diffuser — Mango", cents: 300 },
  "37": { name: "ALYA Reed Diffuser — Pineapple & Coconut", cents: 300 },
  "38": { name: "ALYA Reed Diffuser — Ocean", cents: 300 },
  "39": { name: "ALYA Reed Diffuser — Green Forest", cents: 300 },
  "40": { name: "ALYA Reed Diffuser — Vanilla", cents: 300 },
  "41": { name: "Olivéa Huile cosmétique — Argan", cents: 250 },
  "42": { name: "Olivéa Huile cosmétique — Karité", cents: 250 },
  "43": { name: "Olivéa Huile cosmétique — Graines de Nigelle", cents: 250 },
  "44": { name: "Magic+ Lessive Liquide Couleur XXL", cents: 500 },
  "45": { name: "Magic+ Lessive Liquide Universel XXL", cents: 500 },
  "46": { name: "Skip Limpieza Profunda — Lot de 2 bidons", cents: 2000 },
  "47": { name: "Axe Marine", cents: 290 },
  "48": { name: "Axe Black Night", cents: 290 },
  "49": { name: "Lilas Liquide vaisselle Pomme", cents: 130 },
  "50": { name: "Bref Power Activ Gel Ocean", cents: 250 },
  "51": { name: "X-TRA Super Croix Japon", cents: 750 },
  "52": { name: "X-TRA Super Croix Îles Grenadines", cents: 750 },
  "53": { name: "X-TRA Super Croix Bora Bora", cents: 750 },
  "54": { name: "Lenor Universal Waschmittel Aprilfrisch", cents: 1500 },
  "56": { name: "Ariel Extra Color & Fiber Protection", cents: 700 },
  "58": { name: "Lingettes Nettoyantes Mamie Georgette Multi-Surfaces", cents: 280 },
  "59": { name: "Pampers Active Baby Taille 5", cents: 1000 },
  "60": { name: "Pampers Pants Taille 4", cents: 2500 },
  "61": { name: "Pampers Active Baby Taille 4", cents: 2000 },
  "62": { name: "Pampers Active Baby Taille 3 – 104 couches", cents: 2500 },
  "63": { name: "Pampers Active Baby Taille 3", cents: 1800 },
  "64": { name: "Pampers Active Baby Taille 2", cents: 1700 },
  "66": { name: "Skip Cycle Court Anti-Odeurs", cents: 750 },
  "100": { name: "Magic+ Lessive Liquide au Savon de Marseille", cents: 500 },
  "101": { name: "Lenor Universal Waschmittel Aprilfrisch", cents: 450 },
  "102": { name: "Lenor Color Waschmittel Amethyst Blütentraum", cents: 450 },
  "103": { name: "Lenor Sensitiv Waschmittel", cents: 450 },
  "104": { name: "Lenor In-Wash Scent Booster Dreamy Jasmine", cents: 500 },
  "105": { name: "Palmolive Bubble Bath Peach & Vanilla", cents: 300 },
  "106": { name: "Palmolive Bubble Bath Macadamia Oil", cents: 300 },
  "107": { name: "Palmolive Bubble Bath Ylang Ylang & Lavender", cents: 300 },
  "108": { name: "Palmolive Naturals Fig & Milk", cents: 300 },
  "109": { name: "Palmolive Naturals Milk & Honey", cents: 300 },
  "110": { name: "Febreze Air Mist Spring Awakening", cents: 300 },
  "111": { name: "Febreze Air Mist Sparkling Bloom", cents: 300 },
  "112": { name: "Febreze Air Mist Vanilla Butterscotch", cents: 300 },
  "113": { name: "Febreze Air Mist Blossom & Breeze", cents: 300 },
  "114": { name: "Febreze Air Mist Fresh Linen", cents: 300 },
  "115": { name: "Febreze Air Mist Gold Orchid", cents: 300 },
  "116": { name: "Nessrine Dubai Lingettes — Musc Noir", cents: 250 },
  "117": { name: "Nessrine Dubai Lingettes — Musc Blanc", cents: 250 },
  "118": { name: "Nessrine Dubai Lingettes — Oud Impérial", cents: 250 },
  "119": { name: "Nessrine Dubai Lingettes — Ambre Précieux", cents: 250 },
  "120": { name: "Glade Bougie Luscious Cherry & Peony", cents: 200 },
  "800": { name: "Skip Mon Cycle Court Parfait – Peaux Sensibles", cents: 700 },
  "801": { name: "Soupline Concentré Exaltant – Mandarine & Vanille", cents: 500 },
  "802": { name: "Lenor Wellbeing Collection – Confidence", cents: 500 },
  "803": { name: "Lenor In-Wash Scent Booster – Bluebells & Wild Berries", cents: 500 },
  "804": { name: "Lenor In-Wash Scent Booster – Summer Breeze", cents: 500 },
  "805": { name: "Ajax Fête des Fleurs – Coquelicots", cents: 250 },
  "806": { name: "Ajax Fête des Fleurs – Thé vert & citron", cents: 250 },
  "807": { name: "Ajax Fête des Fleurs – Muguet", cents: 250 },
  "808": { name: "Ajax Fête des Fleurs – Lavande", cents: 250 },
  "809": { name: "Le Petit Marseillais – Abricot Bio & Noisette Bio", cents: 350 },
  "810": { name: "Sacs poubelle parfum Citron", cents: 150 },
  "811": { name: "Sacs poubelle parfum Fraise", cents: 150 },
  "812": { name: "FIXTOP Ruban adhésif emballage", cents: 100 },
  "813": { name: "Vileda Tip Top – Éponges", cents: 100 },
  "814": { name: "Urban Living – Éponges à récurer x3", cents: 100 },
  "899": { name: "Ariel + Touch of Lenor Fresh Air", cents: 700 }
};

const clean = (value, max = 500) =>
  String(value ?? "").trim().slice(0, max);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Méthode non autorisée" }) };
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const payload = JSON.parse(event.body || "{}");
    const items = Array.isArray(payload.items) ? payload.items : [];
    const customer = payload.customer || {};

    if (!items.length) {
      return { statusCode: 400, body: JSON.stringify({ error: "Panier vide." }) };
    }

    const merged = new Map();

for (const item of items) {
  const id = clean(item.id, 40);
  const quantity = Number(item.quantity);

  if (!/^\d+$/.test(id)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Produit invalide." })
    };
  }

  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Quantité invalide." })
    };
  }

  merged.set(id, (merged.get(id) || 0) + quantity);
}

const ids = [...merged.keys()].join(",");

const rProduits = await fetch(
  "https://jefwbrryqbjpttuljocj.supabase.co/rest/v1/products?id=in.(" +
  ids +
  ")&select=id,name,price_cents,stock_status",
  {
    headers: {
      apikey: "sb_publishable_OLiKeTazrrbSFXev6lLyhg_9tOh9mZj",
      Authorization:
        "Bearer sb_publishable_OLiKeTazrrbSFXev6lLyhg_9tOh9mZj"
    }
  }
);

const produitsSupabase = await rProduits.json();

let subtotal = 0;
const line_items = [];

for (const [id, quantity] of merged.entries()) {
  const product = produitsSupabase.find(
    p => String(p.id) === String(id)
  );

  if (!product) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Produit introuvable." })
    };
  }

  subtotal += product.price_cents * quantity;

  line_items.push({
    price_data: {
      currency: "eur",
      product_data: { name: product.name },
      unit_amount: product.price_cents
    },
    quantity
  });
}

    const mode = clean(customer.mode, 60);
    const zone = clean(customer.zone, 30);
    let deliveryFee = 0;

    if (mode === "Livraison locale") {
      if (zone === "0-10") {
        if (subtotal < 3000) {
          return { statusCode: 400, body: JSON.stringify({ error: "Minimum 30 € pour une livraison jusqu’à 10 km." }) };
        }
        deliveryFee = 300;
      } else if (zone === "10-20") {
        if (subtotal < 5000) {
          return { statusCode: 400, body: JSON.stringify({ error: "Minimum 50 € pour une livraison de plus de 10 km à 20 km." }) };
        }
        deliveryFee = 500;
      } else {
        return { statusCode: 400, body: JSON.stringify({ error: "Zone de livraison à confirmer avant paiement." }) };
      }
    } else if (mode === "Expédition colis") {
      return { statusCode: 400, body: JSON.stringify({ error: "Les frais d’expédition doivent être confirmés avant paiement." }) };
    } else if (mode !== "Retrait") {
      return { statusCode: 400, body: JSON.stringify({ error: "Mode de livraison invalide." }) };
    }

    if (deliveryFee > 0) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: deliveryFee
        },
        quantity: 1
      });
    }

    const nom = clean(customer.nom, 120);
    const tel = clean(customer.tel, 50);
    const adresse = clean(customer.adresse, 300);
    const note = clean(customer.note, 300);

    if (!nom || !tel) {
      return { statusCode: 400, body: JSON.stringify({ error: "Nom et téléphone obligatoires." }) };
    }
    if (mode !== "Retrait" && !adresse) {
      return { statusCode: 400, body: JSON.stringify({ error: "Adresse obligatoire." }) };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "fr",
      line_items,
      metadata: {
        client_nom: nom,
        client_tel: tel,
        mode,
        zone,
        adresse,
        note
      },
      success_url: "https://fluffy-flan-b0edea.netlify.app/?paiement=succes&session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://fluffy-flan-b0edea.netlify.app/?paiement=annule"
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error("Erreur Stripe :", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Erreur Stripe. Réessayez ou contactez Bonplandestock60." })
    };
  }
};
