export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  numeric: {
    fontSize: 32,
    fontWeight: '700' as const,
  },
} as const;
