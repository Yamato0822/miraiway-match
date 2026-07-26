import { useState } from 'react';
import { Button } from '../common/Button';
import { ArrowRight, Compass, ShieldCheck, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  onComplete: () => void;
  onSkip: () => void;
};

const slides = [
  {
    step: '01 / 03',
    tag: 'TALENT DISCOVERY',
    icon: Sparkles,
    title: '「履歴書」ではなく「意志と学び」で出会う',
    description:
      'MiraiWay Match は、単なる条件検索掲示板ではありません。スリランカ高度人材が日本で何を成し遂げたいかという「仕事への想い」と、日々の「日本語学習の累積」から人を選べます。',
    highlights: ['日本語学習履歴のリアルタイム可視化', '本人の自己紹介・志望動機動画', '専門アカデミア修了証付き'],
  },
  {
    step: '02 / 03',
    tag: 'MATCH COMPASS & REALITY',
    icon: Compass,
    title: '条件一致を透明化「Match Compass」',
    description:
      '給料・控除・手取り・寮生活・希望勤務地など、お互いの「現実条件」の一致点と要確認点をAIや隠しデータなしで透明に提示。ミスマッチゼロの面接を実現します。',
    highlights: ['手取り額・控除内訳のクリア提示', '相互条件の一致・要確認アラート', '面接前の事前相互納得'],
  },
  {
    step: '03 / 03',
    tag: 'HANDS-ON SUPPORT',
    icon: ShieldCheck,
    title: '迷わず進む「Next Action」＆「伴走サポート」',
    description:
      'すべての選考で「次に行うこと」が常時可視化。面接の通訳同席リクエスト、在留資格申請手続き、現地対応、入社後の定着フォローまでMiraiWayプロチームが伴走します。',
    highlights: ['次の一歩を案内する Next Action Banner', 'シンハラ語・日本語 専門通訳の手配', 'ビザ申請・生活立ち上げ全般サポート'],
  },
];

export function OnboardingTutorialModal({ onComplete, onSkip }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = slides[currentSlide];
  const Icon = slide.icon;
  const isLast = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        className="relative w-full max-w-[640px] max-h-[92dvh] bg-white rounded-2xl shadow-2xl overflow-y-auto border border-slate-900/[0.08] flex flex-col my-auto"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-[#0071E3] bg-slate-100 px-2.5 py-0.5 rounded-md">
              {slide.step}
            </span>
            <span className="text-[12px] font-bold text-[#64748B] tracking-wider">
              {slide.tag}
            </span>
          </div>

          <button
            onClick={onSkip}
            className="text-[13px] font-bold text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 cursor-pointer transition-colors"
          >
            スキップ <X size={15} />
          </button>
        </div>

        {/* Content Body with AnimatePresence */}
        <div className="p-5 sm:p-8 flex flex-col gap-5 min-h-[280px] justify-center relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', damping: 30, stiffness: 380 }}
              className="flex flex-col gap-5"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-100 text-[#0071E3] flex items-center justify-center shrink-0 border border-slate-200/80">
                <Icon size={26} />
              </div>

              <div>
                <h2 className="text-[22px] sm:text-[28px] font-extrabold text-[#0F172A] leading-snug tracking-tight">
                  {slide.title}
                </h2>
                <p className="text-[14.5px] sm:text-[16px] text-[#64748B] font-semibold mt-2.5 leading-relaxed">
                  {slide.description}
                </p>
              </div>

              {/* Key Feature Highlights */}
              <div className="flex flex-col gap-2 pt-1">
                {slide.highlights.map((h, idx) => (
                  <motion.div
                    key={h}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-2.5 text-[14px] sm:text-[14.5px] font-bold text-[#0F172A]"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#0071E3] shrink-0" />
                    <span>{h}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer & Step Indicator */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 bg-slate-50 border-t border-slate-200 shrink-0">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="relative h-2 py-1 cursor-pointer"
                aria-label={`スライド ${idx + 1} へ`}
              >
                <motion.div
                  className={`h-2 rounded-full ${currentSlide === idx ? 'bg-[#0071E3]' : 'bg-slate-300'}`}
                  animate={{ width: currentSlide === idx ? 28 : 8 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                />
              </button>
            ))}
          </div>

          {/* Action Button */}
          <Button variant="primary" size="md" onClick={handleNext}>
            {isLast ? '役割の選択に進む' : '次へ'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
