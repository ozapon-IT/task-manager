FROM php:8.2-fpm

COPY docker/php/php.ini /usr/local/etc/php/

# 必要なシステム依存関係を追加
RUN apt-get update && apt-get install -y \
    zip unzip libzip-dev libonig-dev libpq-dev \
    && docker-php-ext-install pdo_mysql zip

# composer インストール (composer:2からコピー)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Laravel依存パッケージ (本番時にこの2行を戻す)
# COPY backend/composer.json backend/composer.lock ./
# RUN composer install --no-scripts --no-progress --prefer-dist

CMD ["php-fpm"]