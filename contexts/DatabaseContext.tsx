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

async function clearWebDatabase(): Promise<void> {
  if (Platform.OS !== 'web') return;
  try {
    const root = await navigator.storage.getDirectory();
    // Try to remove the OPFS directory used by expo-sqlite
    for await (const [name] of (root as any).entries()) {
      if (name.includes('sqlite') || name.includes('fitforge')) {
        await root.removeEntry(name, { recursive: true });
      }
    }
  } catch {}
}

async function initDatabase(): Promise<SQLiteDatabase> {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const database = await SQLite.openDatabaseAsync('fitforge.db');
      await database.execAsync('PRAGMA journal_mode = WAL;');
      await runMigrations(database);
      try { await seedDatabase(database); } catch {}
      return database;
    } catch (e: any) {
      console.warn(`DB attempt ${attempt}:`, e.message);
      if (attempt < maxRetries) {
        // On web, clear the locked handle and retry
        if (Platform.OS === 'web') {
          await clearWebDatabase();
        }
        await new Promise((r) => setTimeout(r, 800 * attempt));
      } else {
        throw e;
      }
    }
  }
  throw new Error('Failed to init database');
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tryInit = async () => {
    setError(null);
    setDb(null);
    try {
      const database = await initDatabase();
      setDb(database);
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => { tryInit(); }, []);

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorTitle}>Database Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable style={styles.retryBtn} onPress={tryInit}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
        {Platform.OS === 'web' && (
          <Pressable style={styles.clearBtn} onPress={async () => {
            await clearWebDatabase();
            window.location.reload();
          }}>
            <Text style={styles.clearText}>Clear DB & Reload</Text>
          </Pressable>
        )}
      </View>
    );
  }

  if (!db) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.accent} />
        <Text style={styles.loadingText}>Loading...</Text>
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
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: Colors.background, gap: 12, padding: 20,
  },
  loadingText: { color: Colors.textMuted, fontSize: 14, marginTop: 8 },
  errorTitle: { color: '#F87171', fontSize: 18, fontWeight: '700' },
  errorText: { color: '#999', fontSize: 12, textAlign: 'center' },
  retryBtn: {
    backgroundColor: Colors.accent, paddingHorizontal: 32,
    paddingVertical: 12, borderRadius: 10,
  },
  retryText: { color: '#0D0D0D', fontWeight: '700', fontSize: 16 },
  clearBtn: {
    borderWidth: 1, borderColor: '#F87171', paddingHorizontal: 24,
    paddingVertical: 10, borderRadius: 10,
  },
  clearText: { color: '#F87171', fontWeight: '600', fontSize: 14 },
});
