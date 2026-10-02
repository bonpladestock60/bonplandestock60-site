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
