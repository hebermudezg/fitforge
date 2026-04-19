import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Measurement } from '@/types/models';
import type { BodyPartKey } from '@/types/bodyParts';
import { useDatabase } from './DatabaseContext';
import { useUser } from './UserContext';
import {
  insertMeasurement,
  getLatestMeasurements,
  getMeasurementHistory,
  getMeasurementStats,
  getRecentMeasurements,
  deleteMeasurement,
} from '@/database/measurementQueries';

interface MeasurementContextType {
  latestMeasurements: Partial<Record<BodyPartKey, Measurement>>;
  recentMeasurements: Measurement[];
  addMeasurement: (bodyPart: BodyPartKey, value: number, measuredAt?: string, notes?: string) => Promise<void>;
  removeMeasurement: (id: number) => Promise<void>;
  getHistory: (bodyPart: BodyPartKey, fromDate?: string, toDate?: string) => Promise<Measurement[]>;
  getStats: (bodyPart: BodyPartKey, fromDate?: string) => Promise<{ min: number; max: number; avg: number; count: number; change: number }>;
  refresh: () => Promise<void>;
}

const MeasurementContext = createContext<MeasurementContextType | null>(null);

export function MeasurementProvider({ children }: { children: React.ReactNode }) {
  const db = useDatabase();
  const { user } = useUser();
  const [latestMeasurements, setLatest] = useState<Partial<Record<BodyPartKey, Measurement>>>({});
  const [recentMeasurements, setRecent] = useState<Measurement[]>([]);

  const loadData = useCallback(async () => {
    const latest = await getLatestMeasurements(db, user.id);
    setLatest(latest);
    const recent = await getRecentMeasurements(db, user.id, 10);
    setRecent(recent);
  }, [db, user.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addMeasurement = useCallback(async (
    bodyPart: BodyPartKey,
    value: number,
    measuredAt?: string,
    notes?: string
  ) => {
    await insertMeasurement(db, user.id, bodyPart, value, measuredAt, notes);
    await loadData();
  }, [db, user.id, loadData]);

  const removeMeasurement = useCallback(async (id: number) => {
    await deleteMeasurement(db, id);
    await loadData();
  }, [db, loadData]);

  const getHistory = useCallback(async (
    bodyPart: BodyPartKey,
    fromDate?: string,
    toDate?: string
  ) => {
    return getMeasurementHistory(db, user.id, bodyPart, fromDate, toDate);
  }, [db, user.id]);

  const getStats = useCallback(async (bodyPart: BodyPartKey, fromDate?: string) => {
    return getMeasurementStats(db, user.id, bodyPart, fromDate);
  }, [db, user.id]);

  return (
    <MeasurementContext.Provider
      value={{
        latestMeasurements,
        recentMeasurements,
        addMeasurement,
        removeMeasurement,
        getHistory,
        getStats,
        refresh: loadData,
      }}
    >
      {children}
    </MeasurementContext.Provider>
  );
}

export function useMeasurements() {
  const ctx = useContext(MeasurementContext);
  if (!ctx) throw new Error('useMeasurements must be used within MeasurementProvider');
  return ctx;
}
