# 📸 Photo to GIF

複数の画像を選んでGIFアニメーションを作成できるWebアプリケーションです。

## ✨ 特徴

- **完全クライアントサイド**: 画像は外部サーバーにアップロードされません
- **ドラッグ&ドロップ対応**: 直感的なファイルアップロード
- **複数フォーマット対応**: PNG, JPG, JPEG, GIF, BMP, WebP
- **カスタマイズ可能**: フレーム間隔と品質の調整
- **リアルタイムプレビュー**: 生成したGIFをすぐに確認
- **レスポンシブデザイン**: モバイル・デスクトップ対応
- **画像並び替え**: ドラッグで簡単に順序変更

## 🚀 デプロイ

[ライブデモを見る](https://kumamotoseita.github.io/PhotoToGif/)

### GitHub Pagesでのデプロイ設定

1. **リポジトリ設定**
   - GitHubリポジトリの「Settings」タブを開く
   - 左メニューの「Pages」をクリック
   - 「Source」で「GitHub Actions」を選択

2. **自動デプロイ**
   - メインブランチにプッシュすると自動でデプロイされます

3. **手動デプロイ（代替方法）**
   ```bash
   ./deploy.sh
   ```

### 必要な権限
- リポジトリの「Settings」→「Actions」→「General」
- 「Workflow permissions」で「Read and write permissions」を選択
- 「Allow GitHub Actions to create and approve pull requests」にチェック

## 🛠️ 技術スタック

- **フロントエンド**: React 19 + TypeScript
- **ビルドツール**: Vite 5
- **GIF生成**: gif.js
- **ファイルアップロード**: react-dropzone
- **スタイリング**: CSS3 (Flexbox + Grid)
- **デプロイ**: GitHub Pages

## 🏃‍♂️ ローカル開発

### 前提条件

- Node.js 20以上
- npm

### セットアップ

1. リポジトリをクローン
```bash
git clone https://github.com/kumamotoseita/PhotoToGif.git
cd PhotoToGif/photo-to-gif-app
```

2. 依存関係をインストール
```bash
npm install
```

3. 開発サーバーを起動
```bash
npm run dev
```

4. ブラウザで http://localhost:5173/ を開く

### ビルド

```bash
npm run build
```

## 📱 使い方

1. **画像をアップロード**: ドラッグ&ドロップまたはクリックしてファイルを選択
2. **順序を調整**: 矢印ボタンで画像の順序を変更
3. **設定を調整**: フレーム間隔（100-2000ms）と品質（1-20）を設定
4. **GIF生成**: 「GIFを生成」ボタンをクリック
5. **ダウンロード**: 生成されたGIFをダウンロード

## 🔒 プライバシー

このアプリケーションは完全にクライアントサイドで動作します：
- 画像は外部サーバーにアップロードされません
- すべての処理はブラウザ内で完結
- データが外部に送信されることはありません

## 🤝 貢献

プルリクエストや課題報告を歓迎します！

## 📄 ライセンス

MIT License

## 🙏 謝辞

- [gif.js](https://github.com/jnordberg/gif.js) - GIF生成ライブラリ
- [react-dropzone](https://github.com/react-dropzone/react-dropzone) - ファイルドロップ機能
- [Vite](https://vitejs.dev/) - 高速ビルドツール