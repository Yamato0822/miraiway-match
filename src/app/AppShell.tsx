import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header, MobileBottomNav } from '../components/layout/Header';
import { Toast } from '../components/common/Toast';
import { NotificationsModal } from '../components/demo/NotificationsModal';
import { DemoToolbar } from '../components/demo/DemoToolbar';
import { useDemo } from '../state/DemoContext';
import { OnboardingTutorialModal } from '../components/onboarding/OnboardingTutorialModal';
import { OnboardingRegisterModal } from '../components/onboarding/OnboardingRegisterModal';
import { LoadingSplashScreen } from '../components/common/LoadingSplashScreen';
import type { Role } from '../types';

export function AppShell() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const [onboardingStage, setOnboardingStage] = useState<'tutorial' | 'register'>('tutorial');

  const handleTutorialCompleteOrSkip = () => {
    setOnboardingStage('register');
  };

  const handleRegister = (role: Role, name: string) => {
    dispatch({ type: 'REGISTER_ONBOARDING_USER', role, name });
    const targetRoutes: Record<Role, string> = {
      company: '/company/home',
      candidate: '/candidate/home',
      admin: '/admin/home',
    };
    navigate(targetRoutes[role]);
    dispatch({
      type: 'SHOW_TOAST',
      toast: {
        message: `${name} 様のアカウントでMiraiWay Matchにログインしました`,
        type: 'success',
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <MobileBottomNav />
      <Toast />
      <NotificationsModal />
      <DemoToolbar />
      <LoadingSplashScreen durationMs={1200} />

      {/* Onboarding Flow for First Launch */}
      {!state.hasCompletedOnboarding && (
        <>
          {onboardingStage === 'tutorial' ? (
            <OnboardingTutorialModal
              onComplete={handleTutorialCompleteOrSkip}
              onSkip={handleTutorialCompleteOrSkip}
            />
          ) : (
            <OnboardingRegisterModal
              initialRole={state.currentRole}
              onRegister={handleRegister}
            />
          )}
        </>
      )}

      <p className="fixed bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-medium text-[#86868B] z-30 hidden md:block">
        MiraiWay Match — スリランカ高度人材顧客検証プロトタイプ
      </p>
    </div>
  );
}
