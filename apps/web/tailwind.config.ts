import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--color-bg-base)',
          surface: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-elevated)',
          overlay: 'var(--color-bg-overlay)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          default: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dim: 'var(--color-accent-dim)',
          border: 'var(--color-accent-border)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          dim: 'var(--color-success-dim)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          dim: 'var(--color-warning-dim)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          dim: 'var(--color-danger-dim)',
        },
        domain: {
          dsa: 'var(--color-domain-dsa)',
          systemDesign: 'var(--color-domain-systemdesign)',
          backend: 'var(--color-domain-backend)',
          conceptual: 'var(--color-domain-conceptual)',
          behavioural: 'var(--color-domain-behavioural)',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        title: ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        heading: ['17px', { lineHeight: '1.4', fontWeight: '500' }],
        body: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        label: ['12px', { lineHeight: '1.4', fontWeight: '500' }],
        caption: ['11px', { lineHeight: '1.4', fontWeight: '400' }],
        code: ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        score: ['42px', { lineHeight: '1', fontWeight: '500' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px',
      },
      animation: {
        'page-enter': 'pageEnter 200ms ease-out',
        'modal-enter': 'modalEnter 180ms ease-out',
        'toast-enter': 'toastEnter 250ms ease-out',
        'toast-exit': 'toastExit 250ms ease-in',
        'pulse-ring': 'pulseRing 2000ms ease-in-out infinite',
        'score-fill': 'scoreFill 800ms ease-in-out',
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        pageEnter: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        modalEnter: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        toastEnter: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        toastExit: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.15)', opacity: '0.6' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scoreFill: {
          '0%': { 'stroke-dashoffset': '251' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
