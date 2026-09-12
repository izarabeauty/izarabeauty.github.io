/* =========================================================================
   Mon Parcours — génère des recommandations indicatives à partir du profil
   ========================================================================= */

const EDUCATION_LEVELS = ["Bac", "Bac+2", "Bac+3 (Licence)", "Bac+5 (Master/Ingénieur)", "Autre / Reconversion"];
const SECTORS = ["Automobile", "Retail / Distribution", "Transport & logistique", "Industrie / Manufacturing", "Data / Digital", "Pas de préférence"];
const SOFTWARE_OPTIONS = ["Excel", "Power BI", "SAP / ERP", "SQL", "Python"];
const LANGUAGE_OPTIONS = ["Français", "Anglais", "Arabe"];

function renderProfileForm(){
  const form = document.getElementById("profileForm");
  form.innerHTML = `
    <div class="form-group">
      <label>Niveau d'études</label>
      <select id="f_education">${EDUCATION_LEVELS.map(e=>`<option>${e}</option>`).join("")}</select>
    </div>
    <div class="form-group">
      <label>As-tu déjà une expérience (stage, alternance, job) ?</label>
      <select id="f_experience"><option>Aucune expérience</option><option>1 stage</option><option>2 stages ou plus</option><option>Une première expérience professionnelle</option></select>
    </div>
    <div class="form-group">
      <label>Secteur souhaité</label>
      <select id="f_sector">${SECTORS.map(s=>`<option>${s}</option>`).join("")}</select>
    </div>
    <div class="form-group">
      <label>Logiciels que tu maîtrises</label>
      <div class="checkbox-grid">${SOFTWARE_OPTIONS.map(s=>`<label><input type="checkbox" value="${s}" class="f_software"> ${s}</label>`).join("")}</div>
    </div>
    <div class="form-group">
      <label>Langues maîtrisées</label>
      <div class="checkbox-grid">${LANGUAGE_OPTIONS.map(l=>`<label><input type="checkbox" value="${l}" class="f_lang" checked> ${l}</label>`).join("")}</div>
    </div>
    <div class="form-group">
      <label>Qu'est-ce qui t'attire le plus ?</label>
      <select id="f_appetence">
        <option value="analyse">Analyser des données et des chiffres</option>
        <option value="negociation">Négocier et échanger avec des fournisseurs</option>
        <option value="terrain">Organiser et gérer des opérations terrain</option>
        <option value="transport">Le transport et l'international</option>
        <option value="tech">La technologie et la digitalisation</option>
      </select>
    </div>
    <button type="submit" class="btn btn-primary btn-block">Générer mes recommandations</button>
  `;
  form.addEventListener("submit", (e) => { e.preventDefault(); generateRecommendations(); });
}

const APPETENCE_TO_CATEGORY = {
  analyse: "supply-chain", negociation: "achats", terrain: "logistique", transport: "transport", tech: "data"
};

