import { useState } from 'react';
import { Button } from '../common/Button';
import { Building2, User, ShieldCheck, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Role } from '../../types';

type Props = {
  initialRole?: Role;
  onRegister: (role: Role, name: string) => void;
};

export function OnboardingRegisterModal({
  initialRole = 'company',
  onRegister,
}: Props) {
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [nameInput, setNameInput] = useState<string>(
    initialRole === 'company' ? '株式会社サンライズ建設' : 'K.D. サミンダ'
  );

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    if (role === 'company') {
      setNameInput('株式会社サンライズ建設');
    } else if (role === 'candidate') {
      setNameInput('K.D. サミンダ');
    } else {
      setNameInput('MiraiWay 運営事務局');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegister(selectedRole, nameInput.trim() || (selectedRole === 'company' ? '企業ユーザー' : '求職者'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-[600px] max-h-[92dvh] bg-white rounded-2xl shadow-2xl overflow-y-auto border border-slate-900/[0.08] flex flex-col my-auto"
      >
        {/* Header Bar */}
        <div className="px-5 sm:px-8 pt-6 sm:pt-8 pb-3 shrink-0">
          <span className="text-[11px] sm:text-[12px] font-extrabold text-[#0071E3] bg-slate-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            STEP 02 — QUICK SETUP
          </span>
          <h2 className="text-[22px] sm:text-[28px] font-extrabold text-[#0F172A] mt-1.5 tracking-tight leading-snug">
            利用する立場を選択してください
          </h2>
          <p className="text-[13.5px] sm:text-[15px] text-[#64748B] font-semibold mt-1">
            選択したアカウント設定でMiraiWay Matchを開始します（後からいつでも変更可能です）
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-8 pb-6 sm:pb-8 flex flex-col gap-4 sm:gap-6">
          {/* Role Selection Cards */}
          <div className="flex flex-col gap-2.5">
            {[
              {
                id: 'company' as Role,
                title: '日本企業として利用',
                subtitle: 'スリランカの高度人材を直接検索・スカウト・面接',
                icon: Building2,
              },
              {
                id: 'candidate' as Role,
                title: 'スリランカ求職者として利用',
                subtitle: '求人の閲覧・現実条件の確認・企業への直接応募',
                icon: User,
              },
              {
                id: 'admin' as Role,
                title: 'MiraiWay 運営者として利用',
                subtitle: '選考サポート・通訳リクエスト対応・全体モニタリング',
                icon: ShieldCheck,
              },
            ].map((roleItem, idx) => {
              const Icon = roleItem.icon;
              const isSelected = selectedRole === roleItem.id;
              return (
                <motion.div
                  key={roleItem.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect(roleItem.id)}
                  className={`p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all duration-200 flex items-start justify-between gap-3 border ${
                    isSelected
                      ? 'bg-slate-50 border-[#0071E3] shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-[#0071E3] text-white' : 'bg-slate-100 text-[#0F172A]'
                      }`}
                    >
                      <Icon size={19} />
                    </div>
                    <div>
                      <h3 className="text-[15px] sm:text-[16px] font-extrabold text-[#0F172A]">{roleItem.title}</h3>
                      <p className="text-[12.5px] sm:text-[13.5px] text-[#64748B] font-semibold mt-0.5 leading-snug">{roleItem.subtitle}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected ? 'bg-[#0071E3] text-white scale-110' : 'border border-slate-300'
                    }`}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Simple Profile Name Input */}
          <div className="flex flex-col gap-1.5 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
            <label className="text-[12.5px] sm:text-[13px] font-bold text-[#64748B]">
              {selectedRole === 'company'
                ? '登録する会社名（表示名）'
                : selectedRole === 'candidate'
                ? '登録するお名前（表示名）'
                : '運営アカウント表示名'}
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="表示名を入力してください"
              className="w-full px-3.5 py-2.5 text-[15px] font-bold rounded-lg bg-white text-[#0F172A] border border-slate-200 focus:outline-none focus:border-[#0071E3] transition-colors"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-1 pb-2">
            <Button variant="primary" size="lg" fullWidth type="submit" className="shadow-md">
              登録して利用を開始する
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
