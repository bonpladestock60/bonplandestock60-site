const U="https://jefwbrryqbjpttuljocj.supabase.co";
const K="sb_publishable_OLiKeTazrrbSFXev6lLyhg_9tOh9mZj";
const W="33625653123";

let produits=[];
let categorie="";
let panier=JSON.parse(localStorage.getItem("panier60")||"{}");

const euro=c=>(Number(c||0)/100).toFixed(2).replace(".",",")+" €";
const save=()=>localStorage.setItem("panier60",JSON.stringify(panier));

async function chargerProduitsSupabase(){
  const root=document.getElementById("catalogue-app");
  root.innerHTML="<p>Chargement...</p>";

  const r=await fetch(U+"/rest/v1/products?select=*&order=id.asc",{
    headers:{apikey:K,Authorization:"Bearer "+K}
  });

  produits=await r.json();

  const cats=[...new Set(produits.map(p=>p.category).filter(Boolean))];
  categorie=cats[0]||"";

  root.innerHTML=`
    <h2>Nos catégories</h2>
    <div class="cats" id="cats"></div>

    <div class="head">
      <h2 id="titre"></h2>
      <button class="cartTop" onclick="ouvrirPanier()">
        🛒 Panier
      </button>
    </div>

    <div class="grid" id="grid"></div>
  `;

  document.getElementById("cats").innerHTML=cats.map(c=>`
    <button class="cat" onclick="choisirCategorie('${c.replace(/'/g,"\\'")}')">
      ${c}
    </button>
  `).join("");

  choisirCategorie(categorie);
}

