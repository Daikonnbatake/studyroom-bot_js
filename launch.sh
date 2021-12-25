#!/bin/sh

# 前提: botのインストール先は /srb2 直下
# 前提: node.js はインストール済みであること

cd /srb2
npm install

node_modules/.bin/nodemon scripts/bot.js