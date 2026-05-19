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
- 学生のセルフ参加登録
- チームごとのメンバー人数設定
- 設定人数が揃うまでの待機画面と2秒ごとの自動更新
- メンバーごとの相互評価入力
- 学生マイページで過去セッションの結果を確認
- ブラウザ内保存によるセッション管理
- 5軸スコアとタイプ判定
- チーム内平均・順位・平均との差の表示
- 過去全開催を含めた全体順位・平均との差の表示
- 管理者向けの個人レポート
- CSV出力

## Supabase連携

複数端末から同じセッションに参加する場合は、Supabaseを使います。

1. SupabaseのSQL Editorで [supabase-schema.sql](/Users/hatakeiichiro/Documents/New%20project/supabase-schema.sql) の中身を実行します。
2. SupabaseのAuthenticationで管理者ユーザーを作成します。
3. ローカル確認では `src/config.example.js` を参考に `src/config.local.js` を作ります。このファイルはGitHubにはアップロードしません。

   ```js
   window.OPEN_GD_CONFIG = {
     SUPABASE_URL: "https://xxxxx.supabase.co",
     SUPABASE_ANON_KEY: "sb_publishable_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
     ADMIN_EMAILS: ["admin@example.com"],
   };
   ```

Project URLが空の場合は、これまで通りブラウザ内保存で動きます。

## 注意

管理者ログインはSupabase Authを使います。`ADMIN_EMAILS` にメールアドレスを入れると、そのメールだけを管理者として許可します。空配列のままだとSupabase Authでログインできるユーザーを管理者として扱います。

学生はセッションコード、チーム、メンバー人数、氏名、メールアドレスで自分をセッションに登録して参加します。同じチームを選んだ学生同士だけが相互評価の対象になります。

チーム人数は2〜10人から選べます。各チームで最初に入室した学生の人数設定がそのチームの人数として固定され、以降の学生はその人数設定に合わせて待機します。設定人数が揃うまで評価は開始できず、待機画面は2秒ごとに自動更新されます。満員になったチームには追加参加できません。

全開催ランキングは、管理者がログインした時、または管理者がセッション詳細を開いた時に更新されます。学生側には名前やメールアドレスの一覧ではなく、公開用IDごとの集計済み順位だけを読み込ませます。

## Vercel公開

Vercelでは静的サイトとして公開できます。

1. GitHubにこのフォルダをアップロードします。
2. Vercelで `Add New...` → `Project` を選びます。
3. GitHubのリポジトリを選びます。
4. Framework Presetは `Other` のままで進めます。
5. Deployを押します。

公開後、Vercelが発行するURLを参加者に共有します。

VercelのProject Settingsで、以下のEnvironment Variablesを設定してください。

```txt
SUPABASE_URL
SUPABASE_ANON_KEY
ADMIN_EMAILS
```

`ADMIN_EMAILS` は管理者メールをカンマ区切りで入れます。

VercelのBuild設定は以下です。

```txt
Build Command: node build.mjs
Output Directory: dist
```
