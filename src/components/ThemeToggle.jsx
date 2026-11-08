import { Moon, Sun } from 'lucide-react'
import useTheme from '../hooks/useTheme.js'
import { portfolioData } from '../data/portfolioData.js'

export default function ThemeToggle({ labels = portfolioData.navigation.theme }) {
  const { theme, toggleTheme } = useTheme()
  const label = theme === 'dark' ? labels.toLight : labels.toDark
  const Icon = theme === 'dark' ? Sun : Moon
  return <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={label} title={label} aria-pressed={theme === 'light'}>
    <Icon size={18} strokeWidth={1.6} aria-hidden="true" />
  </button>
}
