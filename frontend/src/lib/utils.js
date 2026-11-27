import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Strip diacritics (e.g., ñ -> n) and lowercase for accent-insensitive search. */
export function normalizeText(str = '') {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/** Check if target matches query with accent-insensitivity and 1-char typo forgiveness. */
export function fuzzyMatch(target = '', query = '') {
  const q = normalizeText(query)
  if (!q) return true
  const t = normalizeText(target)
  if (t.includes(q)) return true
  if (q.length < 4) return false

  // Allow 1-character edit distance against each whitespace token
  const tokens = t.split(/\s+/)
  return tokens.some((tok) => {
    if (Math.abs(tok.length - q.length) > 1) return false
    let diffs = 0
    let i = 0
    let j = 0
    while (i < tok.length && j < q.length) {
      if (tok[i] === q[j]) {
        i++
        j++
      } else {
        diffs++
        if (diffs > 1) return false
        if (tok.length > q.length) i++
        else if (q.length > tok.length) j++
        else {
          i++
          j++
        }
      }
    }
    if (i < tok.length || j < q.length) diffs++
    return diffs <= 1
  })
}

/** Accept 09171234567, +63 917 123 4567, 0917-123-4567 -> normalized "0917 123 4567". */
export function normalizePhone(raw = '') {
  const digits = String(raw).replace(/\D/g, '')
  let local = digits
  if (digits.startsWith('63') && digits.length >= 12) {
    local = '0' + digits.slice(2, 12)
  } else if (digits.startsWith('9') && digits.length === 10) {
    local = '0' + digits
  }
  if (local.length === 11 && local.startsWith('09')) {
    return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7, 11)}`
  }
  return null
}

/** Accept "₱900", "900", "900.00", "1,200" -> formatted "900.00". */
export function normalizeAmount(raw = '') {
  const cleaned = String(raw).replace(/[₱,\s]/g, '')
  const num = Number(cleaned)
  if (!Number.isFinite(num) || num <= 0) return null
  return num.toFixed(2)
}

/** Accept "11-7", "11 7", "11–7" -> { yours, theirs, formatted, won }. */
export function parseScoreInput(raw = '') {
  const match = String(raw)
    .trim()
    .match(/^(\d{1,2})\s*[-–—:\s]\s*(\d{1,2})$/)
  if (!match) return null
  const yours = Number(match[1])
  const theirs = Number(match[2])
  if (yours > 30 || theirs > 30) return null
  return {
    yours,
    theirs,
    formatted: `${yours}–${theirs}`,
    won: yours >= theirs,
  }
}

/** Download a simple .ics calendar invite for bookings or tournaments. */
export function downloadIcsEvent({ title, description, location }) {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PickleStack NCPA//EN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'DTSTART:20261009T090000Z',
    'DTEND:20261009T100000Z',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  a.click()
  URL.revokeObjectURL(url)
}
