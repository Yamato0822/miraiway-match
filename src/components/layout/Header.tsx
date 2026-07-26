import { useDemo } from '../../state/DemoContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Search, RotateCcw, Sparkles, Home, Users, MessageSquare, Building2, Briefcase, ShieldCheck, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { MiraiWayLogo } from '../common/MiraiWayLogo';
import type { Role } from '../../types';
import { initialDemoState } from '../../data/initialState';

const roleLabels: Record<Role, string> = {
  company: '企業',
  candidate: '候補者',
  admin: '運営',
};

const navItems: Record<Role, { label: string; path: string; mobileLabel?: string; icon: any }[]> = {
  company: [
    { label: 'ホーム', path: '/company/home', icon: Home },
    { label: '候補者を探す', path: '/company/candidates', mobileLabel: '探す', icon: Users },
    { label: 'やり取り', path: '/company/messages', icon: MessageSquare },
    { label: '入社まで', path: '/company/offer-flow', mobileLabel: '手続き', icon: ShieldCheck },
    { label: '企業ページ', path: '/company/page', mobileLabel: '自社', icon: Building2 },
  ],
  candidate: [
    { label: 'ホーム', path: '/candidate/home', icon: Home },
    { label: '仕事を探す', path: '/candidate/jobs', mobileLabel: '探す', icon: Briefcase },
    { label: 'やり取り', path: '/candidate/messages', icon: MessageSquare },
    { label: 'プロフィール', path: '/candidate/profile', mobileLabel: 'マイページ', icon: User },
  ],
  admin: [
    { label: '対応ホーム', path: '/admin/home', mobileLabel: 'ホーム', icon: Home },
    { label: '候補者', path: '/admin/candidates', icon: Users },
    { label: 'やり取り', path: '/admin/threads', icon: MessageSquare },
    { label: '通訳予定', path: '/admin/interpreter', mobileLabel: '通訳', icon: Calendar },
  ],
};

export function Header() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const currentNav = navItems[state.currentRole];
  const unreadCount = state.notifications.filter(
    (n) => !n.read && n.forRole === state.currentRole
  ).length;

  const handleRoleSwitch = (role: Role) => {
    dispatch({ type: 'SWITCH_ROLE', role });
    const firstPath = navItems[role][0].path;
    navigate(firstPath);
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_DEMO', state: initialDemoState });
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'デモデータを初期化しました', type: 'info' } });
    navigate(navItems[state.currentRole][0].path);
  };

  return (
    <div className="sticky top-3.5 z-50 px-4 md:px-8">
      <header className="max-w-[1160px] mx-auto h-[58px] px-5 rounded-full bg-white/90 backdrop-blur-2xl border border-slate-900/[0.08] shadow-[0_12px_32px_-6px_rgba(15,23,42,0.08)] flex items-center justify-between gap-4 transition-all">
        {/* Left: MiraiWay Standalone Logo Mark (No text) */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(navItems[state.currentRole][0].path)}
            className="flex items-center cursor-pointer shrink-0 py-1"
            aria-label="MiraiWay ホームへ"
          >
            <MiraiWayLogo height={38} />
          </motion.button>

          {/* Navigation Tabs with Floating Sliding Active Indicator */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="メインナビゲーション">
            {currentNav.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-1.5 text-[14px] font-bold transition-colors cursor-pointer rounded-full ${
                    isActive ? 'text-[#0071E3]' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="islandActiveTab"
                      className="absolute inset-0 bg-slate-100/90 rounded-full -z-10"
                      transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                    />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: Island Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors hidden md:flex cursor-pointer"
            aria-label="検索"
            onClick={() => {
              const searchPath = state.currentRole === 'company' ? '/company/candidates' : '/candidate/jobs';
              navigate(searchPath);
            }}
          >
            <Search size={18} />
          </button>

          {/* Bell Notification Icon */}
          <button
            className="p-2 rounded-full text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors relative cursor-pointer"
            aria-label={`通知 ${unreadCount > 0 ? `${unreadCount}件未読` : ''}`}
            onClick={() => {
              dispatch({ type: 'SHOW_MODAL', modal: { type: 'notifications', props: {} } });
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0071E3] text-white text-[11px] font-bold flex items-center justify-center shadow-sm"
              >
                {unreadCount}
              </motion.span>
            )}
          </button>

          {/* Role Switcher Floating Island Container */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-900/[0.04]">
            <button
              onClick={() => dispatch({ type: 'RESET_DEMO', state: { ...initialDemoState, hasCompletedOnboarding: false } })}
              className="text-[11px] font-bold px-2.5 py-1 rounded-full text-[#0071E3] hover:bg-white transition-colors hidden sm:inline-flex items-center gap-1 cursor-pointer shadow-2xs"
              title="チュートリアルと登録を再体験"
            >
              <Sparkles size={12} />
              TUTORIAL
            </button>
            <div className="flex relative">
              {(['company', 'candidate', 'admin'] as Role[]).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`relative px-3.5 py-1 text-[12.5px] font-bold transition-colors cursor-pointer z-10 ${
                    state.currentRole === role ? 'text-[#0F172A]' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  aria-pressed={state.currentRole === role}
                >
                  {state.currentRole === role && (
                    <motion.div
                      layoutId="islandRoleControl"
                      className="absolute inset-0 bg-white rounded-full shadow-sm -z-10"
                      transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                    />
                  )}
                  {roleLabels[role]}
                </button>
              ))}
            </div>
            <button
              onClick={handleReset}
              className="p-1.5 rounded-full text-[#64748B] hover:text-[#0F172A] transition-colors cursor-pointer"
              aria-label="デモデータを初期化"
              title="デモデータを初期化"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>
    </div>
  );
}

/* ===== Mobile Bottom Floating Island Nav ===== */
export function MobileBottomNav() {
  const { state } = useDemo();
  const navigate = useNavigate();
  const location = useLocation();

  const items = navItems[state.currentRole];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
      <nav
        className="max-w-[480px] mx-auto h-[60px] bg-white/90 backdrop-blur-2xl border border-slate-900/[0.08] shadow-[0_16px_40px_-6px_rgba(15,23,42,0.16)] rounded-full flex items-center justify-around px-3 transition-all"
        aria-label="モバイル下部アイランドナビゲーション"
      >
        {items.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const label = item.mobileLabel || item.label;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-colors cursor-pointer z-10 ${
                isActive ? 'text-[#0071E3]' : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileIslandActiveTab"
                  className="absolute inset-0 bg-slate-100/90 rounded-full -z-10"
                  transition={{ type: 'spring', damping: 26, stiffness: 350 }}
                />
              )}
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10.5px] font-bold mt-0.5 leading-none">{label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
