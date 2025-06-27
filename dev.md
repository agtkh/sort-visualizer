# 開発メモ

## GitHub Pagesへのデプロイ手順

1.  **依存関係のインストール**

    プロジェクトの依存関係がインストールされていない場合は、以下のコマンドを実行します。

    ```bash
    npm install
    ```

2.  **デプロイの実行**

    以下のコマンドを実行すると、プロジェクトのビルドとGitHub Pagesへのデプロイが自動的に行われます。

    ```bash
    npm run deploy
    ```

    このコマンドは内部で以下の処理を実行します。
    *   `npm run build`: `vite`を使ってプロジェクトをビルドし、`dist`ディレクトリに静的ファイルを生成します。
    *   `gh-pages -d dist`: `dist`ディレクトリの内容を`gh-pages`ブランチにプッシュします。

    デプロイが完了すると、`https://agtkh.github.io/sort-visualizer` で公開されます。
