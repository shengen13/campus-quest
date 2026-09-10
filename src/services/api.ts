const API_BASE_URL = import.meta.env.VITE_API_URL || '';

import { auth } from './firebase';
import { Quest, UserProfile } from '../types';

export interface QuestSubmissionPayload {
  quest_id: string;
  code?: string;
  language?: string;
  answer: string;
}

export interface QuestSubmissionResponse {
  success: boolean;
  quest_id: string;
  status: string;
  message: string;
  passed_tests: number;
  total_tests: number;
  execution_time_ms: number;
  xp_awarded: number;
  new_total_xp: number;
  profile?: UserProfile;
}

const request = async (path: string, init: RequestInit = {}) => {
  const token = auth.currentUser
    ? await auth.currentUser.getIdToken()
    : null;

  if (!token) {
    throw new Error('You must be logged in to use Campus Quest.');
  }

  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${token}`);
  headers.set('Accept', 'application/json');

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
};

const parse = async (res: Response) => {
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      body.detail || `Request failed (${res.status}).`
    );
  }

  return body;
};

export const campusQuestApi = {
  async checkHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    return parse(res);
  },

  async getCurrentUser(): Promise<{
    uid: string;
    profile: UserProfile;
  }> {
    return parse(await request('/api/auth/me'));
  },

  async createUserProfile(
    profile: Omit<UserProfile, 'uid' | 'isLoggedIn'>
  ) {
    return parse(
      await request('/api/auth/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      })
    );
  },

  async getQuests(): Promise<Quest[]> {
    return parse(
      await fetch(`${API_BASE_URL}/api/quests`)
    );
  },

  async getSeals() {
    return parse(
      await fetch(`${API_BASE_URL}/api/seals`)
    );
  },

  async getLeaderboard() {
    return parse(
      await request('/api/leaderboard')
    );
  },

  async claimBounty() {
    return parse(
      await request('/api/leaderboard/claim-bounty', {
        method: 'POST',
      })
    );
  },

  async submitSolution(
    payload: QuestSubmissionPayload
  ): Promise<QuestSubmissionResponse> {
    return parse(
      await request('/api/quests/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    );
  },
};