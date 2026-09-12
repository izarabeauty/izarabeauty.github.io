/* =========================================================================
   Logistics Challenge — Simulateur de décisions Supply Chain
   ========================================================================= */

const SCENARIOS = [
  { id: "s1", level: "Débutant",
    title: "Rupture de stock inattendue",
    situation: "Tu gères le stock d'un petit supermarché. Un produit très populaire (jus d'orange) est en rupture depuis ce matin, alors que la demande est forte. Que fais-tu en priorité ?",
    choices: [
      { text: "Attendre la prochaine livraison prévue la semaine prochaine, sans rien faire d'autre", correct: false,
        feedback: "Risqué : tu perds des ventes toute la semaine et le client pourrait aller chez un concurrent. Il faut agir plus vite." },
      { text: "Contacter immédiatement le fournisseur pour une livraison express, et informer l'équipe en magasin", correct: true,
        feedback: "Bonne réaction : limiter l'impact client à court terme est la priorité, avant de chercher la cause racine." },
      { text: "Retirer un autre produit du rayon pour combler l'espace vide, sans agir sur le stock", correct: false,
        feedback: "Ça masque le problème visuellement mais ne résout rien : le client cherche toujours le produit en rupture." }
    ],
    concepts: ["stock-securite", "point-commande"] },
  { id: "s2", level: "Débutant",
    title: "Choisir un mode de transport",
    situation: "Tu dois envoyer un petit colis urgent de Casablanca à Tanger, qui doit arriver demain matin. Quel mode choisir ?",
    choices: [
      { text: "Transport maritime (bateau)", correct: false, feedback: "Le maritime est économique mais bien trop lent pour une livraison en 24h sur cette distance." },
      { text: "Transport routier express", correct: true, feedback: "Pour une courte distance et un délai serré, la route reste le choix le plus rapide et flexible." },
      { text: "Attendre d'avoir plusieurs colis pour grouper l'envoi la semaine prochaine", correct: false, feedback: "Cela optimiserait les coûts, mais ne respecte pas la contrainte de délai (demain matin)." }
    ],
    concepts: ["transport", "lead-time"] },
  { id: "s3", level: "Intermédiaire",
    title: "Hausse soudaine de la demande + retard fournisseur",
    situation: "Une entreprise connaît une augmentation soudaine de la demande. Le stock diminue rapidement. Le fournisseur annonce un retard de livraison de 2 semaines sur un composant clé. Que fais-tu ?",
    choices: [
      { text: "Réduire la production pour économiser le stock restant, sans chercher d'alternative", correct: false,
        feedback: "Cela limite les dégâts à très court terme mais ne résout pas le problème et peut aggraver le retard de livraison aux clients." },
      { text: "Chercher un fournisseur alternatif en urgence tout en priorisant les clients les plus stratégiques avec le stock restant", correct: true,
        feedback: "C'est l'approche la plus équilibrée : sécuriser une solution à moyen terme (nouveau fournisseur) tout en gérant intelligemment la pénurie à court terme." },
      { text: "Ne rien changer et espérer que le fournisseur rattrape son retard", correct: false,
        feedback: "Trop passif : sans action, le risque de rupture totale et de perte de clients est élevé." }
    ],
    concepts: ["stock-securite", "bullwhip", "qcd"] },
  { id: "s4", level: "Intermédiaire",
    title: "Goulet d'étranglement en production",
    situation: "Sur une ligne de production, une machine ne peut traiter que 100 pièces/heure alors que toutes les autres en traitent 300. La production globale est donc limitée. Quelle est la meilleure action ?",
    choices: [
      { text: "Augmenter la vitesse de toutes les autres machines encore plus", correct: false,
        feedback: "Inutile : la capacité globale reste limitée par le goulet d'étranglement (100 pièces/heure), peu importe la vitesse des autres machines." },
      { text: "Investir dans la machine limitante ou réorganiser le flux pour augmenter sa capacité", correct: true,
        feedback: "Exact : en théorie des contraintes, améliorer le goulet d'étranglement est le seul moyen d'augmenter la capacité globale du système." },
      { text: "Arrêter temporairement les autres machines pour qu'elles ne produisent pas plus vite que le goulet", correct: false,
        feedback: "Cela évite l'accumulation de stock intermédiaire, mais ne résout pas le vrai problème : la capacité globale reste bloquée à 100 pièces/heure." }
    ],
    concepts: ["goulet", "lean"] },
  { id: "s5", level: "Avancé",
    title: "Effet Bullwhip sur toute la chaîne",
    situation: "Un magasin observe une hausse de 5% des ventes de couches. Il commande 15% de plus par précaution. Le grossiste, voyant cette hausse, commande 30% de plus à l'usine. L'usine augmente sa production de 50%. Comment limiter ce phénomène à l'avenir ?",
    choices: [
      { text: "Chaque acteur devrait continuer à ajuster ses marges de sécurité individuellement, sans plus d'information", correct: false,
        feedback: "C'est justement ce comportement qui amplifie l'effet Bullwhip : chaque acteur réagit sans visibilité sur la demande réelle." },
      { text: "Partager les données de vente réelles entre tous les acteurs de la chaîne pour une planification collaborative", correct: true,
        feedback: "C'est la meilleure réponse : plus l'information circule vite et fidèlement le long de la chaîne, moins l'effet Bullwhip s'amplifie." },
      { text: "Augmenter les stocks de sécurité à chaque étape de la chaîne", correct: false,
        feedback: "Cela absorbe temporairement le problème mais augmente fortement les coûts de stockage sans traiter la cause racine (manque d'information partagée)." }
    ],
    concepts: ["bullwhip", "kpi"] },
  { id: "s6", level: "Avancé",
    title: "Arbitrage stratégique Push vs Pull",
    situation: "Une entreprise de mode veut réduire ses invendus tout en restant réactive aux tendances. Elle produit actuellement tout selon des prévisions établies 6 mois à l'avance (système Push). Quelle évolution recommander ?",
    choices: [
      { text: "Garder le même système Push, qui a fait ses preuves historiquement", correct: false,
        feedback: "Risqué dans un secteur où les tendances évoluent vite : le Push pur génère souvent des invendus importants." },
      { text: "Passer à un modèle hybride : produire une base en Push, et ajuster une partie de la production en Pull selon les ventes réelles", correct: true,
        feedback: "C'est l'approche la plus réaliste : combiner la stabilité du Push pour les produits de base avec la réactivité du Pull pour les tendances, réduit à la fois les invendus et les ruptures." },
      { text: "Passer à un système 100% Pull, en ne produisant qu'à la commande", correct: false,
        feedback: "Trop radical pour la mode à grande échelle : les délais de production deviendraient trop longs pour suivre les tendances rapidement, sauf pour des marques de niche." }
    ],
    concepts: ["push-pull", "kpi"] }
];

