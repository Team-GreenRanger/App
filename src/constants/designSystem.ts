export const DESIGN_SYSTEM = {
  spacing: {
    xs: 'px-3 py-2',
    sm: 'px-4 py-3', 
    md: 'px-6 py-4',
    lg: 'px-6 py-6',
    xl: 'px-8 py-8'
  },
  pageContainer: {
    base: 'min-h-screen bg-gray-50',
    withNav: 'pb-20',
    maxWidth: 'max-w-md mx-auto'
  },
  header: {
    base: 'bg-white px-6 pt-12 pb-6',
    section: 'bg-white px-6 py-6'
  },
  card: {
    base: 'bg-white rounded-2xl border-0',
    padding: 'p-6',
    margin: 'mb-4',
    interactive: 'hover:shadow-lg transition-all duration-300 cursor-pointer',
    shadow: 'shadow-sm hover:shadow-md transition-shadow duration-200'
  },
  button: {
    primary: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-800 rounded-xl px-6 py-4 font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl px-6 py-4 font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-600 rounded-xl px-6 py-4 font-semibold transition-all duration-200'
  },
  text: {
    title: 'text-2xl font-bold text-gray-900',
    subtitle: 'text-lg font-semibold text-gray-800',
    body: 'text-base text-gray-700',
    caption: 'text-sm text-gray-500'
  },
  colors: {
    primary: {
      50: 'bg-green-50',
      100: 'bg-green-100',
      500: 'bg-green-500',
      600: 'bg-green-600'
    },
    gray: {
      50: 'bg-gray-50',
      100: 'bg-gray-100',
      200: 'bg-gray-200'
    }
  },
  animations: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    bounce: 'animate-bounce-gentle'
  },
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full'
  },
  shadows: {
    card: 'shadow-sm hover:shadow-md transition-shadow duration-200',
    modal: 'shadow-2xl',
    none: 'shadow-none'
  }
} as const;

export const TOSS_STYLE = {
  cardGradient: 'bg-gradient-to-br from-white to-gray-50',
  borderSubtle: 'border border-gray-100',
  textPrimary: 'text-gray-900 font-semibold',
  textSecondary: 'text-gray-600',
  textMuted: 'text-gray-500',
  focusRing: 'focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none',
  buttonPrimary: 'bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform active:scale-95',
  buttonSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform active:scale-95',
  inputField: 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors',
  skeleton: 'bg-gray-200 animate-pulse rounded'
} as const;