function generateRecommendations(){
  const education = document.getElementById("f_education").value;
  const experience = document.getElementById("f_experience").value;
  const sector = document.getElementById("f_sector").value;
  const appetence = document.getElementById("f_appetence").value;
  const software = [...document.querySelectorAll(".f_software:checked")].map(x=>x.value);
  const languages = [...document.querySelectorAll(".f_lang:checked")].map(x=>x.value);

  const category = APPETENCE_TO_CATEGORY[appetence];
  const recommendedJobs = JOBS.filter(j => j.category === category).slice(0, 3);

  const strengths = [];
  if(software.length >= 2) strengths.push("Bonne base d'outils techniques (" + software.join(", ") + ")");
  if(languages.includes("Anglais")) strengths.push("Anglais maîtrisé — un vrai atout pour les groupes internationaux");
  if(experience !== "Aucune expérience") strengths.push("Une première expérience professionnelle déjà acquise");
  if(strengths.length === 0) strengths.push("Une motivation claire pour découvrir le secteur — c'est le meilleur point de départ");

  const gaps = [];
  if(!software.includes("Excel")) gaps.push("Excel — à maîtriser en priorité, c'est la base de tous les métiers Supply Chain");
  if(!software.includes("SAP / ERP")) gaps.push("Une première familiarisation avec un ERP (SAP)");
  if(!languages.includes("Anglais")) gaps.push("Anglais professionnel — quasi indispensable dans le secteur");
  if(experience === "Aucune expérience") gaps.push("Une première expérience terrain, même courte (stage d'observation, job d'été)");

  const prioritySkills = recommendedJobs.length ? [...new Set(recommendedJobs.flatMap(j => j.hardSkills))].slice(0,5) : [];

  const targetCompanies = recommendedJobs.length ? [...new Set(recommendedJobs.flatMap(j => j.companies))].slice(0,4) : [];
  const companyNames = targetCompanies.map(id => COMPANIES.find(c=>c.id===id)?.name).filter(Boolean);

  const plan3 = ["Lire les fiches métiers ciblées et suivre le mode débutant", "Commencer à pratiquer Excel/Power BI (projet personnel)", "Créer ou optimiser son profil LinkedIn"];
  const plan6 = ["Décrocher un premier stage d'observation ou stage court", "Réaliser un projet pratique lié à une compétence clé (voir page Compétences)", "Participer à un événement ou une association étudiante du secteur"];
  const plan12 = ["Viser un stage de fin d'études dans le métier ciblé", "Se préparer aux entretiens avec les études de cas du site", "Construire un premier réseau professionnel dans le secteur"];

  const html = `
    <div class="source-note">⚠️ Ces recommandations sont générées à partir de règles simples et de ton profil déclaré — elles sont <strong>indicatives</strong>, pas une vérité absolue sur "le meilleur métier pour toi".</div>

    <div class="grid grid-2">
      <div class="card"><h3>💪 Mes points forts</h3><ul>${strengths.map(s=>`<li>${s}</li>`).join("")}</ul></div>
      <div class="card"><h3>🎯 Mes lacunes à combler</h3><ul>${gaps.map(s=>`<li>${s}</li>`).join("")}</ul></div>
    </div>

    <h3 style="margin-top:26px;">🧭 Métiers recommandés</h3>
    <div class="grid grid-3">${recommendedJobs.map(j=>`<a class="card clickable" href="metiers.html?open=${j.id}"><h3>${j.title}</h3><p class="muted">${j.summary}</p></a>`).join("") || "<p class='muted'>Aucune recommandation pour ce filtre — explore la page Métiers.</p>"}</div>

    <h3 style="margin-top:26px;">🧩 Compétences prioritaires</h3>
    <div>${prioritySkills.map(s=>`<span class="tag">${s}</span>`).join("") || "<p class='muted'>Voir la page Compétences pour une skill map complète.</p>"}</div>

    <h3 style="margin-top:26px;">🏢 Entreprises à cibler</h3>
    <div>${companyNames.map(n=>`<span class="tag">${n}</span>`).join("") || "<p class='muted'>Voir la page Entreprises.</p>"}</div>

    <h3 style="margin-top:26px;">📅 Plan d'action</h3>
    <div class="grid grid-3">
      <div class="card"><h4 style="color:var(--teal);">3 mois</h4><ul>${plan3.map(p=>`<li>${p}</li>`).join("")}</ul></div>
      <div class="card"><h4 style="color:var(--teal);">6 mois</h4><ul>${plan6.map(p=>`<li>${p}</li>`).join("")}</ul></div>
      <div class="card"><h4 style="color:var(--teal);">12 mois</h4><ul>${plan12.map(p=>`<li>${p}</li>`).join("")}</ul></div>
    </div>
    <div class="center" style="margin-top:24px;"><a href="logiai.html" class="btn btn-outline">🤖 Affiner avec LogiAI</a></div>
  `;
  document.getElementById("recoResult").innerHTML = html;
  document.getElementById("recoResult").scrollIntoView({behavior:"smooth", block:"start"});

  localStorage.setItem("logipath_profile", JSON.stringify({education, experience, sector, appetence, software, languages}));
}

function restoreProfile(){
  const saved = localStorage.getItem("logipath_profile");
  if(!saved) return;
  try{
    const p = JSON.parse(saved);
    document.getElementById("f_education").value = p.education;
    document.getElementById("f_experience").value = p.experience;
    document.getElementById("f_sector").value = p.sector;
    document.getElementById("f_appetence").value = p.appetence;
    document.querySelectorAll(".f_software").forEach(el => el.checked = p.software.includes(el.value));
    document.querySelectorAll(".f_lang").forEach(el => el.checked = p.languages.includes(el.value));
  }catch(e){}
}
