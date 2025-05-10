FROM ruby:3.4.2-alpine3.20

# ビルドに必要なパッケージを一度にまとめてインストール
RUN apk add --no-cache \
    build-base \
    mariadb-dev \
    nodejs \
    npm \
    yaml-dev \
    pkgconf \
    tzdata \
    git \
    bash \
    imagemagick \
    imagemagick-dev

WORKDIR /app

# Gemfile を先にコピーして bundle install キャッシュを効かせる
COPY Gemfile Gemfile.lock ./
RUN bundle config set --local build.date --with-cflags="-Wno-error=implicit-function-declaration" && \
    bundle install

# 残りのアプリケーションコードをコピー
COPY . .

CMD ["rails", "server", "-b", "0.0.0.0"]
