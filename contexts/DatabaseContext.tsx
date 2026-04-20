import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { runMigrations } from '@/database/migrations';
import { seedDatabase } from '@/database/seedData';
import { Colors } from '@/constants/Colors';

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface DatabaseContextType {
  db: SQLiteDatabase;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const database = await SQLite.openDatabaseAsync('fitforge.db');
        await database.execAsync('PRAGMA journal_mode = WAL;');
        await runMigrations(database);
        try {
          await seedDatabase(database);
        } catch (seedErr: any) {
          console.warn('Seed warning:', seedErr.message);
        }
        setDb(database);
      } catch (e: any) {
        console.error('Database init error:', e);
        setError(e.message || 'Database error');
      }
    })();
  }, []);

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>DB Error: {error}</Text>
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
  },
  errorText: {
    color: '#F87171',
    fontSize: 14,
    textAlign: 'center',
    padding: 20,
  },
});
