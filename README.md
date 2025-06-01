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

# タスク管理アプリ 仕様書 (v0.1)

## 1. 概要

本ドキュメントは、個人開発ポートフォリオ向けに作成する **案件・タスク管理 SPA** の基本仕様をまとめたものである。Laravel (API) と Nuxt 3 (SPA) を用いて、案件単位でタスクを登録・進捗管理できるシンプルな Web アプリを目指す。

## 2. 用語定義

| 用語               | 意味                                 |
| ---------------- | ---------------------------------- |
| **案件 (Project)** | 顧客や自社内のプロジェクトを示す単位。タイトル・説明・納期などを持つ |
| **タスク (Task)**   | 案件に紐づく作業項目。内容・担当者・期限・状態などを持つ       |
| **ステータス**        | 案件・タスクの進行状況を表す列挙値。詳細は §7 を参照       |

## 3. 目的・ゴール

* 案件ごとにタスクを管理し、進捗を俯瞰できる
* SPA によりページ遷移レスで快適な操作性を提供
* 今後の拡張（ガントチャート、コメント、共有）を見据えたシンプルな設計

## 4. 主要機能要件

### 4.1 案件管理

* 一覧表示（ページネーション / ソート / 検索）
* 新規作成・編集・削除（論理削除）
* ステータス更新（\*ドラッグ & ドロップ UI は拡張候補）

### 4.2 タスク管理

* 案件詳細画面で CRUD 操作
* 担当者（任意）、期限、優先度、メモ入力
* タスク状態をボード風 UI で変更（予定）

### 4.3 UI / UX

* Nuxt 3 + Pinia で状態管理
* Composition API & TypeScript
* ダークモード対応（Vuetify or Tailwind base）
* バリデーションは VeeValidate を想定

## 5. 非機能要件

| 区分      | 要件                                                                                    |
| ------- | ------------------------------------------------------------------------------------- |
| パフォーマンス | 総合 Lighthouse スコア 90 以上を目標                                                            |
| セキュリティ  | Laravel Sanctum で Cookie 認証。OWASP Top 10 を意識                                          |
| テスト     | API: PHPUnit / Pest、Front: Vitest / Cypress                                           |
| デプロイ    | Docker Compose (Laravel + Nginx + MySQL / Nuxt) を前提。Render などへ GitHub Actions で CI/CD |

## 6. システム構成図（論理）

```
[Browser]
   │   (HTTPS/JSON)
[Nuxt3 SPA] ───▶ [Laravel API] ───▶ [MySQL]
```

## 7. ステータス定義

| エンティティ  | ステータス                                         | 説明                     |
| ------- | --------------------------------------------- | ---------------------- |
| Project | `draft` / `active` / `completed` / `archived` | 作成中 → 進行中 → 完了 → アーカイブ |
| Task    | `todo` / `in_progress` / `blocked` / `done`   | 未着手 → 作業中 → ブロック → 完了  |

## 8. データモデル（ER 図簡略）

```
Project (id, title, description, due_date, status, …)
  │ 1
  └───< Task (id, project_id, title, description, due_date, status, priority, …)
```

## 9. API エンドポイント概要（例）

| Method | Path                       | 説明      |
| ------ | -------------------------- | ------- |
| GET    | `/api/projects`            | 案件一覧取得  |
| POST   | `/api/projects`            | 新規案件作成  |
| GET    | `/api/projects/{id}`       | 案件詳細取得  |
| PUT    | `/api/projects/{id}`       | 案件更新    |
| DELETE | `/api/projects/{id}`       | 案件削除    |
| GET    | `/api/projects/{id}/tasks` | タスク一覧取得 |
| POST   | `/api/projects/{id}/tasks` | タスク追加   |

> ※ 認可は Sanctum ミドルウェアで保護

## 10. 画面一覧

| 画面ID | 名称             | 機能概要               |
| ---- | -------------- | ------------------ |
| P-01 | ダッシュボード        | 直近案件・タスクサマリをカード表示  |
| P-02 | 案件一覧           | 検索 & フィルタ、ページネーション |
| P-03 | 案件詳細           | タスクボード + 案件メタ情報    |
| M-01 | モーダル: 案件作成/編集  | フォームバリデーション付き      |
| M-02 | モーダル: タスク作成/編集 | 同上                 |

## 11. 将来拡張計画

1. **ガントチャート** — Chart.js + dayjs で期間可視化
2. **コメント機能** — Quill.js ベースのリッチテキスト対応
3. **共有** — ユーザ/チームを追加し RBAC でアクセス制御
4. **通知** — Web Push & メール通知

## 12. スケジュール案

| フェーズ   | 期間                 | マイルストーン                      |
| ------ | ------------------ | ---------------------------- |
| 設計     | 2025-06-01 – 06-07 | 本仕様書確定、ER 図作成                |
| MVP 開発 | 06-08 – 06-30      | Project/Task CRUD + 基本 UI 完了 |
| 外部公開   | 07-01              | GitHub README 整備 & デプロイ      |

---

 **更新履歴**

| 日付         | 版   | 変更概要 |
| ---------- | --- | ---- |
| 2025-06-01 | 0.1 | 初版作成 |
