# MiraiWay Match — 顧客検証用フロントエンドプロトタイプ v5

スリランカ人材と日本企業が、互いの現実を理解して納得して選び、MiraiWayの支援を受けながら、出会いから入社まで迷わず前に進むための共同ワークスペース。

## 技術構成

- Framework: React 18
- Language: TypeScript 5
- Build Tool: Vite 6
- Styling: Tailwind CSS v4
- Routing: React Router v6
- State Management: Context + useReducer
- Persistence: localStorage (`miraiway-match-prototype-v5`)
- Icons: Lucide React
- Testing: Vitest

## 起動方法

### 依存関係のインストール
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
```
`http://localhost:5173` にアクセスしてください。

### プロダクションビルド
```bash
npm run build
```

### テスト実行
```bash
npm run test
```

## デモ操作ガイド

### 1. ロール切り替え
画面右上のヘッダーにある **DEMO (企業｜候補者｜運営)** 切り替えボタンから、いつでも切り替えられます。同一ブラウザ内で状態（気になる、スカウト、メッセージ、面接確定、内定等）がリアルタイムに共有・維持されます。

### 2. デモデータ初期化
ヘッダー右端の回転矢印アイコン（リセットボタン）を押すと、全状態を初期状態に戻すことができます。

### 3. デモシナリオ実行
画面右上の「シナリオ」ボタンを押すと、3つの必須デモシナリオ（企業、候補者、運営）を選択して開始できます。

- **シナリオA（企業）**: 候補者発見 → Match Compass → 質問準備 → スカウト → メッセージ → 面接候補 → 通訳依頼 → 面接確定 → 内定後フロー
- **シナリオB（候補者）**: 仕事発見 → Reality First → 未回答から質問化 → 応募 → メッセージ → 面接日時選択
- **シナリオC（運営）**: 停滞案件確認 → 通訳待ち確認 → 空き枠登録 → 企業側枠反映確認

### 4. フィードバック記録・JSON出力
画面右上の「FB記録」ボタンを押すと、顧客検証の定性・定量フィードバックをモーダル上で保存し、`miraiway-match-feedback.json` ファイルとしてエクスポートできます。

## 固有UX機能

1. **Match Compass（条件の一致）**: 点数やAI評価ではなく、希望条件の一致点・要確認点を透明に表示。
2. **Reality First（現実から見る）**: 候補者向け企業詳細でお金（0円）、手取り、天引き、寮、生活情報から提示。
3. **Ask from Unknown（未回答を行動へ）**: 未回答項目からメッセージ用の質問候補を作成。
4. **Next Action Banner**: やり取り画面やホーム画面で常に「次に行うこと」「主担当」「期限目安」を表示。
5. **Journey Thread（結ぶ糸）**: スカウトから入社・定着支援までを一本のラインと役割分担で可視化。
