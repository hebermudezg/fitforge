import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { runMigrations } from '@/database/migrations';
import { seedDatabase } from '@/database/seedData';
import { Colors } from '@/constants/Colors';

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface DatabaseContextType {
  db: SQLiteDatabase;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

// Keep reference to close on unmount/re-init
let currentDb: SQLiteDatabase | null = null;

async function initDatabase(retries = 3): Promise<SQLiteDatabase> {
  // Close existing connection first (fixes web AccessHandle conflict)
  if (currentDb) {
    try { await currentDb.closeAsync(); } catch {}
    currentDb = null;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const database = await SQLite.openDatabaseAsync('fitforge.db');
      await database.execAsync('PRAGMA journal_mode = WAL;');
      await runMigrations(database);
      try { await seedDatabase(database); } catch {}
      currentDb = database;
      return database;
    } catch (e: any) {
      console.warn(`DB init attempt ${attempt}/${retries}:`, e.message);
      if (attempt === retries) throw e;
      // Wait before retry (web needs time to release file handle)
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  throw new Error('Failed to init database');
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tryInit = () => {
    setError(null);
    setDb(null);
    initDatabase()
      .then(setDb)
      .catch((e) => setError(e.message));
  };

  useEffect(() => {
    tryInit();
    return () => {
      // Cleanup on unmount
      if (currentDb) {
        currentDb.closeAsync().catch(() => {});
        currentDb = null;
      }
    };
  }, []);

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>DB Error: {error}</Text>
        <Pressable style={styles.retryBtn} onPress={tryInit}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
        {Platform.OS === 'web' && (
          <Text style={styles.hintText}>
            Close other FitForge tabs and try again
          </Text>
        )}
      </View>
    );
  }

  if (!db) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ db }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLiteDatabase {
  const ctx = useContext(DatabaseContext);
  if (!ctx) throw new Error('useDatabase must be used within DatabaseProvider');
  return ctx.db;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  errorText: { color: '#F87171', fontSize: 14, textAlign: 'center', padding: 20 },
  retryBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: '#0D0D0D', fontWeight: '700', fontSize: 14 },
  hintText: { color: '#666', fontSize: 12, marginTop: 8 },
});
