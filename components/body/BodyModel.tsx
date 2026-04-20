import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Body, { type ExtendedBodyPart, type Slug } from 'react-native-body-highlighter';
import type { BodyPartKey, MuscleKey } from '@/types/bodyParts';
import { BODY_PARTS } from '@/types/bodyParts';
import type { Measurement } from '@/types/models';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/i18n';
import { Typography } from '@/constants/Typography';
import { convertValue, getDisplayUnit } from '@/utils/conversions';
import { getRelativeDate } from '@/utils/formatting';
import { MUSCLE_RANGES, getMuscleIntensity } from '@/constants/muscleRanges';

// 1:1 mapping muscle → SVG slug
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

const SLUG_TO_MUSCLE: Record<string, MuscleKey> = {};
for (const [key, slug] of Object.entries(MUSCLE_TO_SLUG)) {
  SLUG_TO_MUSCLE[slug] = key as MuscleKey;
}

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

/**
 * Calculate scale factor for a muscle based on measurement vs. average range
 * Returns 0.92 (below average) to 1.15 (very muscular)
 */
function getMuscleScale(muscle: MuscleKey, value: number, gender: 'male' | 'female'): number {
  const range = MUSCLE_RANGES[muscle];
  if (!range) return 1.0;
  const [low, avg, high] = range[gender];
  // Normalize: 0 = low, 0.5 = avg, 1.0 = high
  const normalized = Math.max(0, Math.min(1, (value - low) / (high - low)));
  // Scale: 0.92 at low, 1.0 at avg, 1.15 at high
  return 0.92 + normalized * 0.23;
}

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
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activePart = selectedPart || (hoveredSlug ? SLUG_TO_MUSCLE[hoveredSlug] : null) as BodyPartKey | null;

  // Calculate overall muscularity for body scale
  const overallMuscularity = useMemo(() => {
    let total = 0, count = 0;
    for (const [key, m] of Object.entries(measurements)) {
      const muscleKey = key as MuscleKey;
      if (!MUSCLE_TO_SLUG[muscleKey] || !m) continue;
      const intensity = getMuscleIntensity(muscleKey, (m as any).value, gender);
      total += intensity;
      count++;
    }
    return count > 0 ? total / count : 1.5;
  }, [measurements, gender]);

  // Body scale: 0.95 for beginner, 1.0 normal, 1.08 muscular
  const bodyScale = useMemo(() => {
    const base = Math.min(SCREEN_WIDTH * 0.0026, 1.4);
    const muscleFactor = 0.92 + (overallMuscularity / 3) * 0.16;
    return base * muscleFactor;
  }, [overallMuscularity]);

  // Build highlight data — strokeWidth varies by muscle size
  const bodyData: ExtendedBodyPart[] = useMemo(() => {
    const data: ExtendedBodyPart[] = [];

    for (const [key, slug] of Object.entries(MUSCLE_TO_SLUG)) {
      const m = measurements[key as BodyPartKey];
      if (!m) continue;
      const intensity = getMuscleIntensity(key as MuscleKey, (m as any).value, gender);
      // Color: beginner=subtle, intermediate=medium, advanced=vivid
      const colorMap = [colors.accent + '25', colors.accent + '55', colors.accent + 'CC'];
      // StrokeWidth: bigger muscles = thicker outline = looks bigger
      const strokeMap = [0.5, 1.2, 2.5];
      data.push({
        slug,
        intensity,
        color: colorMap[intensity - 1],
        styles: {
          strokeWidth: strokeMap[intensity - 1],
          stroke: intensity === 3 ? colors.accent : isDark ? '#555' : '#BBB',
        },
      });
    }

    // Selected part — full accent
    if (activePart) {
      const slug = MUSCLE_TO_SLUG[activePart as MuscleKey];
      if (slug) {
        const idx = data.findIndex((d) => d.slug === slug);
        if (idx >= 0) data.splice(idx, 1);
        data.push({ slug, intensity: 3, color: colors.accent });
      }
    }

    return data;
  }, [measurements, activePart, colors.accent, gender]);

  const handleNativePress = useCallback((part: ExtendedBodyPart) => {
    if (part.slug) {
      const key = SLUG_TO_MUSCLE[part.slug];
      if (key) onBodyPartPress(key);
    }
  }, [onBodyPartPress]);

  // Web: inject click handlers + SCALE TRANSFORMS based on measurements
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const timer = setTimeout(() => {
      const container = document.querySelector('[data-body-model]');
      if (!container) return;

      const svgEl = container.querySelector('svg');
      if (!svgEl) return;

      const paths = svgEl.querySelectorAll('path[id]');
      const cleanups: (() => void)[] = [];

      paths.forEach((path) => {
        const slug = path.getAttribute('id');
        if (!slug || !ALL_SLUGS.has(slug as Slug)) return;

        const muscleKey = SLUG_TO_MUSCLE[slug];

        // === SHAPE CHANGE: Scale muscle paths based on measurements ===
        const m = measurements[muscleKey];
        if (m && muscleKey) {
          const scale = getMuscleScale(muscleKey, m.value, gender);
          // Get path bounding box for transform-origin
          const bbox = (path as SVGPathElement).getBBox();
          const cx = bbox.x + bbox.width / 2;
          const cy = bbox.y + bbox.height / 2;
          (path as HTMLElement).style.transformOrigin = `${cx}px ${cy}px`;
          (path as HTMLElement).style.transform = `scale(${scale})`;
          (path as HTMLElement).style.transition = 'transform 0.5s ease';
        }

        // Click handler
        const clickHandler = (e: Event) => {
          e.stopPropagation();
          if (muscleKey) {
            setHoveredSlug(slug);
            onBodyPartPress(muscleKey);
          }
        };
        const enterHandler = () => setHoveredSlug(slug);
        const leaveHandler = () => setHoveredSlug(null);

        path.addEventListener('click', clickHandler);
        path.addEventListener('mouseenter', enterHandler);
        path.addEventListener('mouseleave', leaveHandler);
        (path as HTMLElement).style.cursor = 'pointer';

        cleanups.push(() => {
          path.removeEventListener('click', clickHandler);
          path.removeEventListener('mouseenter', enterHandler);
          path.removeEventListener('mouseleave', leaveHandler);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    }, 600);

    return () => clearTimeout(timer);
  }, [onBodyPartPress, side, gender, measurements]);

  // Tooltip
  const activePartDef = activePart ? BODY_PARTS[activePart] : null;
  const activeMeasurement = activePart ? measurements[activePart] : null;
  const activeDisplayValue = activeMeasurement && activePartDef
    ? convertValue(activeMeasurement.value, activePartDef.unit, unitSystem)
    : null;
  const activeDisplayUnit = activePartDef ? getDisplayUnit(activePartDef.unit, unitSystem) : '';
  const activeLabel = activePart ? ((t.bodyParts as any)[activePart] || activePartDef?.label) : null;

  // Intensity label
  const activeIntensity = activePart && activeMeasurement
    ? getMuscleIntensity(activePart as MuscleKey, activeMeasurement.value, gender)
    : 0;
  const intensityLabels: Record<string, Record<number, string>> = {
    en: { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' },
    es: { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' },
  };

  const scale = bodyScale;

  return (
    <View style={styles.container}>
      {/* Tooltip */}
      <View style={[styles.tooltip, {
        backgroundColor: colors.surface,
        borderColor: activePart ? colors.accent : colors.border,
      }]}>
        {activePart && activeLabel ? (
          <>
            <View style={styles.tooltipRow}>
              <View style={[styles.tooltipDot, { backgroundColor: colors.accent }]} />
              <Text style={[styles.tooltipName, { color: colors.textPrimary }]}>{activeLabel}</Text>
            </View>
            {activeDisplayValue !== null ? (
              <>
                <Text style={[styles.tooltipValue, { color: colors.accent }]}>
                  {activeDisplayValue.toFixed(1)} {activeDisplayUnit}
                </Text>
                {activeIntensity > 0 && (
                  <View style={[styles.levelBadge, {
                    backgroundColor: activeIntensity === 3 ? colors.success + '20' :
                      activeIntensity === 2 ? colors.warning + '20' : colors.textMuted + '20',
                  }]}>
                    <Text style={[styles.levelText, {
                      color: activeIntensity === 3 ? colors.success :
                        activeIntensity === 2 ? colors.warning : colors.textMuted,
                    }]}>
                      {intensityLabels[lang]?.[activeIntensity]}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text style={[styles.tooltipHint, { color: colors.textMuted }]}>
                {lang === 'es' ? 'Toca para medir' : 'Tap to measure'}
              </Text>
            )}
          </>
        ) : (
          <Text style={[styles.tooltipHint, { color: colors.textMuted }]}>
            {t.measure.tapMuscle}
          </Text>
        )}
      </View>

      {/* Body SVG */}
      <View
        style={styles.bodyWrap}
        // @ts-ignore
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
            colors.accent + '40',
            colors.accent + '70',
            colors.accent,
          ]}
          border={isDark ? '#555' : '#BBB'}
          defaultFill={isDark ? '#1A1A1A' : '#EAEAEA'}
          defaultStroke={isDark ? '#444' : '#CCC'}
          defaultStrokeWidth={0.5}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  tooltip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
    borderWidth: 1.5, marginBottom: 6, minWidth: 200, alignItems: 'center', gap: 4,
  },
  tooltipRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tooltipDot: { width: 10, height: 10, borderRadius: 5 },
  tooltipName: { ...Typography.h3 },
  tooltipValue: { ...Typography.h2, fontWeight: '700' },
  tooltipHint: { ...Typography.bodySmall },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  levelText: { ...Typography.caption, fontWeight: '700' },
  bodyWrap: { alignItems: 'center' },
});
