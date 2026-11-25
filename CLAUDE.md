# AMEPA — New-Gen Website Brief (for Claude Code)

> Put this file at the repo root as `CLAUDE.md`.
> Sitemap source: "ARBORESCENCE DU SITE WEB DE L'AMEPA".
> **Goal:** build once, hand off to AMEPA's comms team, who edit all content themselves in Sanity Studio. The developer should not be needed for day-to-day updates.

---

## 1. Who AMEPA is (verified facts — use these, don't invent others)
- **Association Marocaine de l'Eau Potable et de l'Assainissement**, founded **1997** (merger of a Moroccan committee created in **1985** by public & private water operators).
- **95+ active members**: public/private operators (ONEE, SRM, concessionaires), industrials, engineering firms, contractors.
- **President: Tarik Hamane** (DG of ONEE), elected unanimously **2 June 2026** for **2026–2030**.
- International: AAE congresses, co-organiser of **Dutch Moroccan Water Days** (Dec 2025, Marrakech, alongside the 19th World Water Congress), prospecting missions, Sud-Sud / Africa cooperation.

⚠️ Any other figure, name, logo or date → placeholder `[À CONFIRMER]`. Never invent numbers or quotes.

## 2. Positioning
**Tagline:** *"Depuis 1997, l'AMEPA fédère l'expertise marocaine de l'eau et de l'assainissement."*
Site jobs: official showcase · sector resource centre · matchmaking (public ↔ private ↔ research ↔ international).
Audiences: members & prospects → institutions/donors/international partners → engineers & researchers → press.

## 3. Information architecture
Header: **L'AMEPA · Expertise · Événements · International · Membres · Ressources · Contact** + CTA **"Devenir membre"** + **FR / AR / EN** switch.

| Page | Key sections |
|---|---|
| Accueil | Hero, Mot du Président, chiffres clés, actualités, prochains événements, 9 domaines, publications récentes, logos membres/partenaires, CTA adhésion |
| L'AMEPA | Présentation, timeline 1985→1997→2026, missions, gouvernance (AG / CA / Bureau), comités, statuts, rapports (PDF) |
| Expertise | 9 domain pages + Innovation & R&D, Prix AMEPA de l'innovation hydrique, appels à projets |
| Événements | Calendar + filters, event page (programme, intervenants, lieu, inscription link), archives (photos, présentations, actes) |
| International | Partenariats, réseaux, Sud-Sud & Afrique, missions B2B, export |
| Membres | Searchable directory (filter by category), avantages, conditions, formulaire d'adhésion |
| Ressources | Library (études, notes, guides, réglementation, présentations) with search + filters, newsletter, vidéothèque |
| Opportunités | Appels d'offres, marchés, partenaires, financements, mise en relation |
| Contact | Coordonnées, map, forms (contact / adhésion / partenariat), réseaux sociaux |

## 4. Expertise domains
1. Eau potable et traitement · 2. Dessalement · 3. Assainissement liquide et épuration · 4. Réutilisation des eaux usées épurées · 5. Pertes et rendement des réseaux · 6. Smart Water et transformation numérique · 7. Efficacité énergétique et ENR · 8. Économie circulaire et résilience hydrique · 9. Intégration industrielle et fabrication locale

## 5. Homepage copy (draft, FR)
- **H1:** "L'expertise marocaine de l'eau, réunie."
- **Sub:** "Opérateurs, industriels, ingénieurs et chercheurs : depuis 1997, l'AMEPA porte la voix du secteur de l'eau potable et de l'assainissement au Maroc et en Afrique."
- **CTAs:** "Devenir membre" · "Voir les événements"
- **Key figures (editable in Studio):** `1997` · `95+ membres` · `[X] événements/an` · `[X] pays partenaires`
- **Blocks:** Mot du Président · Nos domaines d'expertise · Agir ensemble (Adhérer · Participer · Coopérer)

## 6. Visual direction — "new gen" but institutional
- **Mood:** clean, calm, data-driven, confident (water utility × climate-tech), not NGO brochure.
- **Palette:** Deep ocean `#0B2A4A` · Water blue `#0E7CC2` · Aqua `#2EC4B6` · Sand `#F4EFE6` · White. Align with AMEPA logo first.
- **Type:** Headings *Manrope* or *Sora*, body *Inter*, Arabic *IBM Plex Sans Arabic*.
- **Signature:** animated wave line in hero, zellige-inspired pattern at 3–5% opacity, animated counters, Morocco + Africa map on International.
- **Motion:** light, respect `prefers-reduced-motion`.
- **Must-haves:** full **RTL Arabic** (use logical CSS: `ms-/me-`, `ps-/pe-`, `start/end` — never `left/right`), WCAG AA, Lighthouse 90+, mobile-first, `hreflang`.

