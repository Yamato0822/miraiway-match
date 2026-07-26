import { useState } from 'react';
import { useDemo } from '../../state/DemoContext';
import { Button } from '../../components/common/Button';
import { Check, AlertTriangle, Eye, Edit3, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CompanyPage() {
  const { state, dispatch } = useDemo();
  const profile = state.companyProfile;
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { key: 'money', label: 'お金・手取り', status: profile.completeness.money },
    { key: 'housing', label: '住まい・寮', status: profile.completeness.housing },
    { key: 'work', label: '働き方・休日', status: profile.completeness.work },
    { key: 'support', label: '受入・支援体制', status: profile.completeness.support },
  ];

  const totalCategories = categories.length;
  const completedCount = categories.filter((c) => c.status.complete).length;
  const completionPercentage = Math.round((completedCount / totalCategories) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 350 }}
      className="max-w-[1000px] mx-auto px-6 lg:px-12 py-10 flex flex-col gap-10"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <span className="text-[13px] font-bold text-[#0071E3] uppercase tracking-wider block mb-1">
            COMPANY PROFILE & CONDITIONS
          </span>
          <h1 className="text-[32px] md:text-[36px] font-extrabold text-[#0F172A] tracking-tight leading-snug">
            自社情報・現実条件の編集
          </h1>
          <p className="text-[15.5px] text-[#64748B] font-semibold mt-1">
            給与・手取り目安・控除・住まい・支援体制など、候補者が安心して選べる条件を管理します
          </p>
        </div>

        <Button
          variant={showPreview ? 'primary' : 'secondary'}
          size="md"
          onClick={() => setShowPreview(!showPreview)}
          className="shrink-0"
        >
          <Eye size={18} />
          {showPreview ? '編集モードに戻る' : '候補者視点プレビュー'}
        </Button>
      </div>

      {/* Preview Mode Banner */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="apple-card p-5 bg-white border border-slate-200 flex items-center justify-between gap-4 overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0071E3] text-white flex items-center justify-center shrink-0 font-bold">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-[#0F172A]">候補者視点プレビュー表示中</h3>
                <p className="text-[14px] text-[#64748B]">スリランカ求職者の画面にはこのように透明性の高い形で掲載されます</p>
              </div>
            </div>

            <Button variant="tertiary" size="sm" onClick={() => setShowPreview(false)}>
              プレビュー解除
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completeness Overview Progress Section (Clean & Borderless) */}
      <section className="apple-card p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">
                入力状況・充足率
              </h2>
              <span className="text-[13px] font-bold px-3 py-0.5 rounded-full bg-slate-100 text-[#0071E3] border border-slate-200">
                {completionPercentage}% 完了
              </span>
            </div>
            <p className="text-[14.5px] text-[#64748B] font-semibold mt-1">
              条件入力が充実している企業は、求職者からの選考返信率が平均2.4倍高くなります
            </p>
          </div>
        </div>

        {/* Smooth Progress Gauge */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <motion.div
            className="h-full bg-[#0071E3] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Minimal Pill Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {categories.map((cat) => {
            const isComplete = cat.status.complete;
            return (
              <div
                key={cat.key}
                className={`px-4 py-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                  isComplete
                    ? 'bg-slate-50 border-slate-200 text-[#0F172A]'
                    : 'bg-amber-500/10 border-amber-500/30 text-[#B45309]'
                }`}
              >
                <div>
                  <span className="text-[14px] font-bold block">{cat.label}</span>
                  <span className="text-[12px] font-semibold opacity-80">
                    {isComplete ? '入力済み' : `${cat.status.missing}件 未入力`}
                  </span>
                </div>
                {isComplete ? (
                  <Check size={16} className="text-[#0071E3] shrink-0" strokeWidth={3} />
                ) : (
                  <AlertTriangle size={16} className="text-[#B45309] shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 1: Company Basic Info */}
      <section className="apple-card p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">会社基本情報</h2>
            <p className="text-[14px] text-[#64748B] font-semibold mt-0.5">企業の規模と働く環境の基礎データ</p>
          </div>

          {!showPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SHOW_TOAST', toast: { message: '会社基本情報の編集はプロトタイプ動作です', type: 'info' } });
              }}
            >
              <Edit3 size={15} />
              編集
            </Button>
          )}
        </div>

        {/* Clean Line Items (No Nested Inner Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          <div>
            <span className="text-[13px] font-bold text-[#64748B] block mb-1">会社名</span>
            <span className="text-[17px] font-extrabold text-[#0F172A]">{profile.name}</span>
          </div>

          <div>
            <span className="text-[13px] font-bold text-[#64748B] block mb-1">所在地</span>
            <span className="text-[17px] font-extrabold text-[#0F172A]">{profile.location}</span>
          </div>

          <div>
            <span className="text-[13px] font-bold text-[#64748B] block mb-1">従業員数</span>
            <span className="text-[17px] font-extrabold text-[#0F172A]">
              {profile.employeeCount}名 <span className="text-[14px] text-[#0071E3] font-bold">（外国人: {profile.foreignEmployeeCount}名）</span>
            </span>
          </div>
        </div>
      </section>

      {/* Section 2: Money & Take-Home Pay */}
      <section className="apple-card p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">お金・給料・手取りの情報</h2>
            <p className="text-[14px] text-[#64748B] font-semibold mt-0.5">求職者が最も重視する「手取り目安」と「控除項目」</p>
          </div>

          {!showPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SHOW_TOAST', toast: { message: 'お金の情報の編集はプロトタイプ動作です', type: 'info' } });
              }}
            >
              <Edit3 size={15} />
              編集
            </Button>
          )}
        </div>

        {/* Clean Take-Home Pay Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1">
          {/* Left: Highlighted Metric */}
          <div className="flex flex-col justify-center">
            <span className="text-[12.5px] font-extrabold text-[#0071E3] uppercase tracking-wider block mb-1">
              ESTIMATED TAKE-HOME PAY (手取り目安)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[34px] sm:text-[38px] font-extrabold text-[#0F172A] tracking-tight">
                ¥175,000 〜 ¥225,000
              </span>
              <span className="text-[15px] font-bold text-[#64748B]">/月</span>
            </div>
            <p className="text-[13.5px] text-[#64748B] font-semibold mt-2">
              基本給レンジ: ¥220,000 〜 ¥280,000 （税金・保険・寮費控除後）
            </p>
          </div>

          {/* Right: Deductions List */}
          <div className="flex flex-col justify-center gap-3">
            <span className="text-[14px] font-bold text-[#0F172A]">
              給与から控除される主な項目
            </span>
            <div className="flex flex-wrap gap-2">
              {['所得税', '住民税', '社会保険料・雇用保険', '個室寮費 (月3万円)'].map((d) => (
                <span key={d} className="px-3 py-1.5 rounded-lg bg-slate-100 text-[#0F172A] text-[13.5px] font-bold border border-slate-200/80">
                  {d}
                </span>
              ))}
            </div>
            <p className="text-[13px] text-[#0071E3] font-bold flex items-center gap-1 mt-1">
              <Check size={15} strokeWidth={2.5} /> 控除項目が明記されているため候補者が安心できます
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Housing & Workstyle */}
      <section className="apple-card p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#0F172A] tracking-tight">住まい・働き方・外国人支援体制</h2>
            <p className="text-[14px] text-[#64748B] font-semibold mt-0.5">日本生活の基盤となる住居と伴走サポート</p>
          </div>

          {!showPreview && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SHOW_TOAST', toast: { message: '住まい・支援の編集はプロトタイプ動作です', type: 'info' } });
              }}
            >
              <Edit3 size={15} />
              編集
            </Button>
          )}
        </div>

        {/* Clean Column Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1">
          <div>
            <span className="text-[13px] font-bold text-[#64748B] block mb-1">寮の環境 ＆ 通信設備</span>
            <p className="text-[16px] font-extrabold text-[#0F172A]">
              個室寮あり <span className="text-[14px] text-[#0071E3] font-bold">（月額負担 ¥30,000）</span>
            </p>
            <p className="text-[13.5px] text-[#64748B] font-semibold mt-1">高速 Wi-Fi 完備</p>
          </div>

          <div>
            <span className="text-[13px] font-bold text-[#64748B] block mb-1">年間休日数 ＆ 残業実態</span>
            <p className="text-[16px] font-extrabold text-[#0F172A]">
              年間休日 <strong className="text-[#0071E3]">115日</strong> · 残業 <strong className="text-[#0071E3]">月平均 20時間</strong>
            </p>
          </div>
        </div>

        {/* Onboarding Support Chips */}
        <div className="pt-2">
          <span className="text-[13px] font-bold text-[#64748B] block mb-2">外国人受け入れ伴走サポート</span>
          <div className="flex flex-wrap gap-2">
            {['空港送迎手配', '役所登録手続き伴走', '定期日本語面談', 'シンハラ語通訳対応'].map((sup) => (
              <span key={sup} className="px-3 py-1.5 rounded-lg bg-slate-50 text-[#0F172A] text-[13px] font-bold border border-slate-200">
                ✓ {sup}
              </span>
            ))}
          </div>
        </div>

        {/* Unanswered Item Callout Banner */}
        <div className="mt-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle size={18} className="text-[#B45309] shrink-0" />
            <div>
              <span className="text-[14px] font-extrabold text-[#B45309] block">未回答項目: 食事提供・補助の有無</span>
              <span className="text-[13px] text-[#64748B] font-semibold">求職者が生活費を算出する際によく確認する重要項目です</span>
            </div>
          </div>

          <Button
            variant="black"
            size="sm"
            onClick={() => {
              dispatch({ type: 'SHOW_TOAST', toast: { message: '食事提供項目の入力フォームを開きました', type: 'info' } });
            }}
          >
            今すぐ回答を入力
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
