/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          'primary': '#3b82f6',
          'primary-focus': '#2563eb',
          'primary-content': '#ffffff',
          'secondary': '#14b8a6',
          'secondary-focus': '#0d9488',
          'secondary-content': '#ffffff',
          'accent': '#a855f7',
          'accent-focus': '#9333ea',
          'accent-content': '#ffffff',
          'neutral': '#374151',
          'neutral-focus': '#1f2937',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f3f4f6',
          'base-300': '#e5e7eb',
          'base-content': '#1f2937',
          'info': '#3abff8',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
        },
        dark: {
          'primary': '#3b82f6',
          'primary-focus': '#2563eb',
          'primary-content': '#ffffff',
          'secondary': '#14b8a6',
          'secondary-focus': '#0d9488',
          'secondary-content': '#ffffff',
          'accent': '#a855f7',
          'accent-focus': '#9333ea',
          'accent-content': '#ffffff',
          'neutral': '#1f2937',
          'neutral-focus': '#111827',
          'neutral-content': '#ffffff',
          'base-100': '#1f2937',
          'base-200': '#111827',
          'base-300': '#0f172a',
          'base-content': '#f3f4f6',
          'info': '#3abff8',
          'success': '#22c55e',
          'warning': '#f59e0b',
          'error': '#ef4444',
        }
      }
    ]
  }
}

