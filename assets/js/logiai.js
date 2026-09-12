/* =========================================================================
   LogiAI — Assistant basé sur une base de connaissances (MVP)
   -------------------------------------------------------------------------
   Ceci n'est PAS un modèle de langage connecté à une API externe : c'est un
   moteur de correspondance par mots-clés qui s'appuie sur les données du
   site (data.js) pour répondre. L'architecture est prévue pour être
   remplacée plus tard par un vrai appel à un LLM via un backend sécurisé
   (jamais de clé API exposée côté client).
   ========================================================================= */

function normalize(str){
  return str.toLowerCase().normalize("NFD").replace(new RegExp("[\\u0300-\\u036f]", "g"), "");
}

function containsAny(text, keywords){
  return keywords.some(k => text.includes(normalize(k)));
}

/* Base de connaissances curatée : couvre les questions types du brief */
const LOGIAI_KB = [
  { id: "intro",
    keywords: ["ne comprends rien", "par ou commencer", "par où commencer", "debutant complet", "commencer supply chain", "je debute"],
    answer: () => `Bienvenue ! Voici par où commencer, étape par étape :
      <ul>
        <li><strong>1.</strong> Découvre les bases avec l'exemple de la bouteille d'eau → <a href="decouvrir.html">La logistique de zéro</a></li>
        <li><strong>2.</strong> Comprends la chaîne complète et ses concepts → <a href="comprendre.html">Comprendre la Supply Chain</a></li>
        <li><strong>3.</strong> Explore les métiers pour voir ce qui te correspond → <a href="metiers.html">Les métiers</a></li>
      </ul>
      <span class="disclaimer">Astuce : active le 🟢 Mode débutant en haut de page pour avoir des définitions au survol de chaque terme technique.</span>` },
  { id: "difference-log-sc",
    keywords: ["difference entre logistique et supply chain", "logistique vs supply chain", "difference logistique supply"],
    answer: () => `Bonne question, souvent source de confusion :
      <ul>
        <li><strong>La logistique</strong> gère les flux physiques : transport, entreposage, manutention.</li>
        <li><strong>La Supply Chain</strong> est plus large : elle englobe la logistique <em>et</em> la prévision, les achats, la production et la relation client — toute la chaîne, du fournisseur au client final.</li>
      </ul>
      Autrement dit : la logistique est un maillon (important) de la Supply Chain. Voir <a href="decouvrir.html">La logistique de zéro</a> pour l'exemple complet.` },
  { id: "difference-acheteur-approvisionneur",
    keywords: ["difference entre acheteur et approvisionneur", "acheteur ou approvisionneur", "difference acheteur approvisionneur"],
    answer: () => `Les deux travaillent sur les achats, mais à des moments différents :
      <ul>
        <li><strong>L'acheteur</strong> sélectionne les fournisseurs et négocie les prix/contrats (en amont, stratégique).</li>
        <li><strong>L'approvisionneur</strong> déclenche les commandes au quotidien et s'assure que les livraisons arrivent à temps (en aval, opérationnel).</li>
      </ul>
      Voir les fiches complètes : <a href="metiers.html?open=acheteur">Acheteur</a> · <a href="metiers.html?open=procurement-specialist">Procurement Specialist</a>` },
  { id: "etudiant-gestion-maroc",
    keywords: ["etudiant en gestion au maroc", "quel metier me correspond", "gestion maroc supply chain", "quel metier choisir"],
    answer: () => `Avec un profil gestion, plusieurs familles de métiers Supply Chain sont accessibles :
      <ul>
        <li>📦 <strong>Supply Chain</strong> (Analyst, Planner) si tu aimes l'analyse et la coordination</li>
        <li>🛒 <strong>Achats</strong> (Acheteur) si tu aimes la négociation et le relationnel</li>
        <li>🏭 <strong>Logistique</strong> (Coordinator, Warehouse) si tu aimes l'organisation terrain</li>
        <li>📊 <strong>Data</strong> (Supply Chain Data Analyst) si tu aimes les chiffres et les outils</li>
      </ul>
      Pour une recommandation plus précise selon ton profil exact, remplis <a href="parcours.html">Mon Parcours</a> — ça reste une recommandation indicative, pas une vérité absolue.` },
  { id: "competences-grande-entreprise",
    keywords: ["competences pour travailler chez une grande entreprise", "competences grande entreprise", "quelles competences developper"],
    answer: () => `Les compétences les plus demandées par les grandes entreprises au Maroc (Renault, OCP, Bosch...) sont généralement :
      <ul>
        <li>Excel avancé et Power BI</li>
        <li>Un ERP (souvent SAP)</li>
        <li>Un bon niveau d'anglais professionnel</li>
        <li>Rigueur, capacité d'analyse et communication transverse</li>
      </ul>
      Détail complet avec niveaux et projets pratiques → <a href="competences.html">Compétences à développer</a>` },
  { id: "stage-maroc",
    keywords: ["stage en supply chain au maroc", "cherche un stage", "comment trouver un stage", "trouver un stage maroc"],
    answer: () => `Pour décrocher un stage en Supply Chain au Maroc :
      <ul>
        <li><strong>1.</strong> Cible des entreprises précises → <a href="entreprises.html">Entreprises</a></li>
        <li><strong>2.</strong> Prépare un CV orienté métier → <a href="postuler.html">Comment postuler</a></li>
        <li><strong>3.</strong> Active ton réseau LinkedIn et contacte directement des professionnels du secteur</li>
        <li><strong>4.</strong> N'hésite pas à candidater spontanément, même sans offre publiée</li>
      </ul>
      <span class="disclaimer">Je ne peux pas te donner d'offres d'emploi précises (je ne les invente jamais) — utilise les liens de recherche sur les fiches entreprises pour voir les offres réelles et à jour.</span>` },
  { id: "incoterms",
    keywords: ["incoterms avec un exemple", "explique les incoterms", "c'est quoi un incoterm"],
    answer: () => `Les Incoterms définissent qui paie et qui est responsable à chaque étape d'un transport international.
      <br><br><strong>Exemple concret :</strong> en <em>FOB (Free On Board)</em>, le vendeur marocain paie le transport jusqu'au port de Tanger Med et charge la marchandise sur le bateau. À partir de ce moment, le transport, l'assurance et les risques sont à la charge de l'acheteur étranger.
      <br>Voir aussi <a href="comprendre.html?open=transport">le concept complet</a>.` },
  { id: "entretien-procurement",
    keywords: ["entretien pour un stage en procurement", "prepare moi a l'entretien", "prepare mon entretien", "entretien procurement"],
    answer: () => `Pour un entretien en Procurement, prépare-toi sur :
      <ul>
        <li>Le cycle complet d'achat (besoin → sourcing → négociation → commande → paiement)</li>
        <li>Un exemple où tu as négocié quelque chose (même dans un contexte non professionnel)</li>
        <li>La différence entre achats stratégiques et achats opérationnels</li>
      </ul>
      Questions fréquentes et conseils détaillés → <a href="postuler.html">Comment postuler</a> (section Entretien)` },
];

