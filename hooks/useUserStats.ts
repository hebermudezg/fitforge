import { useEffect, useState } from 'react';
import { useDatabase } from '@/contexts/DatabaseContext';
import { useUser } from '@/contexts/UserContext';
import type { UserStats } from '@/constants/achievements';

export function useUserStats(): UserStats {
  const db = useDatabase();
  const { user } = useUser();
  const [stats, setStats] = useState<UserStats>({
    totalMeasurements: 0,
    musclesMeasured: 0,
    streakDays: 0,
    totalWorkouts: 0,
    daysActive: 0,
    weightChange: 0,
    maxMuscleGrowth: 0,
  });

  useEffect(() => {
    (async () => {
      // Total measurements
      const countRow = await db.getFirstAsync<{ c: number }>(
        'SELECT COUNT(*) as c FROM measurements WHERE user_id = ?', [user.id]
      );

      // Unique muscles measured
      const musclesRow = await db.getFirstAsync<{ c: number }>(
        'SELECT COUNT(DISTINCT body_part) as c FROM measurements WHERE user_id = ?', [user.id]
      );

      // Streak: consecutive days with measurements
      const dates = await db.getAllAsync<{ d: string }>(
        `SELECT DISTINCT DATE(measured_at) as d FROM measurements
         WHERE user_id = ? ORDER BY d DESC`, [user.id]
      );
      let streak = 0;
      if (dates.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (let i = 0; i < dates.length; i++) {
          const expected = new Date(today);
          expected.setDate(expected.getDate() - i);
          const dateStr = expected.toISOString().split('T')[0];
          if (dates[i].d === dateStr) {
            streak++;
          } else if (i === 0 && dates[0].d === new Date(today.getTime() - 86400000).toISOString().split('T')[0]) {
            // Allow starting from yesterday
            streak++;
            continue;
          } else {
            break;
          }
        }
      }

      // Days active (unique dates with any measurement)
      const activeDays = dates.length;

      // Weight change (first vs last)
      const firstWeight = await db.getFirstAsync<{ value: number }>(
        `SELECT value FROM measurements WHERE user_id = ? AND body_part = 'weight'
         ORDER BY measured_at ASC LIMIT 1`, [user.id]
      );
      const lastWeight = await db.getFirstAsync<{ value: number }>(
        `SELECT value FROM measurements WHERE user_id = ? AND body_part = 'weight'
         ORDER BY measured_at DESC LIMIT 1`, [user.id]
      );
      const weightChange = (firstWeight && lastWeight)
        ? lastWeight.value - firstWeight.value : 0;

      // Max muscle growth (biggest gain in any muscle)
      const growthRows = await db.getAllAsync<{ body_part: string; first_val: number; last_val: number }>(
        `SELECT m1.body_part,
           (SELECT value FROM measurements m2 WHERE m2.user_id = m1.user_id AND m2.body_part = m1.body_part ORDER BY measured_at ASC LIMIT 1) as first_val,
           (SELECT value FROM measurements m3 WHERE m3.user_id = m1.user_id AND m3.body_part = m1.body_part ORDER BY measured_at DESC LIMIT 1) as last_val
         FROM measurements m1
         WHERE m1.user_id = ? AND m1.body_part NOT IN ('weight', 'bodyFat', 'waist', 'hips')
         GROUP BY m1.body_part`, [user.id]
      );
      const maxGrowth = growthRows.reduce((max, row) => {
        const growth = row.last_val - row.first_val;
        return growth > max ? growth : max;
      }, 0);

      // Completed events as workouts
      const workoutRow = await db.getFirstAsync<{ c: number }>(
        `SELECT COUNT(*) as c FROM events WHERE user_id = ? AND is_completed = 1`, [user.id]
      );

      setStats({
        totalMeasurements: countRow?.c || 0,
        musclesMeasured: musclesRow?.c || 0,
        streakDays: streak,
        totalWorkouts: workoutRow?.c || 0,
        daysActive: activeDays,
        weightChange: Math.round(weightChange * 10) / 10,
        maxMuscleGrowth: Math.round(maxGrowth * 10) / 10,
      });
    })();
  }, [db, user.id]);

  return stats;
}
