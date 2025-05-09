FROM ruby:3.4.2-alpine3.20

# ビルドに必要なパッケージを一度にまとめてインストール
RUN apk add --no-cache build-base mariadb-dev nodejs npm yaml-dev pkgconf

WORKDIR /app

# Gemfile を先にコピーして bundle install キャッシュを効かせる
COPY backend/Gemfile backend/Gemfile.lock ./
RUN bundle install

# 残りのアプリケーションコードをコピー
COPY . .

CMD ["rails", "server", "-b", "0.0.0.0"]
