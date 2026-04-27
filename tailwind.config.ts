import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          sky:        '#00BFFF',
          'sky-dark': '#0099CC',
          'sky-light':'#E0F7FF',
          navy:       '#0D0D0D',
          'navy-2':   '#141414',
          'navy-3':   '#1C1C1C',
          cream:      '#F0EDE8',
          'cream-2':  '#E8E4DF',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['5.5rem',  { lineHeight: '1.0',  letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-lg': ['4rem',    { lineHeight: '1.05', letterSpacing: '-0.025em',fontWeight: '800' }],
        'display-md': ['3rem',    { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2.25rem', { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xs': ['1.75rem', { lineHeight: '1.15', letterSpacing: '-0.015em',fontWeight: '700' }],
      },
      boxShadow: {
        'sky-glow':    '0 0 40px rgba(0,191,255,0.3)',
        'sky-glow-sm': '0 0 20px rgba(0,191,255,0.15)',
        'card':        '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
        'card-hover':  '0 4px 8px rgba(0,0,0,0.06), 0 16px 32px rgba(0,0,0,0.1)',
        'dark-card':   '0 2px 4px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
      },
      animation: {
        'fade-up':   'fadeUp 0.5s ease forwards',
        'fade-in':   'fadeIn 0.4s ease forwards',
        'marquee':   'marquee 28s linear infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [typography, forms],
}

export default config