export default {
  dark: {
    background: '#0A133B',           // Deep Sea Glass primary background
    backgroundDeep: '#0A133B',
    backgroundElevated: '#002857',
    backgroundGradient: [
      '#0A133B',                      // bgColor - deepest blue
      '#002857',                      // lightColor1 - gradient start
      '#004b93',                      // lightColor2 - gradient midpoint
      '#0A76AF',                      // lightColor3 - accent
    ],

    glass: 'rgba(255, 255, 255, 0.03)',          // Spec: glassmorphism background
    glassBorder: 'rgba(255, 255, 255, 0.1)',     // Spec: subtle border
    glassHighlight: 'rgba(255, 255, 255, 0.1)',
    glassWrapper: 'rgba(255, 255, 255, 0.03)',
    glassShadow: 'rgba(0, 0, 0, 0.45)',

    primary: '#0A76AF',                          // Spec: lightColor3 - accent/active state
    primaryLight: '#4A9ACF',
    primaryDark: '#005580',
    primaryGlow: 'rgba(10, 118, 175, 0.9)',

    accent: '#0A76AF',                           // Same as primary for consistency
    accentSecondary: '#004b93',                  // lightColor2
    accentGlow: 'rgba(10, 118, 175, 0.85)',

    text: '#F5F7FA',                             // Spec: silverLight - primary text
    textSecondary: '#C8CDD5',                    // Spec: silverMid - secondary text
    textMuted: '#8A92A0',                        // Spec: silverDark - tertiary text

    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ff5757',

    overlay: 'rgba(7, 10, 15, 0.96)',
    divider: 'rgba(230, 238, 255, 0.16)',

    silver: '#eeeeee',
    silverLight: '#f8f8f8',
    silverDark: '#d0d0d0',
    silverMid: '#e0e0e0',
    silverGlow: 'rgba(238, 238, 238, 0.75)',

    liquidGradient: ['#f8f8f8', '#eeeeee', '#e0e0e0', '#eeeeee'],
    liquidGradientAlt: ['#f8f8f8', '#eeeeee', '#e0e0e0'],
    edgeGradient: ['#f8f8f8', '#eeeeee', '#d0d0d0', '#eeeeee', '#f8f8f8'],
    glowGradient: ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.35)', 'rgba(255, 255, 255, 0)'],
  },
};
