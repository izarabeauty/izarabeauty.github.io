/* =========================================================================
   LogiPath — Comportements communs à toutes les pages
   ========================================================================= */

const NAV_LINKS = [
  { href: "index.html", label: "Accueil", key: "accueil" },
  { href: "decouvrir.html", label: "Découvrir", key: "decouvrir" },
  { href: "comprendre.html", label: "Comprendre", key: "comprendre" },
  { href: "metiers.html", label: "Métiers", key: "metiers" },
  { href: "maroc.html", label: "Maroc 🇲🇦", key: "maroc" },
  { href: "entreprises.html", label: "Entreprises", key: "entreprises" },
  { href: "postuler.html", label: "Postuler", key: "postuler" },
  { href: "competences.html", label: "Compétences", key: "competences" },
  { href: "ressources.html", label: "Ressources", key: "ressources" },
  { href: "parcours.html", label: "Mon parcours", key: "parcours" },
  { href: "simulateur.html", label: "Simulateur", key: "simulateur" }
];

const LOGO_SVG = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="40" height="40" rx="10" fill="#0EA394"/>
  <path d="M8 27 L8 15 L20 9 L32 15 L32 27 L20 33 Z" stroke="#fff" stroke-width="2.2" stroke-linejoin="round" fill="none"/>
  <path d="M8 15 L20 21 L32 15" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M20 21 L20 33" stroke="#fff" stroke-width="2.2"/>
</svg>`;

function buildHeader(activeKey){
  const links = NAV_LINKS.map(l => `<a href="${l.href}" class="${l.key===activeKey?'active':''}">${l.label}</a>`).join("");
  return `
  <div class="header-inner">
    <a href="index.html" class="brand">${LOGO_SVG}<span>LogiPath</span></a>
    <nav class="main-nav" id="mainNav">${links}</nav>
    <div class="header-actions">
      <div class="search-box">
        <input type="text" id="globalSearch" placeholder="Rechercher (ex: MRP, acheteur...)" autocomplete="off">
        <div class="search-results" id="searchResults"></div>
      </div>
      <button class="beginner-toggle" id="beginnerToggle" title="Simplifie le vocabulaire et affiche des définitions au survol">🟢 Mode débutant</button>
      <a href="logiai.html" class="btn btn-primary btn-sm">🤖 LogiAI</a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
    </div>
  </div>`;
}

function buildFooter(){
  return `
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="index.html" class="brand" style="color:#fff; margin-bottom:12px;">${LOGO_SVG}<span>LogiPath</span></a>
        <p style="max-width:320px; font-size:.9rem;">La porte d'entrée digitale vers la Logistique &amp; la Supply Chain au Maroc. Comprendre. Choisir. Postuler.</p>
      </div>
      <div>
        <h4>Explorer</h4>
        <a href="decouvrir.html">La logistique de zéro</a>
        <a href="metiers.html">Les métiers</a>
        <a href="maroc.html">Le Maroc 🇲🇦</a>
        <a href="entreprises.html">Entreprises</a>
      </div>
      <div>
        <h4>Construire sa carrière</h4>
        <a href="postuler.html">Comment postuler</a>
        <a href="competences.html">Compétences</a>
        <a href="parcours.html">Mon parcours</a>
        <a href="simulateur.html">Simulateur</a>
      </div>
      <div>
        <h4>À propos</h4>
        <a href="apropos.html">Le projet</a>
        <a href="ressources.html">Ressources &amp; sources</a>
        <a href="logiai.html">LogiAI</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 LogiPath — Projet éducatif et d'orientation. Les informations sont indicatives et vérifiées au mieux ; consultez toujours les sources officielles.</span>
      <span>🇫🇷 Français — 🇬🇧 English &amp; 🇲🇦 العربية bientôt disponibles</span>
    </div>
  </div>`;
}

function initHeaderFooter(activeKey){
  const h = document.getElementById("site-header");
  const f = document.getElementById("site-footer");
  if(h){ h.innerHTML = buildHeader(activeKey); }
  if(f){ f.innerHTML = buildFooter(); }

  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  if(navToggle){ navToggle.addEventListener("click", () => mainNav.classList.toggle("open")); }

  initBeginnerMode();
  initSearch();
}

/* ---------------- Mode débutant ---------------- */
function initBeginnerMode(){
  const btn = document.getElementById("beginnerToggle");
  if(!btn) return;
  const isOn = localStorage.getItem("logipath_beginner") === "1";
  if(isOn){ document.body.classList.add("beginner-mode"); btn.classList.add("active"); }
  btn.addEventListener("click", () => {
    const active = document.body.classList.toggle("beginner-mode");
    btn.classList.toggle("active", active);
    localStorage.setItem("logipath_beginner", active ? "1" : "0");
  });
}

/* Wrap known glossary terms found in a text into tooltip spans.
   Usage: term("MRP") -> <span class="term" data-def="...">MRP</span> */
function term(id){
  const g = (typeof GLOSSARY !== "undefined") ? GLOSSARY.find(x => x.id === id) : null;
  if(!g) return id;
  return `<span class="term" tabindex="0" data-def="${g.def.replace(/"/g,'&quot;')}">${g.term}</span>`;
}