const QUICK_ACTIONS = [
  { label: "💡 Explique-moi", prompt: "Explique-moi la Supply Chain" },
  { label: "🎯 Quel métier choisir ?", prompt: "Quel métier me correspond ?" },
  { label: "📚 Apprends-moi", prompt: "Par où commencer pour apprendre la logistique ?" },
  { label: "💼 Prépare mon entretien", prompt: "Prépare-moi à un entretien Supply Chain" },
  { label: "📄 Analyse mon CV", prompt: "__cv__" },
  { label: "🇲🇦 Logistique au Maroc", prompt: "Parle-moi de la logistique au Maroc" }
];

function findJobMatch(text){
  return JOBS.find(j => text.includes(normalize(j.title)));
}
function findGlossaryMatch(text){
  return GLOSSARY.find(g => text.includes(normalize(g.term.split(" (")[0])) || text.includes(normalize(g.id.replace(/-/g," "))));
}
function findCompanyMatch(text){
  return COMPANIES.find(c => text.includes(normalize(c.name)));
}

function jobAnswer(j){
  return `<strong>${j.title}</strong> — ${j.summary}
    <ul>
      <li><strong>Études :</strong> ${j.education}</li>
      <li><strong>Premier poste :</strong> ${j.firstJob}</li>
    </ul>
    <strong>Comment devenir ${j.title} :</strong>
    <ul>${j.roadmap.map(r=>`<li>${r}</li>`).join("")}</ul>
    <a href="metiers.html?open=${j.id}">Voir la fiche complète →</a>
    <span class="disclaimer">💰 ${j.salaryNote}</span>`;
}
function glossaryAnswer(g){
  return `<strong>${g.term}</strong><br>${g.def}<br><br><strong>Exemple :</strong> ${g.example}
    <br><a href="ressources.html?open=glossary-${g.id}">Voir dans le glossaire →</a>`;
}
function companyAnswer(c){
  return `${c.name} est une entreprise du secteur ${c.sector.toLowerCase()}, présente notamment à ${c.location}.
    <span class="disclaimer">Je ne connais pas d'offres d'emploi précises pour cette entreprise (je n'en invente jamais). Consulte sa fiche complète pour des liens de recherche à jour.</span>
    <br><a href="entreprises.html?open=${c.id}">Voir la fiche entreprise →</a>`;
}

function findBestKB(text){
  let best = null, bestScore = 0;
  LOGIAI_KB.forEach(entry => {
    const score = entry.keywords.reduce((acc,k) => acc + (text.includes(normalize(k)) ? k.split(" ").length : 0), 0);
    if(score > bestScore){ bestScore = score; best = entry; }
  });
  return bestScore > 0 ? best : null;
}

