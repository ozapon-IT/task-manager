# Task Manager App

Laravel + Nuxt 3 + Docker で構築した個人開発用タスク管理アプリです。

## 開発環境構築手順

### 前提

- Docker / Docker Compose がインストール済み
- Githubアカウント作成済み

### アプリケーション起動

1. `git clone https://github.com/ozapon-IT/task-manager.git`SSH 鍵を使う場合は`git clone git@github.com:ozapon-IT/task-manager.git`
2. `docker-compose up -d --build`

> MySQL、phpMyAdmin、MailHogは、OSによって起動しない場合があるのでそれぞれのPCに合わせて `docker-compose.yml` ファイルを編集してください。

### Laravel セットアップ

1. `docker compose exec app bash`
2. `composer install`
3. `cp .env.example .env`
4. `php artisan key:generate`
5. `chmod -R 777 storage bootstrap/cache`

### Nuxt セットアップ

1. `docker compose exec front sh`
2. `npm install`


