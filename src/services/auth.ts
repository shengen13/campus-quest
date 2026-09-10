import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '../types';
import { campusQuestApi } from './api';

export const subscribeToAuthChanges = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);

const buildProfile = (user: User, name: string, callsign: string, college: string, guild: string): Omit<UserProfile, 'uid' | 'isLoggedIn'> => ({
  name: name.trim(),
  callsign: callsign.trim(),
  email: user.email || '',
  guild: guild.trim(),
  level: 1,
  levelTitle: 'CADET',
  xp: 0,
  nextLevelXp: 500,
  streakDays: 0,
  bestStreak: 0,
  solvedCount: 0,
  accuracy: 0,
  inkSeals: 0,
  college: college.trim(),
  bountyClaimed: false,
  completedQuests: [],
  photoURL: user.photoURL || '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const loginWithEmail = async (email: string, password: string, remember = true) => {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  const result = await campusQuestApi.getCurrentUser();
  return { user: cred.user, profile: { ...result.profile, uid: cred.user.uid, isLoggedIn: true } };
};

export const registerWithEmail = async (email: string, password: string, name: string, callsign: string, college: string, guild: string) => {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  try {
    await updateProfile(cred.user, { displayName: name.trim() });
    const profile = buildProfile(cred.user, name, callsign, college, guild);
    const result = await campusQuestApi.createUserProfile(profile);
    return { user: cred.user, profile: { ...result.profile, uid: cred.user.uid, isLoggedIn: true } as UserProfile };
  } catch (error) {
    await signOut(auth).catch(() => undefined);
    throw error;
  }
};

export const resetPassword = async (email: string) => sendPasswordResetEmail(auth, email.trim());
export const logoutUser = () => signOut(auth);