/* ---------------- Recherche globale ---------------- */
function buildSearchIndex(){
  const idx = [];
  if(typeof GLOSSARY !== "undefined"){
    GLOSSARY.forEach(g => idx.push({ type:"Glossaire", title:g.term, href:`ressources.html?open=glossary-${g.id}`, text:g.def }));
  }
  if(typeof JOBS !== "undefined"){
    JOBS.forEach(j => idx.push({ type:"Métier", title:j.title, href:`metiers.html?open=${j.id}`, text:j.summary }));
  }
  if(typeof COMPANIES !== "undefined"){
    COMPANIES.forEach(c => idx.push({ type:"Entreprise", title:c.name, href:`entreprises.html?open=${c.id}`, text:c.activity }));
  }
  if(typeof CHAIN_STEPS !== "undefined"){
    CHAIN_STEPS.forEach(s => idx.push({ type:"Concept", title:s.title, href:`comprendre.html?open=${s.id}`, text:s.role }));
  }
  if(typeof SKILLS !== "undefined"){
    [...SKILLS.technical, ...SKILLS.management, ...SKILLS.languages].forEach(s => idx.push({ type:"Compétence", title:s.name, href:`competences.html?open=${s.id}`, text:s.why }));
  }
  return idx;
}

function initSearch(){
  const input = document.getElementById("globalSearch");
  const results = document.getElementById("searchResults");
  if(!input || !results) return;
  const index = buildSearchIndex();

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if(q.length < 2){ results.classList.remove("show"); results.innerHTML=""; return; }
    const matches = index.filter(item =>
      item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)
    ).slice(0, 8);
    if(matches.length === 0){
      results.innerHTML = `<div style="padding:14px; font-size:.85rem; color:#5B6B82;">Aucun résultat. Essayez <a href="logiai.html">de demander à LogiAI</a>.</div>`;
    } else {
      results.innerHTML = matches.map(m => `<a href="${m.href}"><span class="sr-type">${m.type}</span><br>${m.title}</a>`).join("");
    }
    results.classList.add("show");
  });

  document.addEventListener("click", (e) => {
    if(!input.contains(e.target) && !results.contains(e.target)) results.classList.remove("show");
  });
}

/* ---------------- Modale générique ---------------- */
function ensureModalRoot(){
  let root = document.getElementById("modalRoot");
  if(!root){
    root = document.createElement("div");
    root.id = "modalRoot";
    root.className = "modal-overlay";
    root.innerHTML = `<div class="modal" id="modalContent"></div>`;
    document.body.appendChild(root);
    root.addEventListener("click", (e) => { if(e.target === root) closeModal(); });
    document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeModal(); });
  }
  return root;
}
function openModal(html){
  const root = ensureModalRoot();
  document.getElementById("modalContent").innerHTML = `<button class="modal-close" onclick="closeModal()">✕</button>${html}`;
  root.classList.add("show");
}
function closeModal(){
  const root = document.getElementById("modalRoot");
  if(root) root.classList.remove("show");
}

/* ---------------- Accordéon générique ---------------- */
function initAccordions(scope){
  (scope || document).querySelectorAll(".accordion-head").forEach(head => {
    head.addEventListener("click", () => {
      head.parentElement.classList.toggle("open");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const key = document.body.getAttribute("data-page");
  initHeaderFooter(key);
});
