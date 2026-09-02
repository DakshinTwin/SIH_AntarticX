import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'iceberg': '#BCE1F4',
        'glacier': '#AEE4E5',
        'frost': '#B5CBF0',
        'primary-text': '#2D3436',
        'muted-text': '#6B7280',
        'panel': '#F8F9FA',
        'border-color': '#E5E7EB',
        'healthy': '#10B981',
        'warning': '#F59E0B',
        'critical': '#EF4444',
        'simulation': '#8B5CF6',
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