## 7. Pictures
| Need | Source | Rule |
|---|---|---|
| Hero | Real AMEPA / member photo (desalination plant, STEP, water tower) or muted video loop | Ask ONEE / SRM comms — strongest option |
| Expertise cards, backgrounds | Unsplash via MCP (see §10) — queries: "water treatment plant", "desalination", "wastewater treatment aerial", "water pipeline", "reservoir", "Morocco water" | One blue colour grade, credits logged |
| People / events | AMEPA's own event photos | Rights/consent required |
| Icons | Lucide (one set only) | |
| Logos | Members & partners | Only with permission |

Never: stock photos presented as AMEPA facilities or members, AI images of "real" places or people, generic handshakes / glass-of-water clichés.

---

## 8. Stack — ONE project, JavaScript only
- **Next.js (App Router), JavaScript (`.js`/`.jsx`, no TypeScript)**, Tailwind CSS, `next-intl` (FR default, AR RTL, EN).
- **Sanity** as CMS, **Studio embedded at `/studio`** via `next-sanity` → one repo, one deploy.
- Plugins: `@sanity/document-internationalization` (FR/AR/EN per document), `@sanity/vision` (dev only).
- Images & PDFs stored in Sanity assets; rendered with `@sanity/image-url` + `next/image`.
- Forms (contact / adhésion / partenariat): Next.js route handler → email (Resend or SMTP) + saved as Sanity `submission` document so comms sees them in Studio.
- Caching: ISR + Sanity webhook → `revalidateTag` on publish (keeps API usage inside the free quota).
- Hosting: **Vercel**. Sanity + Vercel accounts created **under an AMEPA email**; developer added as a member.
- Sanity plan: **Free** to start (20 seats, 10k documents, 100 GB assets; only Administrator/Viewer roles, 3-day history). Upgrade to Growth only if Editor roles are needed.

### Setup commands
```bash
npx create-next-app@latest amepa --js --tailwind --app --eslint --src-dir
cd amepa
npx sanity@latest init          # choose: embed Studio in Next.js, route /studio, JavaScript
npm i next-intl @sanity/document-internationalization @sanity/image-url
```

### Folder structure
```
src/
  app/
    [locale]/            # fr | ar | en
      page.jsx           # Accueil
      amepa/  expertise/[slug]/  evenements/[slug]/  international/
      membres/  ressources/  opportunites/  actualites/[slug]/  contact/
    studio/[[...tool]]/page.jsx
    api/revalidate/route.js
    api/forms/route.js
  components/            # Header, Footer, Hero, StatCounter, DomainCard, EventCard, MemberCard...
  sanity/
    schemaTypes/         # one file per type (below)
    lib/client.js  lib/queries.js  lib/image.js
  i18n/                  # messages fr.json ar.json en.json (UI strings only)
public/images/           # static/fallback images + CREDITS.md
```

## 9. Sanity schemas (JavaScript) — content comms will edit
All translatable types get a hidden `language` field (managed by the i18n plugin). Every field gets a `description` in French so comms understand it.

```js
// src/sanity/schemaTypes/siteSettings.js  (singleton)
export default {
  name: 'siteSettings', title: 'Paramètres du site', type: 'document',
  fields: [
    { name: 'language', type: 'string', readOnly: true, hidden: true },
    { name: 'heroTitle', title: 'Titre principal (hero)', type: 'string' },
    { name: 'heroSubtitle', title: 'Sous-titre', type: 'text', rows: 3 },
    { name: 'heroImage', title: 'Image hero', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texte alternatif', type: 'string' }] },
    { name: 'keyFigures', title: 'Chiffres clés', type: 'array', of: [{ type: 'object',
      fields: [{ name: 'value', title: 'Valeur', type: 'string' }, { name: 'label', title: 'Libellé', type: 'string' }] }] },
    { name: 'presidentWord', title: 'Mot du Président', type: 'object', fields: [
      { name: 'name', type: 'string' }, { name: 'role', type: 'string' },
      { name: 'photo', type: 'image' }, { name: 'text', type: 'array', of: [{ type: 'block' }] } ] },
    { name: 'contact', title: 'Coordonnées', type: 'object', fields: [
      { name: 'address', type: 'text' }, { name: 'phone', type: 'string' }, { name: 'email', type: 'string' },
      { name: 'mapUrl', type: 'url' } ] },
    { name: 'socials', title: 'Réseaux sociaux', type: 'array', of: [{ type: 'object',
      fields: [{ name: 'platform', type: 'string' }, { name: 'url', type: 'url' }] }] },
  ],
}
```

