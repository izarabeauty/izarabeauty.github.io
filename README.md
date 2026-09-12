# LogiPath 🇲🇦

**Comprendre la logistique. Construire sa carrière.**

LogiPath centralise, sur une seule plateforme, tout ce qu'il faut pour découvrir, comprendre et intégrer le secteur de la Logistique & Supply Chain au Maroc : concepts de base, cartographie des métiers, entreprises, compétences, guide de candidature, simulateur de décisions et un assistant IA spécialisé (**LogiAI**).

## Parcours du site

Découvrir → Comprendre → Explorer les métiers → Choisir → Se former → Postuler → Évoluer

## Stack technique

Site statique (HTML / CSS / JS vanilla), sans dépendance de build, déployable directement sur GitHub Pages.

```
index.html            Accueil
decouvrir.html         Étape 1 — la logistique de zéro
comprendre.html        Étape 2 — chaîne Supply Chain interactive + concepts
metiers.html           Cartographie des 22 métiers + roadmaps
maroc.html             Écosystème logistique marocain
entreprises.html       Base d'entreprises (recherche LinkedIn/Google intégrée)
postuler.html          CV, LinkedIn, candidature spontanée, entretien
competences.html       Skill map interactive
logiai.html            Assistant LogiAI
parcours.html          Profil utilisateur → recommandations indicatives
simulateur.html        Logistics Challenge (mises en situation)
ressources.html        Glossaire complet, livres, certifications, outils
apropos.html           Positionnement du projet

assets/css/style.css   Design system unique (variables, composants)
assets/js/data.js      Toutes les données de contenu (source unique de vérité)
assets/js/main.js      Header/footer, navigation, recherche globale, mode débutant, modales
assets/js/logiai.js    Moteur de réponse de l'assistant LogiAI
assets/js/parcours.js  Génération des recommandations "Mon Parcours"
assets/js/simulateur.js  Scénarios du Logistics Challenge
```

## Architecture pensée pour évoluer

Tout le contenu (métiers, entreprises, glossaire, compétences, ressources) est centralisé dans `assets/js/data.js` sous forme d'objets JS structurés. Ajouter une entreprise, un métier ou un terme de glossaire ne nécessite de modifier qu'un seul fichier — aucune page HTML à toucher. C'est la base sur laquelle un futur tableau de bord administrateur (édition via interface, base de données) pourra brancher, sans changer la structure des pages.

## LogiAI — état actuel et évolution prévue

La version actuelle est un **moteur de réponse basé sur une base de connaissances** (correspondance par mots-clés + exploitation directe des données du site), volontairement sans appel à une API de modèle de langage externe côté client — pour ne jamais exposer de clé API dans le navigateur et pour garantir des réponses toujours ancrées dans les données vérifiées du site plutôt que générées librement.

Évolution prévue : brancher un vrai modèle de langage (Claude, par exemple) via un backend sécurisé, en conservant le principe de ne jamais inventer d'entreprise, d'offre d'emploi, de salaire ou de réglementation.

## Fiabilité des données

Aucune donnée (entreprise, salaire, réglementation) n'est inventée. Les informations sont d'ordre général et publiquement connues, marquées comme indicatives avec une date de dernière vérification, et systématiquement accompagnées d'un renvoi vers les sources officielles ou des liens de recherche en temps réel (Google / LinkedIn) plutôt que des URLs figées potentiellement obsolètes.

## Roadmap (post-MVP)

- Tableau de bord administrateur (CRUD sur entreprises, métiers, ressources)
- Système de signalement communautaire des informations obsolètes
- Traduction complète 🇬🇧 anglais et 🇲🇦 arabe
- Connexion de LogiAI à un vrai modèle de langage via backend
- Comptes utilisateurs pour sauvegarder "Mon Parcours" au-delà du `localStorage`
