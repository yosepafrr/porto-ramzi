// Konten opsional boleh kosong. Hanya tautan web asli yang menjadi anchor aktif.
export function webUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return ''
  try {
    const url = new URL(value)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export function newestFirst(items = [], key = 'startDate') {
  return [...items].sort((a, b) => String(b[key] || '').localeCompare(String(a[key] || '')))
}

export function socialLinks(contact = {}) {
  return [
    { id: 'instagram', label: 'Instagram', url: contact.instagram },
    { id: 'linkedin', label: 'LinkedIn', url: contact.linkedin },
    { id: 'github', label: 'GitHub', url: contact.github },
    ...(contact.otherSocials || []),
  ].map((link) => ({ ...link, url: webUrl(link.url) })).filter((link) => link.url)
}
