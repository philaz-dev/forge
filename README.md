# Vita — maquette haute fidélité

> Transformez les données de votre clinique en suivi personnalisé, fidélisation et
> nouvelles opportunités de revenus — tout au long de la vie de l'animal.

Vita est un **CRM de cycle de vie pour cliniques vétérinaires**, complément (et non
remplacement) d'un logiciel métier comme GMVet. Cette V1 est un démonstrateur
navigable : 100 % front-end, données fictives, aucun envoi réel.

## Lancer

```bash
pnpm install
pnpm dev      # http://localhost:3100
pnpm test     # moteur de recommandations, filtres, jeu de données
```

## Parcours de démonstration (≈ 8 min)

1. `/` — la promesse, deux entrées : espace vétérinaire / espace propriétaire.
2. **Dashboard** (`/clinique`) — KPI, potentiel de CA, « À faire aujourd'hui »
   (Voir le dossier · Contacter · Programmer un rappel · Ignorer, tous fonctionnels).
3. **Animaux** — recherche (⌘K), filtres combinables, tri, pagination. Les KPI du dashboard
   ouvrent la liste pré-filtrée.
4. **Fiche Oslo** — bloc _Actions recommandées_, courbe de poids interactive
   (+3,2 kg depuis janv. 2024 · « Évolution à surveiller »), vaccinations, historique, documents.
5. **Campagnes → Bilan senior** — animaux concernés, canaux, aperçu personnalisé, « Envoyer à 18 propriétaires » (simulé).
6. **Opportunités** — 7 catégories, potentiel et conversion (fictifs).
7. **Espace propriétaire** (mobile first) — prendre un rendez-vous ou demander conseil :
   la demande apparaît **en direct** dans les notifications du Dr Martin (🔔).
8. **Paramètres → Importer mes données** — drag & drop GMVet simulé (bouton « fichier d'exemple »).

`Réinitialiser la démo` (bas de la barre latérale) remet l'état à zéro.

## Principe fondateur : jamais de diagnostic

`src/domain/engine/recommendations.ts` applique des **règles transparentes** (âge, échéances,
dernière visite, évolution de pesées) et soumet le résultat au vétérinaire. Les libellés restent
factuels (« n'a pas effectué », « évolution à surveiller »). Un test automatisé vérifie
l'absence de vocabulaire diagnostique.

## Architecture (prête à brancher)

```
src/
  domain/            types + moteur pur (reco, poids, filtres, vie de l'animal) — testable
  data/              seed fictif, build déterministe, repository (interface ClinicRepository)
  store/             état de démo partagé clinique ↔ propriétaire (localStorage)
  components/        ui/ (design system), clinic/, owner/, shared/
  app/               /clinique/*  et  /proprietaire/*  (App Router)
```

| Brancher plus tard    | Où                                                                                                                         |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Supabase / PostgreSQL | implémenter `ClinicRepository` (`data/repository.ts`) ; tables : owners, animals, weights, vaccinations, events, documents |
| Import / API GMVet    | remplacer `data/build.ts` par un mapper CSV/XLSX → entités ; l'écran d'import est déjà en place                            |
| Authentification      | middleware + rôles `vet` / `owner` ; `DEMO_OWNER_ID` devient la session                                                    |
| Notifications         | `store.notify` / `sendCampaign` → passerelle e-mail, SMS, push                                                             |
| Rendez-vous           | `store.book` → service d'agenda ; `BookingModal` consomme déjà des créneaux                                                |
| Stripe                | `ProductModal` (aujourd'hui « Demander à la clinique », sans paiement)                                                     |

## Notes

- Date de référence fixe (`TODAY` dans `lib/dates.ts`) : données cohérentes d'une démo à l'autre.
- Chiffres clinique (2 847 animaux, 18 450 €…) : valeurs fictives du cahier des charges ; la base
  navigable (52 animaux, 32 propriétaires) en est un échantillon, signalé comme tel dans l'UI.
- Photos : illustrations SVG générées ; `Animal.photoUrl` permet d'afficher de vraies photos.
