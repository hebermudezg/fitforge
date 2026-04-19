import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { runMigrations } from '@/database/migrations';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

type SQLiteDatabase = SQLite.SQLiteDatabase;

interface DatabaseContextType {
  db: SQLiteDatabase;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    (async () => {
      const database = await SQLite.openDatabaseAsync('fitforge.db');
      await database.execAsync('PRAGMA journal_mode = WAL;');
      await runMigrations(database);
      setDb(database);
    })();
  }, []);

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
});
