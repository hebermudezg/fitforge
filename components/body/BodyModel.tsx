import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Body, { type ExtendedBodyPart, type Slug } from 'react-native-body-highlighter';
import type { BodyPartKey, MuscleKey } from '@/types/bodyParts';
import { BODY_PARTS, MUSCLE_PARTS } from '@/types/bodyParts';
import type { Measurement } from '@/types/models';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { Layout } from '@/constants/Layout';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate } from '@/utils/formatting';

// 1:1 mapping — each muscle key maps to exactly the right SVG slug
const MUSCLE_TO_SLUG: Record<MuscleKey, Slug> = {
  neck: 'neck',
  trapezius: 'trapezius',
  deltoids: 'deltoids',
  chest: 'chest',
  biceps: 'biceps',
  triceps: 'triceps',
  forearms: 'forearm',
  abs: 'abs',
  obliques: 'obliques',
  upperBack: 'upper-back',
  lowerBack: 'lower-back',
  gluteal: 'gluteal',
  quadriceps: 'quadriceps',
  hamstring: 'hamstring',
  adductors: 'adductors',
  calves: 'calves',
};

// Reverse: slug → our muscle key
const SLUG_TO_MUSCLE: Record<string, MuscleKey> = {};
for (const [key, slug] of Object.entries(MUSCLE_TO_SLUG)) {
  SLUG_TO_MUSCLE[slug] = key as MuscleKey;
}

// All interactive slugs
const ALL_SLUGS = new Set(Object.values(MUSCLE_TO_SLUG));

