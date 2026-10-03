const SUPABASE_URL = "https://jefwbrryqbjpttuljocj.supabase.co";
const SUPABASE_KEY = "sb_publishable_OLiKeTazrrbSFXev6lLyhg_9tOh9mZj";
const WHATSAPP_NUMBER = "33625653123";

const CATEGORY_ORDER = [
  "Lessive liquide",
  "Pods",
  "Entretien du linge",
  "Entretien vaisselle",
  "Produits ménager",
  "Déodorant",
  "Hygiène corporelle",
  "Dentifrice / Brosse à dents",
  "Papier maison",
  "Couches",
  "Bazar à 2 € max",
  "Brumes parfumées"
];

let produits = [];
let categorieActive = null;
let panier = JSON.parse(localStorage.getItem("bps60_cart") || "{}");

function euro(cents) {
  return (Number(cents || 0) / 100)
    .toFixed(2)
    .replace(".", ",") + " €";
}

function savePanier() {
  localStorage.setItem("bps60_cart", JSON.stringify(panier));
  updateBadge();
}

function updateBadge() {
  const badge = document.getElementById("cart-count");

  if (!badge) return;

  badge.textContent = Object.values(panier).reduce(
    (total, produit) => total + Number(produit.qty || 0),
    0
  );
}

function totalPanier() {
  return Object.values(panier).reduce(
    (total, produit) =>
      total +
      Number(produit.price_cents || 0) *
      Number(produit.qty || 0),
    0
  );
}

async function chargerProduitsSupabase() {
  const root = document.getElementById("catalogue-app");

  root.innerHTML = "<p>Chargement des produits...</p>";

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  produits = await response.json();

  const categoriesTrouvees = [
    ...new Set(
      produits
        .map(p => p.category)
        .filter(Boolean)
    )
  ];

  const categories = [
    ...CATEGORY_ORDER.filter(c =>
      categoriesTrouvees.includes(c)
    ),
    ...categoriesTrouvees.filter(c =>
      !CATEGORY_ORDER.includes(c)
    )
  ];

  categorieActive = categories[0] || null;

  root.innerHTML = `
    <section>
      <h2>Nos catégories</h2>

      <div class="cats">
        ${categories.map(c => `
          <button
            class="cat ${c === categorieActive ? "active" : ""}"
            data-category="${c}"
          >
            ${c}
          </button>
        `).join("")}
      </div>
    </section>

    <section>
      <div class="head">
        <h2 id="category-title">
          ${categorieActive || "Produits"}
        </h2>

        <button class="cartTop" onclick="ouvrirPanier()">
          🛒 Panier
          <span id="cart-count">0</span>
        </button>
      </div>

      <div id="products-grid" class="grid"></div>
    </section>
  `;

  document.querySelectorAll(".cat").forEach(button => {
    button.addEventListener("click", () => {
      categorieActive = button.dataset.category;

      document.querySelectorAll(".cat").forEach
