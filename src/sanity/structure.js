import { BookOpen, Building2, CalendarDays, Compass, FileText, Globe, Handshake, Inbox, Landmark, Newspaper, Settings, Video } from 'lucide-react'

const LANGS = [['fr', 'Français'], ['ar', 'العربية'], ['en', 'English']]

// Liste d'un type, avec un sous-menu par langue.
const translated = (S, type, title, icon, orderings) =>
  S.listItem().id(`${type}-by-lang`).title(title).icon(icon).child(
    S.list().id(`${type}-langs`).title(title).items(LANGS.map(([id, label]) =>
      S.listItem().id(`${type}-${id}`).title(label).child(
        S.documentList().id(`${type}-${id}-list`).title(`${title} (${label})`).schemaType(type).apiVersion('2025-01-01')
          .filter('_type == $type && language == $language').params({ type, language: id })
          .defaultOrdering(orderings)
          .initialValueTemplates([S.initialValueTemplateItem(`${type}-${id}`)])
      ))))

const submissions = (S, id, status, title) =>
  S.listItem().id(id).title(title).child(
    S.documentList().id(`${id}-list`).title(title).schemaType('submission').apiVersion('2025-01-01')
      .filter('_type == "submission" && status == $status').params({ status })
      .defaultOrdering([{ field: 'createdAt', direction: 'desc' }])
      .initialValueTemplates([]))

export const structure = (S) =>
  S.list().id('root').title('Contenu du site').items([
    S.listItem().id('settings').title('Accueil & paramètres').icon(Settings).child(
      S.list().id('settings-langs').title('Accueil & paramètres').items(LANGS.map(([id, label]) =>
        S.listItem().id(`settings-${id}`).title(label).child(
          S.document().schemaType('siteSettings').documentId(`siteSettings-${id}`).title(`Paramètres (${label})`)
            .initialValueTemplate(`siteSettings-${id}`))))),
    S.divider(),
    translated(S, 'post', 'Actualités', Newspaper, [{ field: 'publishedAt', direction: 'desc' }]),
    translated(S, 'event', 'Événements', CalendarDays, [{ field: 'startDate', direction: 'desc' }]),
    translated(S, 'domain', 'Expertise', Compass, [{ field: 'order', direction: 'asc' }]),
    S.documentTypeListItem('member').title('Membres').icon(Building2),
    S.listItem().id('publications').title('Publications').icon(BookOpen).child(
      S.list().id('publications-list').title('Publications').items([
        translated(S, 'publication', 'Bibliothèque', BookOpen, [{ field: 'date', direction: 'desc' }]),
        translated(S, 'video', 'Vidéothèque', Video, [{ field: 'date', direction: 'desc' }]),
      ])),
    translated(S, 'opportunity', 'Opportunités', Handshake, [{ field: 'deadline', direction: 'desc' }]),
    S.listItem().id('pages').title('Pages').icon(FileText).child(
      S.list().id('pages-list').title('Pages').items([
        translated(S, 'page', 'Pages', FileText, [{ field: 'title', direction: 'asc' }]),
        S.documentTypeListItem('governanceMember').title('Gouvernance').icon(Landmark),
        S.documentTypeListItem('partnerCountry').title('Pays partenaires').icon(Globe),
      ])),
    S.divider(),
    S.listItem().id('submissions').title('Demandes reçues').icon(Inbox).child(
      S.list().id('submissions-list').title('Demandes reçues').items([
        submissions(S, 'submissions-new', 'Nouveau', 'Nouvelles'),
        submissions(S, 'submissions-done', 'Traité', 'Traitées'),
      ])),
  ])
