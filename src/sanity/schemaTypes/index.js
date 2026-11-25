import domain from './domain'
import event from './event'
import governanceMember from './governanceMember'
import member from './member'
import opportunity from './opportunity'
import page from './page'
import partnerCountry from './partnerCountry'
import post from './post'
import publication from './publication'
import siteSettings from './siteSettings'
import submission from './submission'
import video from './video'

export const schemaTypes = [siteSettings, post, event, domain, member, publication, video, opportunity, page, governanceMember, partnerCountry, submission]

export const TRANSLATED_TYPES = ['siteSettings', 'post', 'event', 'domain', 'publication', 'video', 'opportunity', 'page']
