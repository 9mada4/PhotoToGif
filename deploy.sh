#!/bin/bash

# 手動デプロイスクリプト
echo "🚀 Photo to GIF アプリをデプロイ中..."

# ビルド
echo "📦 ビルド中..."
cd photo-to-gif-app
npm install
npm run build

# gh-pagesブランチにデプロイ
echo "🌐 GitHub Pagesにデプロイ中..."
cd ..
git checkout --orphan gh-pages 2>/dev/null || git checkout gh-pages
git rm -rf . 2>/dev/null || true
cp -r photo-to-gif-app/dist/* .
cp photo-to-gif-app/dist/.htaccess . 2>/dev/null || true

# コミットとプッシュ
git add .
git commit -m "Deploy: $(date)"
git push origin gh-pages --force

# メインブランチに戻る
git checkout main

echo "✅ デプロイ完了!"
echo "🔗 https://$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1.github.io\/\2/')"
