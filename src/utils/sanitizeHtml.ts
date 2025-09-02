// src/utils/sanitizeHtml.ts
import DOMPurify from 'dompurify'

/**
 * Strenges Sanitizing für Rich-Text aus dem Editor
 * - blockt event-Handler, Skripte, gefährliche Tags
 * - erlaubt Inline-Farben via style-Attribut
 * - härtet Links (rel/target) nach
 */

const ALLOWED_TAGS = [
  'a','b','i','em','strong','u','s','sub','sup',
  'p','br','span','code','pre','mark','blockquote','hr',
  'ul','ol','li',
  'h1','h2','h3','h4','h5','h6',
  'table','thead','tbody','tr','th','td'
]

const ALLOWED_ATTR = ['href','title','target','rel','class','style']

// Nur http/https/mailto/tel explizit zulassen
const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i

export function sanitizeHtml(html: string): string {
  const clean = DOMPurify.sanitize(html ?? '', {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Gefährliche Container-Tags
    FORBID_TAGS: ['style','script','iframe','object','embed','link','meta','form','input','button'],
    // Event-Attribute werden von DOMPurify standardmäßig entfernt
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: false,
    ALLOWED_URI_REGEXP,
  })

  // Link-Härtung: rel/target konsistent setzen
  if (typeof window !== 'undefined') {
    const container = document.createElement('div')
    container.innerHTML = clean
    container.querySelectorAll('a[href]').forEach((a) => {
      const href = a.getAttribute('href') || ''
      a.setAttribute('rel', 'noopener noreferrer nofollow')
      if (/^https?:\/\//i.test(href)) a.setAttribute('target', '_blank')
      else a.removeAttribute('target')
    })
    return container.innerHTML
  }

  return clean
}

export function isSanitizedHtmlEmpty(html: string): boolean {
  const clean = sanitizeHtml(html)
  const div = document.createElement('div')
  div.innerHTML = clean
  return (div.textContent || '').trim() === ''
}