interface BodyModelProps {
  gender: 'male' | 'female';
  side?: 'front' | 'back';
  onBodyPartPress: (key: BodyPartKey) => void;
  selectedPart?: BodyPartKey | null;
  measurements?: Partial<Record<BodyPartKey, Measurement>>;
  unitSystem?: 'metric' | 'imperial';
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function BodyModel({
  gender,
  side = 'front',
  onBodyPartPress,
  selectedPart,
  measurements = {},
  unitSystem = 'metric',
}: BodyModelProps) {
  const { colors, isDark } = useTheme();
  const { t, lang } = useI18n();
  const containerRef = useRef<View>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activePart = selectedPart || (hoveredSlug ? SLUG_TO_MUSCLE[hoveredSlug] : null) as BodyPartKey | null;

  // Build highlight data
  const bodyData: ExtendedBodyPart[] = useMemo(() => {
    const data: ExtendedBodyPart[] = [];

    // Measured muscles — light highlight
    for (const [key, measurement] of Object.entries(measurements)) {
      const slug = MUSCLE_TO_SLUG[key as MuscleKey];
      if (!slug || !measurement) continue;
      data.push({ slug, intensity: 1, color: colors.accent + '40' });
    }

    // Active/selected muscle — strong highlight
    if (activePart) {
      const slug = MUSCLE_TO_SLUG[activePart as MuscleKey];
      if (slug) {
        const idx = data.findIndex((d) => d.slug === slug);
        if (idx >= 0) data.splice(idx, 1);
        data.push({ slug, intensity: 2, color: colors.accent });
      }
    }

    return data;
  }, [measurements, activePart, colors.accent]);

  // Native handler (iOS/Android)
  const handleNativePress = useCallback((part: ExtendedBodyPart) => {
    if (part.slug) {
      const key = SLUG_TO_MUSCLE[part.slug];
      if (key) onBodyPartPress(key);
    }
  }, [onBodyPartPress]);

  // Web click handler — inject DOM listeners since onPress doesn't work on web SVG
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const timer = setTimeout(() => {
      // Find all SVG path elements within our container
      const container = document.querySelector('[data-body-model]');
      if (!container) return;

      const paths = container.querySelectorAll('path[id]');
      const handlers: Array<{ el: Element; handler: (e: Event) => void }> = [];

      paths.forEach((path) => {
        const slug = path.getAttribute('id');
        if (!slug || !ALL_SLUGS.has(slug as Slug)) return;

        const handler = (e: Event) => {
          e.stopPropagation();
          const key = SLUG_TO_MUSCLE[slug];
          if (key) {
            setHoveredSlug(slug);
            onBodyPartPress(key);
          }
        };

        path.addEventListener('click', handler);
        // Add hover effect
        path.addEventListener('mouseenter', () => setHoveredSlug(slug));
        path.addEventListener('mouseleave', () => setHoveredSlug(null));

        // Make paths look clickable
        (path as HTMLElement).style.cursor = 'pointer';
        (path as HTMLElement).style.transition = 'opacity 0.2s';

        handlers.push({ el: path, handler });
      });

      return () => {
        handlers.forEach(({ el, handler }) => {
          el.removeEventListener('click', handler);
        });
      };
    }, 500); // Wait for SVG to render

    return () => clearTimeout(timer);
  }, [onBodyPartPress, side, gender]);

  // Tooltip info for active part
  const activePartDef = activePart ? BODY_PARTS[activePart] : null;
  const activeMeasurement = activePart ? measurements[activePart] : null;
  const activeDisplayValue = activeMeasurement && activePartDef
    ? convertValue(activeMeasurement.value, activePartDef.unit, unitSystem)
    : null;
  const activeDisplayUnit = activePartDef ? getDisplayUnit(activePartDef.unit, unitSystem) : '';
  const activeLabel = activePart ? ((t.bodyParts as any)[activePart] || activePartDef?.label) : null;

  const scale = Math.min(SCREEN_WIDTH * 0.0026, 1.4);

  return (
    <View style={styles.container}>
      {/* Muscle info tooltip */}
      <View style={[styles.tooltip, { backgroundColor: colors.surface, borderColor: activePart ? colors.accent : colors.border }]}>
        {activePart && activeLabel ? (
          <>
            <View style={styles.tooltipRow}>
              <View style={[styles.tooltipDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.tooltipName, { color: colors.textPrimary }]}>{activeLabel}</Text>
            </View>
            {activeDisplayValue !== null ? (
              <View style={styles.tooltipRow}>
                <Text style={[styles.tooltipValue, { color: colors.accent }]}>
                  {activeDisplayValue.toFixed(1)} {activeDisplayUnit}
                </Text>
                {activeMeasurement && (
                  <Text style={[styles.tooltipDate, { color: colors.textMuted }]}>
                    · {getRelativeDate(activeMeasurement.measuredAt)}
                  </Text>
                )}
              </View>
            ) : (
              <Text style={[styles.tooltipHint, { color: colors.textMuted }]}>
                {lang === 'es' ? 'Sin medida registrada' : 'No measurement recorded'}
              </Text>
            )}
            <Text style={[styles.tooltipAction, { color: colors.accent }]}>
              {lang === 'es' ? 'Toca de nuevo para medir' : 'Tap again to measure'}
            </Text>
          </>
        ) : (
          <Text style={[styles.tooltipHint, { color: colors.textMuted }]}>
            {t.measure.tapMuscle}
          </Text>
        )}
      </View>

      {/* Body SVG */}
      <View
        ref={containerRef}
        style={styles.bodyWrap}
        // @ts-ignore — web-only attribute for DOM query
        dataSet={{ bodyModel: 'true' }}
      >
        <Body
          data={bodyData}
          gender={gender}
          side={side}
          scale={scale}
          onBodyPartPress={handleNativePress}
          colors={[
            isDark ? '#1E1E1E' : '#E0E0E0',
            colors.accent + '50',
            colors.accent,
          ]}
          border={isDark ? '#444' : '#BBB'}
          defaultFill={isDark ? '#1E1E1E' : '#EAEAEA'}
          defaultStroke={isDark ? '#444' : '#CCC'}
          defaultStrokeWidth={0.6}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 8,
    minWidth: 220,
    alignItems: 'center',
    gap: 4,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  tooltipName: {
    ...Typography.h3,
  },
  tooltipValue: {
    ...Typography.body,
    fontWeight: '700',
  },
  tooltipDate: {
    ...Typography.caption,
  },
  tooltipHint: {
    ...Typography.bodySmall,
  },
  tooltipAction: {
    ...Typography.caption,
    fontWeight: '600',
    marginTop: 2,
  },
  bodyWrap: {
    alignItems: 'center',
  },
});
