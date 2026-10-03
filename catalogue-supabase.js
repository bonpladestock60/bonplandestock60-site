const SUPABASE_URL = "https://jefwbrryqbjpttuljocj.supabase.co";
const SUPABASE_KEY = "sb_publishable_OLiKeTazrrbSFXev6lLyhg_9tOh9mZj";

async function chargerProduitsSupabase() {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/products?select=*&order=id.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error("Impossible de charger les produits");
    }

    const produits = await response.json();

    let zone = document.getElementById("supabase-products");

    if (!zone) {
      zone = document.createElement("section");
      zone.id = "supabase-products";
      document.body.appendChild(zone);
    }

    zone.innerHTML = `
      <style>
        #supabase-products{
          max-width:1200px;
          margin:40px auto;
          padding:20px;
          color:white;
          font-family:Arial,sans-serif;
        }

        #supabase-products h2{
          color:#c9a227;
          font-size:32px;
          margin-bottom:25px;
        }

        .supabase-grid{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
          gap:18px;
        }

        .supabase-card{
          background:#151515;
          border:1px solid #333;
          border-radius:18px;
          padding:15px;
        }

        .supabase-card img{
          width:100%;
          height:220px;
          object-fit:contain;
          background:white;
          border-radius:12px;
        }

        .supabase-card h3{
          color:#c9a227;
          margin:12px 0 6px;
        }

        .supabase-price{
          font-size:24px;
          font-weight:bold;
          margin-top:10px;
        }

        .supabase-stock{
          color:#49c56b;
          font-weight:bold;
          margin-top:6px;
        }

        .supabase-out{
          color:#e25555;
          font-weight:bold;
          margin-top:6px;
        }
      </style>

      <h2>Produits</h2>

      <div class="supabase-grid">
        ${produits.map(p => `
          <div class="supabase-card">
            ${
              p.image_url
                ? `<img src="${p.image_url}" alt="${p.name || ""}">`
                : ""
            }

            <h3>${p.name || ""}</h3>

            <div>${p.category || ""}</div>
            <div>${p.details || ""}</div>

            <div class="supabase-price">
              ${((p.price_cents || 0) / 100).toFixed(2).replace(".", ",")} €
            </div>

            ${
              p.stock_status === "out_of_stock"
                ? `<div class="supabase-out">ÉPUISÉ</div>`
                : `<div class="supabase-stock">EN STOCK</div>`
            }
            <div style="
  display:flex;
  align-items:center;
  justify-content:center;
  gap:12px;
  margin-top:12px;
">
  <button
    type="button"
    onclick="this.nextElementSibling.textContent=Math.max(1,Number(this.nextElementSibling.textContent)-1)"
    style="width:42px;height:42px;border-radius:10px;border:1px solid #555;background:#222;color:white;font-size:24px;"
  >−</button>

  <span style="min-width:32px;text-align:center;font-size:20px;font-weight:bold;">1</span>

  <button
    type="button"
    onclick="this.previousElementSibling.textContent=Number(this.previousElementSibling.textContent)+1"
    style="width:42px;height:42px;border-radius:10px;border:1px solid #555;background:#222;color:white;font-size:24px;"
  >+</button>
  </div>
  <button
  class="add-cart"
  onclick="ajouterPanier(this)"
  style="
    width:100%;
    margin-top:12px;
    padding:12px;
    border:0;
    border-radius:10px;
    background:#c9a227;
    color:#000;
    font-weight:bold;
    font-size:16px;
  "
>
  Ajouter au panier
</button>
</div>
          </div>
        `).join("")}
      </div>
    `;

  } catch (error) {
    console.error("Erreur Supabase :", error);
  }
}

document.addEventListener(
  "DOMContentLoaded",
  chargerProduitsSupabase
);
let panier = [];

function ajouterPanier(button) {
  const card = button.closest(".supabase-card");
  const name = card.querySelector("h3").textContent.trim();

  const priceText = card
    .querySelector(".supabase-price")
    .textContent
    .replace("€", "")
    .replace(",", ".")
    .trim();

  const price = parseFloat(priceText);

  const qty = Number(
    card.querySelector("span").textContent
  );

  panier.push({
    name,
    price,
    qty
  });

  alert(
    qty + " × " + name + " ajouté au panier ✅"
  );
}
function ajouterPanier(button) {
  const card = button.closest(".supabase-card");
  const name = card.querySelector("h3").textContent.trim();

  const price = parseFloat(
    card.querySelector(".supabase-price")
      .textContent
      .replace("€", "")
      .replace(",", ".")
      .trim()
  );

  const qty = Number(card.querySelector("span").textContent);

  panier.push({ name, price, qty });

  afficherPanier();
}

function afficherPanier() {
  let box = document.getElementById("panier-visible");

  if (!box) {
    box = document.createElement("div");
    box.id = "panier-visible";
    document.body.appendChild(box);
  }

  const total = panier.reduce(
    (somme, produit) => somme + produit.price * produit.qty,
    0
  );

  box.innerHTML = `
    <div style="
      position:fixed;
      bottom:15px;
      left:15px;
      right:15px;
      z-index:9999;
      background:#111;
      color:white;
      border:2px solid #c9a227;
      border-radius:18px;
      padding:18px;
      max-height:55vh;
      overflow:auto;
      box-shadow:0 5px 30px #000;
    ">
      <div style="font-size:22px;font-weight:bold;color:#c9a227;margin-bottom:12px;">
        🛒 Mon panier
      </div>

      ${panier.map(p => `
        <div style="margin-bottom:8px;">
          ${p.qty} × ${p.name}
          <strong style="float:right;">
            ${(p.price * p.qty).toFixed(2).replace(".", ",")} €
          </strong>
        </div>
      `).join("")}

      <hr style="border-color:#444">

      <div style="font-size:21px;font-weight:bold;">
        Total :
        <span style="float:right;color:#c9a227;">
          ${total.toFixed(2).replace(".", ",")} €
        </span>
      </div>

      <button
        onclick="document.getElementById('panier-visible').remove()"
        style="
          width:100%;
          margin-top:15px;
          padding:12px;
          border:0;
          border-radius:10px;
          background:#333;
          color:white;
          font-weight:bold;
        "
      >
        Fermer
      </button>
    </div>
  `;
}
