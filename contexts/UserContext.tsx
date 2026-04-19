import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { User, Goal } from '@/types/models';
import type { BodyPartKey } from '@/types/bodyParts';
import { useDatabase } from './DatabaseContext';
import { getOrCreateUser, updateUser as updateUserDb } from '@/database/userQueries';
import { getGoals, upsertGoal, deleteGoal } from '@/database/goalQueries';

interface UserContextType {
  user: User;
  goals: Partial<Record<BodyPartKey, Goal>>;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'avatarUri' | 'gender' | 'dateOfBirth' | 'heightCm' | 'unitSystem'>>) => Promise<void>;
  setGoal: (bodyPart: BodyPartKey, targetValue: number) => Promise<void>;
  removeGoal: (bodyPart: BodyPartKey) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const db = useDatabase();
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Partial<Record<BodyPartKey, Goal>>>({});

  const loadUser = useCallback(async () => {
    const u = await getOrCreateUser(db);
    setUser(u);
    const g = await getGoals(db, u.id);
    setGoals(g);
  }, [db]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleUpdateUser = useCallback(async (
    updates: Partial<Pick<User, 'name' | 'email' | 'avatarUri' | 'gender' | 'dateOfBirth' | 'heightCm' | 'unitSystem'>>
  ) => {
    if (!user) return;
    await updateUserDb(db, user.id, updates);
    setUser(prev => prev ? { ...prev, ...updates } : prev);
  }, [db, user]);

  const handleSetGoal = useCallback(async (bodyPart: BodyPartKey, targetValue: number) => {
    if (!user) return;
    await upsertGoal(db, user.id, bodyPart, targetValue);
    const g = await getGoals(db, user.id);
    setGoals(g);
  }, [db, user]);

  const handleRemoveGoal = useCallback(async (bodyPart: BodyPartKey) => {
    if (!user) return;
    await deleteGoal(db, user.id, bodyPart);
    const g = await getGoals(db, user.id);
    setGoals(g);
  }, [db, user]);

  if (!user) return null;

  return (
    <UserContext.Provider
      value={{
        user,
        goals,
        updateUser: handleUpdateUser,
        setGoal: handleSetGoal,
        removeGoal: handleRemoveGoal,
        refreshUser: loadUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