```js
// src/sanity/schemaTypes/event.js
export default {
  name: 'event', title: 'Événements', type: 'document',
  fields: [
    { name: 'language', type: 'string', readOnly: true, hidden: true },
    { name: 'title', title: 'Titre', type: 'string', validation: r => r.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' }, validation: r => r.required() },
    { name: 'type', title: 'Type', type: 'string', options: { list: [
      'Congrès', 'Journée technique', 'Séminaire', 'Rencontre B2B', 'Webinaire', 'Formation', 'Visite technique', 'Salon'] } },
    { name: 'startDate', title: 'Date de début', type: 'datetime', validation: r => r.required() },
    { name: 'endDate', title: 'Date de fin', type: 'datetime' },
    { name: 'location', title: 'Lieu', type: 'string' },
    { name: 'cover', title: 'Image', type: 'image', options: { hotspot: true } },
    { name: 'summary', title: 'Résumé', type: 'text', rows: 3 },
    { name: 'body', title: 'Programme / description', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'speakers', title: 'Intervenants', type: 'array', of: [{ type: 'object',
      fields: [{ name: 'name', type: 'string' }, { name: 'role', type: 'string' }, { name: 'photo', type: 'image' }] }] },
    { name: 'registrationUrl', title: "Lien d'inscription", type: 'url' },
    { name: 'domains', title: 'Domaines liés', type: 'array', of: [{ type: 'reference', to: [{ type: 'domain' }] }] },
    { name: 'gallery', title: 'Photos (après événement)', type: 'array', of: [{ type: 'image' }] },
    { name: 'documents', title: 'Présentations / actes (PDF)', type: 'array', of: [{ type: 'file' }] },
  ],
  orderings: [{ title: 'Date', name: 'dateDesc', by: [{ field: 'startDate', direction: 'desc' }] }],
}
```

```js
// src/sanity/schemaTypes/member.js   (not translated — names are proper nouns)
export default {
  name: 'member', title: 'Membres', type: 'document',
  fields: [
    { name: 'name', title: 'Nom', type: 'string', validation: r => r.required() },
    { name: 'category', title: 'Catégorie', type: 'string', options: { list: [
      'Opérateur / SRM', 'Bureau d\'études et ingénierie', 'Entreprise de travaux', 'Industriel',
      'Laboratoire / organisme scientifique', 'Expert', 'Partenaire institutionnel', 'Partenaire international'] } },
    { name: 'logo', title: 'Logo (avec autorisation)', type: 'image' },
    { name: 'city', title: 'Ville', type: 'string' },
    { name: 'website', title: 'Site web', type: 'url' },
    { name: 'description', title: 'Description courte', type: 'text', rows: 3 },
    { name: 'isPartner', title: 'Afficher dans les partenaires', type: 'boolean', initialValue: false },
  ],
}
```

```js
// src/sanity/schemaTypes/publication.js
export default {
  name: 'publication', title: 'Publications', type: 'document',
  fields: [
    { name: 'language', type: 'string', readOnly: true, hidden: true },
    { name: 'title', title: 'Titre', type: 'string', validation: r => r.required() },
    { name: 'kind', title: 'Type', type: 'string', options: { list: [
      'Étude / rapport', 'Note technique', 'Guide', 'Présentation', 'Réglementation', 'Rapport d\'activité', 'Newsletter'] } },
    { name: 'date', title: 'Date', type: 'date' },
    { name: 'file', title: 'Fichier PDF', type: 'file', options: { accept: '.pdf' } },
    { name: 'cover', title: 'Couverture', type: 'image' },
    { name: 'summary', title: 'Résumé', type: 'text', rows: 4 },
    { name: 'domains', title: 'Domaines', type: 'array', of: [{ type: 'reference', to: [{ type: 'domain' }] }] },
    { name: 'membersOnly', title: 'Réservé aux membres', type: 'boolean', initialValue: false },
  ],
}
```