function levelClass(level){ return `level-${level}`; }

function renderScenarioList(filter){
  const grid = document.getElementById("scenarioGrid");
  const list = SCENARIOS.filter(s => filter==="all" || s.level===filter);
  grid.innerHTML = list.map(s => `
    <div class="card clickable" data-id="${s.id}">
      <span class="level-pill ${levelClass(s.level)}">${s.level}</span>
      <h3 style="margin-top:10px;">${s.title}</h3>
      <p class="muted">${s.situation.slice(0,100)}...</p>
    </div>`).join("");
  grid.querySelectorAll(".card").forEach(c => c.addEventListener("click", () => openScenario(c.dataset.id)));
}

function openScenario(id){
  const s = SCENARIOS.find(x => x.id === id);
  document.getElementById("scenarioList").style.display = "none";
  const wrap = document.getElementById("scenarioPlay");
  wrap.style.display = "block";
  wrap.innerHTML = `
    <div class="sim-scenario">
      <span class="level-pill ${levelClass(s.level)}">${s.level}</span>
      <h2 style="margin-top:14px;">${s.title}</h2>
      <p>${s.situation}</p>
      <div id="choices">${s.choices.map((c,i) => `<button class="sim-choice" data-i="${i}">${c.text}</button>`).join("")}</div>
      <div class="sim-feedback" id="simFeedback"></div>
      <button class="btn btn-outline" style="margin-top:16px;" onclick="backToList()">← Retour aux scénarios</button>
    </div>`;

  wrap.querySelectorAll(".sim-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".sim-choice").forEach(b => b.disabled = true);
      const choice = s.choices[+btn.dataset.i];
      btn.style.borderColor = choice.correct ? "#22c55e" : "#ef4444";
      const fb = document.getElementById("simFeedback");
      fb.innerHTML = `
        <p><strong>${choice.correct ? "✅ Bonne approche" : "⚠️ À améliorer"}</strong></p>
        <p>${choice.feedback}</p>
        <div class="modal-section"><h4>Concepts liés</h4>${s.concepts.map(cid => { const g = GLOSSARY.find(x=>x.id===cid); return g ? `<span class="tag">${g.term}</span>` : ""; }).join("")}</div>
      `;
      fb.classList.add("show");
    });
  });
}

function backToList(){
  document.getElementById("scenarioPlay").style.display = "none";
  document.getElementById("scenarioList").style.display = "block";
}
