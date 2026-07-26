import { useDemo } from '../../state/DemoContext';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Play } from 'lucide-react';

export function ScenarioPanel() {
  const { state, dispatch } = useDemo();
  const navigate = useNavigate();
  const isOpen = state.ui.modal?.type === 'scenarios';

  if (!isOpen) return null;

  const handleClose = () => dispatch({ type: 'DISMISS_MODAL' });

  const scenarios = [
    {
      id: 'A',
      title: 'シナリオA：企業が採用を進める',
      description: '候補者発見 → 詳細 → Match Compass → 質問準備 → スカウト → メッセージ → 面接候補 → 通訳依頼 → 面接確定 → 内定後フロー',
      startRole: 'company' as const,
      startRoute: '/company/candidates',
    },
    {
      id: 'B',
      title: 'シナリオB：候補者が安心して応募する',
      description: '仕事発見 → 企業詳細 → 給与・手取り・寮確認 → 未回答を質問化 → 応募 → メッセージ → 面接日時を選択',
      startRole: 'candidate' as const,
      startRoute: '/candidate/jobs',
    },
    {
      id: 'C',
      title: 'シナリオC：運営が止まりを解消する',
      description: '停止案件確認 → 通訳待ち案件 → 通訳枠登録 → 企業モードへ切替 → 枠反映確認 → 面接確定',
      startRole: 'admin' as const,
      startRoute: '/admin/home',
    },
  ];

  const handleStartScenario = (role: 'company' | 'candidate' | 'admin', route: string) => {
    dispatch({ type: 'SWITCH_ROLE', role });
    handleClose();
    dispatch({ type: 'SHOW_TOAST', toast: { message: 'シナリオを開始しました。画面の案内に沿って進めてください。', type: 'info' } });
    navigate(route);
  };

  return (
    <Modal open={isOpen} onClose={handleClose} title="デモシナリオ" maxWidth="560px">
      <div className="flex flex-col gap-4">
        <p className="text-[14px]" style={{ color: '#5D6B82' }}>
          検証したいシナリオを選択してください。該当の初期化状態とスタート画面に誘導します。
        </p>

        {scenarios.map((sc) => (
          <div key={sc.id} className="p-4 rounded-xl border flex flex-col gap-2" style={{ backgroundColor: '#FFFFFF', borderColor: '#D9E2EC' }}>
            <h3 className="text-[16px] font-bold" style={{ color: '#1A2333' }}>{sc.title}</h3>
            <p className="text-[13px] leading-[1.6]" style={{ color: '#5D6B82' }}>{sc.description}</p>
            <div className="flex justify-end mt-1">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleStartScenario(sc.startRole, sc.startRoute)}
              >
                <Play size={14} /> シナリオ開始
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