```js
// src/sanity/schemaTypes/post.js   (Actualités)
export default {
  name: 'post', title: 'Actualités', type: 'document',
  fields: [
    { name: 'language', type: 'string', readOnly: true, hidden: true },
    { name: 'title', title: 'Titre', type: 'string', validation: r => r.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'publishedAt', title: 'Date de publication', type: 'datetime' },
    { name: 'featured', title: 'À la une', type: 'boolean' },
    { name: 'cover', title: 'Image', type: 'image', options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Texte alternatif', type: 'string' }] },
    { name: 'excerpt', title: 'Chapeau', type: 'text', rows: 3 },
    { name: 'body', title: 'Contenu', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
  ],
}
```

Also create, same pattern:
- `domain` — title, slug, icon (Lucide name), image, intro, body, keyStakes (array of strings), order.
- `page` — generic institutional page (title, slug, body with blocks) for L'AMEPA, gouvernance, statuts, etc.
- `governanceMember` — name, role (Président, Vice-président, Trésorier…), organ (AG / CA / Bureau / Comité), photo, organisation, order.
- `opportunity` — title, kind (Appel d'offres, Marché, Financement, Partenariat), deadline, issuer, link, file, summary.
- `submission` — read-only in Studio: formType, name, organisation, email, phone, message, createdAt, status (Nouveau / Traité).

Studio structure: group sidebar as **Accueil & paramètres · Actualités · Événements · Expertise · Membres · Publications · Opportunités · Pages · Demandes reçues**.

## 10. Claude Code setup — skills & MCP servers

| Purpose | Tool | Install |
|---|---|---|
| Design quality (avoid generic AI look) | **frontend-design** (Anthropic plugin) | `/plugin marketplace add anthropics/claude-plugins-official` then `/plugin install frontend-design@claude-plugins-official` |
| Sanity schemas, GROQ, Studio, content ops | **Sanity plugin** (MCP + skills + slash commands) | `/plugin install sanity@claude-plugins-official` — or `npx sanity@latest mcp configure` + `npx skills add sanity-io/agent-toolkit` |
| Up-to-date docs (Next.js, next-intl, Tailwind) | **Context7 MCP** | `claude mcp add context7 -- npx -y @upstash/context7-mcp` |
| See & test the site in a real browser, screenshots, RTL check | **Playwright MCP** | `claude mcp add playwright -- npx -y @playwright/mcp@latest` |
| Search & download licensed photos | **Unsplash MCP** (unofficial) | `claude mcp add unsplash --env UNSPLASH_ACCESS_KEY=… --env UNSPLASH_APP_NAME=… -- npx -y @hanoak/unsplash-mcp-server` (free key at unsplash.com/developers) |
| Web research (AMEPA news, events, sector facts) | Built-in **WebSearch / WebFetch** | nothing to install |
| Image workflow rules for this project | **`site-images` skill** (custom, in this repo) | copy `.claude/skills/site-images/SKILL.md` |

Optional design/QA skills (gstack, if installed): `design-consultation` before coding (locks the design system), `design-review` after (visual QA pass).

**Security:** keep API keys in `.env.local` (git-ignored). Never commit Sanity tokens or the Unsplash key.

## 11. Build order
1. Next.js + Sanity embedded Studio + i18n skeleton (FR/AR/EN, RTL working from day 1).
2. Design tokens (Tailwind theme) + Header / Footer / layout.
3. All Sanity schemas + Studio sidebar structure + seed data (`[À CONFIRMER]` placeholders).
4. Homepage.
5. Événements, Membres directory, Ressources library (highest value).
6. Remaining pages, forms → `submission` + email.
7. Images via `site-images` skill.
8. Revalidation webhook, SEO (metadata, sitemap.xml, hreflang), accessibility & Lighthouse pass with Playwright.
9. Handoff (below).

## 12. Handoff to AMEPA comms
- Sanity + Vercel + domain under AMEPA-owned accounts; developer = member, not owner.
- Comms accounts in Sanity (Administrator on Free plan — schemas live in code, so they can't break the structure).
- Every field has a French `description`; write a 1-page **"Guide de mise à jour"** (add news, event, member, PDF; replace hero image; read form submissions).
- One 45-min training session, recorded.
- Written scope: content = comms; new features/design changes = quoted development request.
