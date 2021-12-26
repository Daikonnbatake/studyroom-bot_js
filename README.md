# studyroom-bot_js
自習室 bot を discord.js で書き直したやつ。

## bot起動メモ

    cd /srb2
    nohup node_modules/.bin/nodemon scripts/bot.js < /dev/null &

※ launch.sh を使うとなぜか二重で起動してしまうので使わない。出来れば解決策を見つけたいが。

## 注意
 - [Issues #17](https://github.com/Daikonnbatake/studyroom-bot_js/issues/17) bot を起動するサーバーのタイムゾーンは必ず Etc/UTC にしておくこと。
