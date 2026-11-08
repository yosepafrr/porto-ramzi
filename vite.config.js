import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { portfolioData } from './src/data/portfolioData.js'

// Escape nilai yang diedit pemilik portfolio sebelum dimasukkan ke HTML.
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character])

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'portfolio-metadata',
      transformIndexHtml(html) {
        return html
          .replace('__PORTFOLIO_TITLE__', () => escapeHtml(portfolioData.seo.title))
          .replace('__PORTFOLIO_DESCRIPTION__', () => escapeHtml(portfolioData.seo.description))
      },
    },
  ],
})
