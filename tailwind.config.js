/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chinese-red': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        'chinese-black': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        'gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'chinese': ['Noto Sans SC', 'sans-serif'],
        'chinese-serif': ['Noto Serif SC', 'serif'],
        'chinese-display': ['ZCOOL QingKe HuangYou', 'cursive'],
        'chinese-title': ['ZCOOL XiaoWei', 'serif'],
        'chinese-accent': ['ZCOOL KuaiLe', 'cursive'],
        'chinese-handwriting': ['Ma Shan Zheng', 'cursive'],
        'chinese-brush': ['Zhi Mang Xing', 'cursive'],
        'chinese-calligraphy': ['Liu Jian Mao Cao', 'cursive'],
      },
      backgroundImage: {
        'chinese-pattern': "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.03) 0%, transparent 50%)",
      }
    },
  },
  plugins: [],
}

