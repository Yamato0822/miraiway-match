import { useState } from 'react';
import { useDemo } from '../../state/DemoContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { exportFeedback } from '../../lib/localStorage';

export function FeedbackModal() {
  const { state, dispatch } = useDemo();
  const isOpen = state.ui.modal?.type === 'feedback';

  const [respondentType, setRespondentType] = useState('company');
  const [clarity, setClarity] = useState(4);
  const [goodPoints, setGoodPoints] = useState('');
  const [confusingPoints, setConfusingPoints] = useState('');
  const [missingInfo, setMissingInfo] = useState('');
  const [wouldUse, setWouldUse] = useState<'yes' | 'considering' | 'no'>('yes');

  if (!isOpen) return null;

  const handleClose = () => dispatch({ type: 'DISMISS_MODAL' });

  const handleSubmit = () => {
    dispatch({
      type: 'ADD_FEEDBACK',
      entry: {
        id: `fb-${Date.now()}`,
        respondentType,
        currentPage: window.location.pathname,
        clarity,
        goodPoints,
        confusingPoints,
        missingInfo,
        wouldUse,
        timestamp: new Date().toISOString(),
      },
    });
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'フィードバックを記録しました', type: 'success' } });
    handleClose();
  };

  const handleExportJSON = () => {
    const jsonStr = exportFeedback(state);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `miraiway-match-feedback-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'フィードバックJSONを出力しました', type: 'info' } });
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="フィードバック記録" maxWidth="520px">
      <div className="flex flex-col gap-4">
        {/* Respondent Type */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>回答者属性</label>
          <div className="flex gap-2">
            {[
              { key: 'company', label: '日本企業' },
              { key: 'candidate', label: 'スリランカ候補者' },
              { key: 'admin', label: 'MiraiWay運営' },
              { key: 'other', label: 'その他' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRespondentType(key)}
                className="px-3 py-1.5 text-[12px] font-medium rounded-lg border"
                style={{
                  borderColor: respondentType === key ? '#1C6FB8' : '#D9E2EC',
                  backgroundColor: respondentType === key ? '#EAF3FB' : 'transparent',
                  color: respondentType === key ? '#1C6FB8' : '#5D6B82',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Clarity Score */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>分かりやすさ (1〜5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setClarity(num)}
                className="w-10 h-10 rounded-xl font-bold text-[16px] border flex items-center justify-center"
                style={{
                  borderColor: clarity === num ? '#F4B01E' : '#D9E2EC',
                  backgroundColor: clarity === num ? '#FDF6E3' : '#FFFFFF',
                  color: clarity === num ? '#D4860A' : '#1A2333',
                }}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Good Points */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>良かった点</label>
          <textarea
            value={goodPoints}
            onChange={(e) => setGoodPoints(e.target.value)}
            placeholder="例：Match Compassで一致項目がすぐ分かるのが良い"
            className="w-full h-16 px-3 py-2 text-[13px] rounded-xl border resize-none"
            style={{ borderColor: '#D9E2EC' }}
          />
        </div>

        {/* Confusing Points */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>分かりにくかった点</label>
          <textarea
            value={confusingPoints}
            onChange={(e) => setConfusingPoints(e.target.value)}
            placeholder="例：次の操作のボタンの位置が迷う"
            className="w-full h-16 px-3 py-2 text-[13px] rounded-xl border resize-none"
            style={{ borderColor: '#D9E2EC' }}
          />
        </div>

        {/* Missing Info */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>足りない情報</label>
          <input
            type="text"
            value={missingInfo}
            onChange={(e) => setMissingInfo(e.target.value)}
            placeholder="例：住居の写真が見たい"
            className="w-full px-3 py-2 text-[13px] rounded-xl border"
            style={{ borderColor: '#D9E2EC' }}
          />
        </div>

        {/* Would Use */}
        <div>
          <label className="text-[13px] font-semibold block mb-1" style={{ color: '#5D6B82' }}>実際に使いたいか</label>
          <div className="flex gap-2">
            {[
              { key: 'yes', label: 'はい' },
              { key: 'considering', label: '検討したい' },
              { key: 'no', label: 'いいえ' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setWouldUse(key as any)}
                className="px-3 py-1.5 text-[12px] font-medium rounded-lg border"
                style={{
                  borderColor: wouldUse === key ? '#1C6FB8' : '#D9E2EC',
                  backgroundColor: wouldUse === key ? '#EAF3FB' : 'transparent',
                  color: wouldUse === key ? '#1C6FB8' : '#5D6B82',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-2 pt-3 border-t" style={{ borderColor: '#E5EAF0' }}>
          <Button variant="tertiary" size="sm" onClick={handleExportJSON}>
            JSON出力
          </Button>
          <span className="flex-1" />
          <Button variant="secondary" size="sm" onClick={handleClose}>キャンセル</Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>保存</Button>
        </div>
      </div>
    </Modal>
  );
}
