# Task Manager App

Laravel + Nuxt 3 + Docker で構築した個人開発用タスク管理アプリです。

## 開発環境構築手順

### 前提

- Docker / Docker Compose がインストール済み
- Git clone 済み

### アプリケーション起動
- $ docker compose up -d --build

### Laravel セットアップ
- $ docker compose exec app bash
- $ composer install
- $ cp .env.example .env
- $ php artisan key:generate
- $ chmod -R 777 storage bootstrap/cache

### Nuxt セットアップ
- $ docker compose exec front sh
- $ npm install


