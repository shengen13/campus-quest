import React, { useEffect, useState } from 'react';
import { ScreenType, UserProfile, Quest } from './types';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HonorCodeModal } from './components/HonorCodeModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { RegisterScreen } from './screens/RegisterScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { QuestsScreen } from './screens/QuestsScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { QuestRunnerScreen } from './screens/QuestRunnerScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { subscribeToAuthChanges, logoutUser } from './services/auth';
import { campusQuestApi } from './services/api';

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'honor_code' | 'protocol' }>({ isOpen: false, type: 'honor_code' });

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (firebaseUser) => {
      setLoading(true);
      setDataError(null);
      try {
        if (!firebaseUser) {
          setUser(null);
          setCurrentScreen('login');
          setQuests([]);
          return;
        }
        const [profile, loadedQuests] = await Promise.all([
          campusQuestApi.getCurrentUser().then((result) => result.profile),
          campusQuestApi.getQuests(),
        ]);
        if (!profile) {
          await logoutUser();
          throw new Error('Authenticated account has no Campus Quest profile. Register through Campus Quest first.');
        }
        setUser({ ...profile, uid: firebaseUser.uid, isLoggedIn: true });
        setQuests(loadedQuests.map((quest) => ({ ...quest, completed: profile.completedQuests?.includes(quest.id) || false, status: profile.completedQuests?.includes(quest.id) ? 'completed' : quest.status })));
        setCurrentScreen((screen) => screen === 'login' || screen === 'register' ? 'home' : screen);
      } catch (error) {
        setDataError(error instanceof Error ? error.message : 'Unable to load Campus Quest data.');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const refreshUserAndQuests = async () => {
    if (!user?.uid) return;
    const [profile, loadedQuests] = await Promise.all([
      campusQuestApi.getCurrentUser().then((result) => result.profile),
      campusQuestApi.getQuests(),
    ]);
    if (!profile) throw new Error('User profile could not be found.');
    setUser({ ...profile, uid: user.uid, isLoggedIn: true });
    setQuests(loadedQuests.map((quest) => ({ ...quest, completed: profile.completedQuests?.includes(quest.id) || false, status: profile.completedQuests?.includes(quest.id) ? 'completed' : quest.status })));
  };

  const handleNavigate = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimBounty = async () => {
    if (!user?.uid || user.bountyClaimed) return;
    try {
      const result = await campusQuestApi.claimBounty();
      setUser(result.profile as UserProfile);
    } catch (error) {
      setDataError(error instanceof Error ? error.message : 'Unable to claim bounty.');
    }
  };

  const handleQuestCompleted = async (questId: string, _xpEarned: number) => {
    if (!user?.uid) throw new Error('You must be logged in.');
    await refreshUserAndQuests();
    setQuests((previous) => previous.map((item) => item.id === questId ? { ...item, completed: true, status: 'completed' } : item));
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setQuests([]);
    setCurrentScreen('login');
  };

  const isAuthScreen = currentScreen === 'login' || currentScreen === 'register';

  if (loading) {
    return <div className="min-h-screen tactile-grid bg-[#15121d] text-[#fff2dc] flex items-center justify-center"><div className="bg-[#241D30] border-[3px] border-[#050505] brutal-shadow p-8 text-center"><div className="font-label-code-sm text-[#ffd166]">LOADING CAMPUS QUEST...</div></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#15121d] text-[#e7dff0] flex flex-col tactile-grid selection:bg-[#ffd166] selection:text-[#050505] overflow-x-hidden">
      {dataError && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] max-w-xl w-[calc(100%-2rem)] bg-[#241D30] border-[2.5px] border-[#FF746E] text-[#FF746E] p-3 brutal-shadow font-label-code-sm text-xs flex justify-between gap-3">
          <span>{dataError}</span><button onClick={() => setDataError(null)} aria-label="Close">×</button>
        </div>
      )}

      <Header currentScreen={currentScreen} user={user || undefined} onNavigate={handleNavigate} searchQuery={searchQuery} onSearchChange={setSearchQuery} mobileMenuOpen={mobileMenuOpen} onToggleMobileMenu={() => setMobileMenuOpen((value) => !value)} />

      {isAuthScreen ? (
        <div className="flex-1 flex flex-col pt-16">
          <main className="flex-1 flex flex-col">
            {currentScreen === 'register' && <RegisterScreen onNavigate={handleNavigate} onRegisterSuccess={() => handleNavigate('home')} onOpenHonorCode={() => setModalState({ isOpen: true, type: 'honor_code' })} />}
            {currentScreen === 'login' && <LoginScreen onNavigate={handleNavigate} onLoginSuccess={() => handleNavigate('home')} />}
          </main>
          <Footer onOpenHonorCode={() => setModalState({ isOpen: true, type: 'honor_code' })} onOpenProtocol={() => setModalState({ isOpen: true, type: 'protocol' })} />
        </div>
      ) : user ? (
        <div className="flex-1 flex">
          <div className="hidden lg:block w-72 flex-shrink-0"><Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} onLogout={handleLogout} isLoggedIn /></div>
          {mobileMenuOpen && <div className="lg:hidden fixed inset-0 z-50 bg-[#050505]/80" onClick={() => setMobileMenuOpen(false)}><div className="w-72 max-w-[85vw] h-full" onClick={(e) => e.stopPropagation()}><Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} onCloseMobileMenu={() => setMobileMenuOpen(false)} onLogout={handleLogout} isLoggedIn /></div></div>}
          <div className="flex-1 flex flex-col min-w-0 pt-20 px-3 sm:px-6 md:px-8 pb-24 lg:pb-8">
            <main className="flex-1">
              {currentScreen === 'home' && <HomeScreen user={user} quests={quests} onNavigate={handleNavigate} onSelectQuest={(id) => { setSelectedQuestId(id); handleNavigate('quest_runner'); }} onClaimBounty={handleClaimBounty} />}
              {currentScreen === 'quests' && <QuestsScreen quests={quests} searchQuery={searchQuery} onNavigate={handleNavigate} onSelectQuest={(id) => { setSelectedQuestId(id); handleNavigate('quest_runner'); }} />}
              {currentScreen === 'leaderboard' && <LeaderboardScreen user={user} onNavigate={handleNavigate} onClaimBounty={handleClaimBounty} />}
              {currentScreen === 'quest_runner' && selectedQuestId && <QuestRunnerScreen questId={selectedQuestId} quests={quests} user={user} onNavigate={handleNavigate} onQuestCompleted={handleQuestCompleted} />}
              {currentScreen === 'achievements' && <AchievementsScreen user={user} onNavigate={handleNavigate} />}
              {currentScreen === 'progress' && <ProgressScreen user={user} onNavigate={handleNavigate} />}
              {currentScreen === 'profile' && <ProfileScreen user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
              {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} onOpenHonorCode={() => setModalState({ isOpen: true, type: 'honor_code' })} onOpenProtocol={() => setModalState({ isOpen: true, type: 'protocol' })} />}
            </main>
            <Footer onOpenHonorCode={() => setModalState({ isOpen: true, type: 'honor_code' })} onOpenProtocol={() => setModalState({ isOpen: true, type: 'protocol' })} />
          </div>
          <MobileBottomNav currentScreen={currentScreen} onNavigate={handleNavigate} onOpenMenu={() => setMobileMenuOpen(true)} />
        </div>
      ) : null}

      <HonorCodeModal isOpen={modalState.isOpen} type={modalState.type} onClose={() => setModalState({ isOpen: false, type: 'honor_code' })} />
    </div>
  );
}

export default App;
