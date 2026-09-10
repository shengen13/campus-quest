/**
 * Dynamic Date, Time, and Academic Ledger Utilities
 * Provides real-time dynamic greetings, semester week tracking,
 * daily reset countdowns, and operational field status.
 */

import { Quest } from '../types';

export interface DynamicGreetingInfo {
  greeting: string;
  fullGreeting: string;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
  icon: string;
  timeContext: string;
  timeString: string;
  dateString: string;
}

export interface AcademicTermInfo {
  termName: string;
  season: 'Fall' | 'Spring' | 'Summer';
  year: number;
  semesterLabel: string;
  currentWeek: number;
  totalWeeks: number;
  daysRemaining: number;
  termProgressPercent: number;
  formattedDate: string;
  formattedTime: string;
}

/**
 * Returns dynamic greeting based on current local hour
 */
export function getDynamicGreeting(userName: string = 'Questor'): DynamicGreetingInfo {
  const now = new Date();
  const hour = now.getHours();

  let greeting = 'Good morning';
  let period: 'morning' | 'afternoon' | 'evening' | 'night' = 'morning';
  let icon = 'light_mode';
  let timeContext = 'morning expedition underway';

  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    period = 'morning';
    icon = 'wb_sunny';
    timeContext = 'morning expedition window active';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    period = 'afternoon';
    icon = 'sunny';
    timeContext = 'afternoon field ledger open';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening';
    period = 'evening';
    icon = 'nights_stay';
    timeContext = 'evening archives accessible';
  } else {
    greeting = 'Good night';
    period = 'night';
    icon = 'dark_mode';
    timeContext = 'nocturnal vault surveillance';
  }

  const cleanName = userName?.trim() ? userName : 'Questor';
  const fullGreeting = `${greeting}, ${cleanName}.`;

  const timeString = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateString = now.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return {
    greeting,
    fullGreeting,
    period,
    icon,
    timeContext,
    timeString,
    dateString,
  };
}

/**
 * Calculates academic semester progress and current week dynamically
 */
export function getAcademicTermInfo(): AcademicTermInfo {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0 = Jan, 8 = Sep, 11 = Dec

  let season: 'Fall' | 'Spring' | 'Summer' = 'Fall';
  let termStart = new Date(year, 8, 1); // Sep 1
  let termEnd = new Date(year, 11, 20); // Dec 20
  const totalWeeks = 16;

  if (month >= 0 && month <= 4) {
    season = 'Spring';
    termStart = new Date(year, 0, 15);
    termEnd = new Date(year, 4, 25);
  } else if (month >= 5 && month <= 7) {
    season = 'Summer';
    termStart = new Date(year, 5, 1);
    termEnd = new Date(year, 7, 25);
  } else {
    season = 'Fall';
    termStart = new Date(year, 8, 1);
    termEnd = new Date(year, 11, 20);
  }

  const oneDayMs = 1000 * 60 * 60 * 24;
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - termStart.getTime()) / oneDayMs));
  const totalDays = Math.max(1, Math.floor((termEnd.getTime() - termStart.getTime()) / oneDayMs));

  const currentWeek = Math.min(
    totalWeeks,
    Math.max(1, Math.floor(elapsedDays / 7) + 1)
  );

  const daysRemaining = Math.max(0, Math.floor((termEnd.getTime() - now.getTime()) / oneDayMs));
  const termProgressPercent = Math.min(
    100,
    Math.max(5, Math.round((elapsedDays / totalDays) * 100))
  );

  const weekStr = currentWeek.toString().padStart(2, '0');
  const semesterLabel = `${season.toUpperCase()} SEMESTER // WEEK ${weekStr}`;
  const termName = `${season} ${year}`;

  const formattedDate = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return {
    termName,
    season,
    year,
    semesterLabel,
    currentWeek,
    totalWeeks,
    daysRemaining,
    termProgressPercent,
    formattedDate,
    formattedTime,
  };
}

/**
 * Calculates countdown until midnight clocktower reset (HH:MM:SS format)
 */
export function getClocktowerResetCountdown(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = midnight.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');

  return `${hStr}H:${mStr}M`;
}

/**
 * Generates dynamic field status based on uncompleted quests and time of day
 */
export function getDynamicFieldStatus(quests: Quest[] = []): {
  activeCount: number;
  totalCount: number;
  statusText: string;
  resetCountdown: string;
} {
  const activeCount = quests.filter((q) => !q.completed).length;
  const totalCount = quests.length;
  const resetCountdown = getClocktowerResetCountdown();
  const { period } = getDynamicGreeting();

  let timeWord = 'today';
  if (period === 'morning') timeWord = 'this morning';
  else if (period === 'afternoon') timeWord = 'this afternoon';
  else if (period === 'evening') timeWord = 'tonight';
  else timeWord = 'for night watch';

  const statusText = `${activeCount} vault${activeCount === 1 ? '' : 's'} accessible ${timeWord}`;

  return {
    activeCount,
    totalCount,
    statusText,
    resetCountdown,
  };
}