function choisirCategorie(c){
  categorie=c;
  document.getElementById("titre").textContent=c;

const liste=produits
  .filter(p=>p.category===c)
  .sort((a,b)=>
    String(a.name||"").localeCompare(String(b.name||""),"fr")
  );

  document.getElementById("grid").innerHTML=liste.map(p=>{
    const out=p.stock_status==="out_of_stock";

    return `
      <div class="card">
        <div class="pic">
          ${
            p.image_url
            ? `<img src="${p.image_url}">`
            : `<div class="placeholder">Photo à ajouter</div>`
          }
        </div>

        <div class="body">
          <h3>${p.name||""}</h3>
          <div class="details">${p.details||""}</div>

          <div class="price">${euro(p.price_cents)}</div>

          <div class="stock ${out?"out":"in"}">
            ${out?"ÉPUISÉ":"EN STOCK"}
          </div>

          <div class="qty">
            <button onclick="qte(this,-1)">−</button>
            <span>1</span>
            <button onclick="qte(this,1)">+</button>
          </div>

          <button
            class="add"
            ${out?"disabled":""}
            onclick="ajouter(${p.id},this)"
          >
            ${out?"Épuisé":"Ajouter au panier"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function qte(b,n){
  const s=b.parentElement.querySelector("span");
  s.textContent=Math.max(1,Number(s.textContent)+n);
}

function ajouter(id,b){
  const p=produits.find(x=>String(x.id)===String(id));
  const q=Number(b.parentElement.querySelector(".qty span").textContent);
  const k=String(id);

  if(!panier[k]){
    panier[k]={
      id:p.id,
      name:p.name,
      price_cents:p.price_cents,
      qty:0
    };
  }

  panier[k].qty+=q;
  save();
  ouvrirPanier();
}

function modifier(id,n){
  const k=String(id);
  panier[k].qty=Math.max(1,panier[k].qty+n);
  save();
  afficherPanier();
}

function supprimer(id){
  delete panier[String(id)];
  save();
  afficherPanier();
}

function ouvrirPanier(){
  let o=document.getElementById("panier");

  if(!o){
    o=document.createElement("div");
    o.id="panier";
    document.body.appendChild(o);
  }

  o.className="overlay open";
  afficherPanier();
}

function fermerPanier(){
  document.getElementById("panier")?.classList.remove("open");
}

function afficherPanier(){
  const o=document.getElementById("panier");
  const a=Object.values(panier);

  const total=a.reduce(
    (s,p)=>s+p.price_cents*p.qty,
    0
  );

  o.innerHTML=`
    <div class="drawer">

      <div class="cartHead">
        <h2>🛒 Mon panier</h2>
        <button onclick="fermerPanier()">×</button>
      </div>

      ${
        a.length
        ? a.map(p=>`
          <div class="ci">
            <strong>${p.name}</strong>

            <div class="cirow">
              <button onclick="modifier(${p.id},-1)">−</button>
              <span>${p.qty}</span>
              <button onclick="modifier(${p.id},1)">+</button>

              <button onclick="supprimer(${p.id})">
                Supprimer
              </button>

              <b>${euro(p.price_cents*p.qty)}</b>
            </div>
          </div>
        `).join("")
        : "<p>Panier vide</p>"
      }

      <div class="tot">
        Total
        <b>${euro(total)}</b>
      </div>

      <input id="nom" placeholder="Nom et prénom">
      <input id="tel" placeholder="Téléphone">

      <select id="mode">
        <option>Retrait</option>
        <option>Livraison</option>
        <option>Expédition</option>
      </select>

      <textarea
        id="adresse"
        placeholder="Adresse / instructions"
      ></textarea>

      <div class="note">
        0–10 km : minimum 30 € + 3 €<br>
        10–20 km : minimum 50 € + 5 €<br>
        +20 km : sur demande
      </div>

      <button
        class="wa"
        onclick="whatsapp()"
        ${a.length?"":"disabled"}
      >
        Envoyer ma commande sur WhatsApp
      </button>
      <button
  class="wa"
  style="margin-top:10px;background:#635bff;color:white"
  onclick="payerStripe(this)"
  ${a.length?"":"disabled"}
>
  Payer en ligne
</button>

    </div>
  `;
}

function whatsapp(){
  const a=Object.values(panier);
  if(!a.length)return;

  const total=a.reduce(
    (s,p)=>s+p.price_cents*p.qty,
    0
  );

  let msg="Bonjour Bonplandestock60,\n\n";

  msg+="Je souhaite commander :\n\n";

  msg+=a.map(
    p=>p.qty+" × "+p.name+" — "+euro(p.price_cents*p.qty)
  ).join("\n");

  msg+="\n\nTotal : "+euro(total);
  msg+="\nNom : "+(document.getElementById("nom").value||"-");
  msg+="\nTéléphone : "+(document.getElementById("tel").value||"-");
  msg+="\nMode : "+document.getElementById("mode").value;
  msg+="\nAdresse : "+(document.getElementById("adresse").value||"-");

  location.href=
    "https://wa.me/"+W+"?text="+encodeURIComponent(msg);
}
async function payerStripe(btn){
  const a=Object.values(panier);
  if(!a.length)return;

  const nom=document.getElementById("nom").value.trim();
  const tel=document.getElementById("tel").value.trim();
  const mode=document.getElementById("mode").value;
  const adresse=document.getElementById("adresse").value.trim();

  if(!nom||!tel){
    alert("Nom et téléphone obligatoires.");
    return;
  }

  btn.disabled=true;
  btn.textContent="Ouverture du paiement...";

  try{
    const r=await fetch("/.netlify/functions/create-checkout-session",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        items:a.map(p=>({id:p.id,quantity:p.qty})),
        customer:{nom,tel,mode,adresse}
      })
    });

    const data=await r.json();

    if(!r.ok) throw new Error(data.error||"Erreur paiement");

    location.href=data.url;
  }catch(e){
    alert(e.message||"Erreur paiement");
    btn.disabled=false;
    btn.textContent="Payer en ligne";
  }
}
document.addEventListener(
  "DOMContentLoaded",
  chargerProduitsSupabase
);