function generateAnswer(raw){
  const text = normalize(raw);

  if(raw === "__cv__") return { html: cvUploadPrompt(), skipUser:false };

  const job = findJobMatch(text);
  if(job) return { html: jobAnswer(job) };

  const glossary = findGlossaryMatch(text);
  if(glossary) return { html: glossaryAnswer(glossary) };

  const company = findCompanyMatch(text);
  if(company) return { html: companyAnswer(company) };

  const kb = findBestKB(text);
  if(kb) return { html: kb.answer() };

  return { html: `Je n'ai pas de réponse toute faite pour cette question précise dans ma base de connaissances actuelle (version MVP).
    <br><br>Voici où tu devrais trouver ta réponse :
    <ul>
      <li><a href="ressources.html">Glossaire &amp; ressources</a> pour un terme technique</li>
      <li><a href="metiers.html">Les métiers</a> pour une question de carrière</li>
      <li><a href="entreprises.html">Entreprises</a> pour une question sur un employeur</li>
    </ul>
    <span class="disclaimer">Je préfère t'orienter plutôt que d'inventer une réponse incertaine.</span>` };
}

function cvUploadPrompt(){
  return `Colle le texte de ton CV ci-dessous, je te donne un retour rapide basé sur des critères objectifs (mots-clés, structure, longueur) :
    <div style="margin-top:10px;">
      <textarea id="cvInput" rows="5" placeholder="Colle ici le texte de ton CV..." style="width:100%;"></textarea>
      <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="analyzeCV()">Analyser</button>
    </div>
    <span class="disclaimer">Analyse heuristique simple (pas une IA de génération) : elle vérifie la présence de mots-clés et de bonnes pratiques, sans juger le fond de ton parcours.</span>`;
}

function analyzeCV(){
  const val = document.getElementById("cvInput").value.trim();
  if(!val){ return; }
  const text = normalize(val);
  const words = val.split(/\s+/).filter(Boolean).length;
  const foundSkills = [...SKILLS.technical, ...SKILLS.management].filter(s => text.includes(normalize(s.name))).map(s=>s.name);
  const hasNumbers = /\d/.test(val);
  const feedback = [];
  feedback.push(words < 150 ? "⚠️ Ton CV semble très court : détaille un peu plus tes expériences et projets." : (words > 600 ? "⚠️ Ton CV semble long : vise une seule page pour un profil junior." : "✅ Longueur globalement raisonnable pour un profil junior."));
  feedback.push(foundSkills.length > 0 ? `✅ Compétences détectées : ${foundSkills.join(", ")}.` : "⚠️ Je ne détecte aucune compétence technique connue (Excel, Power BI, SAP...) — pense à les lister explicitement.");
  feedback.push(hasNumbers ? "✅ Tu utilises des chiffres, c'est excellent pour prouver un résultat concret." : "⚠️ Essaie d'ajouter des résultats chiffrés (ex: « réduction de 10% des délais »).");
  addMessage("bot", `<strong>Retour sur ton CV :</strong><ul>${feedback.map(f=>`<li>${f}</li>`).join("")}</ul><span class="disclaimer">Pour aller plus loin, consulte le guide complet → <a href="postuler.html">Comment postuler</a></span>`);
  document.getElementById("cvInput").closest(".msg").remove();
}

function addMessage(role, html){
  const log = document.getElementById("chatLog");
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function sendPrompt(raw){
  if(raw !== "__cv__") addMessage("user", raw.replace(/</g,"&lt;"));
  const result = generateAnswer(raw);
  setTimeout(() => addMessage("bot", result.html), 250);
}

function initLogiAI(){
  const quick = document.getElementById("chatQuick");
  quick.innerHTML = QUICK_ACTIONS.map(a => `<button class="btn btn-outline btn-sm" data-prompt="${a.prompt.replace(/"/g,'&quot;')}">${a.label}</button>`).join("");
  quick.querySelectorAll("button").forEach(b => b.addEventListener("click", () => sendPrompt(b.dataset.prompt)));

  const form = document.getElementById("chatForm");
  const input = document.getElementById("chatInput");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim();
    if(!val) return;
    sendPrompt(val);
    input.value = "";
  });

  addMessage("bot", `Bonjour 👋 Je suis <strong>LogiAI</strong>, assistant spécialisé en Logistique &amp; Supply Chain, avec un focus Maroc.
    <br><br>Je m'appuie sur la base de connaissances de LogiPath (pas un modèle de langage externe) : je ne réponds qu'avec des informations vérifiables, je ne fabrique jamais d'entreprise, d'offre d'emploi ou de salaire, et je te dis quand il faut vérifier une information par toi-même.
    <br><br>Que veux-tu savoir ?`);

  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  if(q) sendPrompt(q);
}
