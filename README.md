# OPEN GD

GD後の相互評価を、学生入力と管理者レポートに分けて扱うWebアプリです。

## 使い方

1. ローカルサーバーを起動します。

   ```sh
   node server.mjs
   ```

2. ブラウザで次を開きます。

   ```txt
   http://127.0.0.1:4173
   ```

3. 管理者画面に入り、Supabase Authで作成した管理者メールアドレスとパスワードでログインします。

4. 作成されたセッションコードを参加者に共有します。

## 主な機能

- GDタイプ別の評価質問
- メンバーごとの相互評価入力
- ブラウザ内保存によるセッション管理
- 5軸スコアとタイプ判定
- 管理者向けの個人レポート
- CSV出力

## Supabase連携

複数端末から同じセッションに参加する場合は、Supabaseを使います。

1. SupabaseのSQL Editorで [supabase-schema.sql](/Users/hatakeiichiro/Documents/New%20project/supabase-schema.sql) の中身を実行します。
2. SupabaseのAuthenticationで管理者ユーザーを作成します。
3. [src/config.js](/Users/hatakeiichiro/Documents/New%20project/src/config.js) にSupabaseのProject URLを入れます。

   ```js
   window.OPEN_GD_CONFIG = {
     SUPABASE_URL: "https://xxxxx.supabase.co",
     SUPABASE_ANON_KEY: "sb_publishable_xYT51KUOTcBLvOoJh_kTRA_3aCZUyzn",
     ADMIN_EMAILS: ["admin@example.com"],
   };
   ```

Project URLが空の場合は、これまで通りブラウザ内保存で動きます。

## 注意

管理者ログインはSupabase Authを使います。`ADMIN_EMAILS` にメールアドレスを入れると、そのメールだけを管理者として許可します。空配列のままだとSupabase Authでログインできるユーザーを管理者として扱います。

学生側はセッションコードと登録名で参加します。より厳密にする場合は、参加者ごとの招待トークンや回答締切などを追加してください。

## Vercel公開

Vercelでは静的サイトとして公開できます。

1. GitHubにこのフォルダをアップロードします。
2. Vercelで `Add New...` → `Project` を選びます。
3. GitHubのリポジトリを選びます。
4. Framework Presetは `Other` のままで進めます。
5. Deployを押します。

公開後、Vercelが発行するURLを参加者に共有します。
