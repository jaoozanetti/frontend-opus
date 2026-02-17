import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Configuration
 * 
 * Configurado para suportar:
 * - Dark mode (classe 'dark')
 * - CSS variables dinâmicas para white-label
 * - Temas customizados via tailwind.config
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Os estilos primários/secundários virão de CSS variables
        // Exemplo: var(--color-primary)
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
} satisfies Config
