# AMEPA-landing

# Site AMEPA

Next.js 16 (App Router, JavaScript), Tailwind CSS 4, next-intl (FR par défaut, AR en RTL, EN), Sanity avec Studio intégré sur `/studio`. Le cahier des charges est dans [CLAUDE.md](CLAUDE.md), le guide de l'équipe communication dans [GUIDE_MISE_A_JOUR.md](GUIDE_MISE_A_JOUR.md).

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
```

Sans configuration, le site affiche le contenu de départ de `src/content`. En développement, les formulaires sont enregistrés dans `.data/submissions.ndjson`.

## Mise en service

1. **Sanity.** Avec un compte de l'AMEPA, créer un projet sur sanity.io/manage, dataset `production`. Copier `.env.example` en `.env.local` et renseigner `NEXT_PUBLIC_SANITY_PROJECT_ID`. Dans API → CORS origins, ajouter `http://localhost:3000` et l'adresse du site, avec credentials.
2. **Contenu de départ.** Avec `SANITY_API_WRITE_TOKEN` renseigné :
   ```bash
   npm run seed
   npm run seed:import   # ne remplace jamais un document existant
   ```
3. **Formulaires.** Créer un jeton *Editor* (`SANITY_API_WRITE_TOKEN`) et, pour les e-mails, un compte Resend avec domaine vérifié (`RESEND_API_KEY`, `FORMS_FROM_EMAIL`, `FORMS_TO_EMAIL`). Au moins l'un des deux est nécessaire en production, sinon l'envoi échoue avec un message d'erreur.
4. **Vercel.** Importer le dépôt depuis un compte de l'AMEPA, recopier les variables, définir `NEXT_PUBLIC_SITE_URL`.
5. **Webhook.** sanity.io/manage → API → Webhooks : URL `https://<site>/api/revalidate`, événements create, update, delete, filtre `_type != "submission"`, projection `{_type}`, secret identique à `SANITY_REVALIDATE_SECRET`.
6. **Ouverture.** Une fois les `[À CONFIRMER]` remplacés, passer `SITE_INDEXABLE=true` et redéployer. Avant cela, `robots.txt` bloque les moteurs de recherche.

## Contrôles

```bash
npm run build && npm start
npm run audit                  # accessibilité, liens, hreflang, débordements sur toutes les pages
node scripts/e2e.mjs           # parcours : langues, filtres, formulaires, menu mobile
node scripts/shots.mjs         # captures d'écran (Chrome installé requis)
```

Définir `BASE_URL` si le serveur n'est pas sur le port 3000.

## Photos

`npm run photos -- search "desalination plant"`, puis `npm run photos -- get <id> expertise/<nom>`. Le script suit le skill `site-images` : il signale le téléchargement à Unsplash et complète `public/images/CREDITS.md`, affiché sur `/credits`. Clé requise : `UNSPLASH_ACCESS_KEY` dans `.env.local`. Les images destinées à l'équipe communication se déposent dans Sanity.

## Choix à connaître

- **Données personnelles.** Les datasets Sanity gratuits sont publics. Les demandes reçues portent un identifiant `submissions.*`, illisible sans authentification. Ne pas changer ce préfixe.
- **« Réservé aux membres »** masque le lien du PDF, mais ne protège pas le fichier lui-même.
- **Langues.** Un contenu sans traduction s'affiche en français, sans être annoncé dans hreflang.
- **Carte.** Tracé du Maroc selon la représentation officielle marocaine, données Natural Earth (domaine public).
- **Logo.** `src/components/Wordmark.jsx` compose le nom en attendant le fichier officiel.
- **Ajouts aux schémas du brief.** `video` (vidéothèque), `dateTbc` et `monthOnly` (événements), `roleAr` et `roleEn` (gouvernance), type « Appel à projets » (opportunités), crédit photo.
