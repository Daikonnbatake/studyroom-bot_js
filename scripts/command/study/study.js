const getVoiceActivities = require('../../query/getVoiceActivities');
const getTotalStudyTime = require('../../query/getTotalStudyTime');
const getUserID = require('../../query/getUserID');
const fs = require('fs');
const Log = require('../../utility/log');
const TimeUtilitiy = require('../../utility/timeUtility');
const Embed = require('../../utility/customEmbed');
const ImageGen = require('../../utility/imageGen');
const StudyRank = require('../../utility/studyRank');

async function func(message, args)
{
    try
    {
        const ret = await getVoiceActivities(message.author);
        const userID = await getUserID(message.author);
        const studyTimeSum = TimeUtilitiy.getStudyTime(ret);

        if (studyTimeSum === false)
        {
            let e = new Embed();
            let f = new Embed();

            e.setTitle('自習カードの生成に失敗しました');
            e.setDescription('DB内のあなたのログ中にエラーデータを検出しました。\n管理者が対応を行うまでしばらくお待ちください。\n対応が完了すると再び自習カードが表示されるようになります。\n ※ エラーは管理者に報告されました。対応までしばらくお待ちください。(最大2日)');
            
            f.setTitle('DB内に不正データを検出');
            f.setDescription(`user_id: ${userID}`);
            
            const chID = JSON.parse(fs.readFileSync(`${process.cwd()}/meta/reportCh.json`, 'utf-8')).channelID;
            const reportCh = await message.client.channels.fetch(chID);
            reportCh.send({embeds: [f.embed]});
            message.channel.send({embeds: [e.embed]});
            return;
        }
        const total = await getTotalStudyTime(message.author);
        const study = {total: total, study: studyTimeSum};
        
        const user = message.author;
        const badge = ['_dummy', '_dummy', '_dummy'];

        
        // ランク取得
        let tmp = 0;
        for (const i of study.study) tmp += i;
        const rank = StudyRank.getUserRank(tmp);
        
        const header = {userID: userID, userName: user.username, userIconURL: user.avatarURL(), userTitle: rank};

        for (let i = study.study.length; i < 7; i++) study.study.push(0);

        const a = await ImageGen.genStudyCard(header, badge, study);
        message.channel.send({files: [a]});
    }
    catch(e)
    {
        new Log(e).print();
        let emb = new Embed();
        emb.setTitle('自習カードの生成に失敗しました');
        emb.setDescription('どこでも良いので、このサーバー内のボイスチャットに出入りしてからもう一度お試しください。1度出入りするとBotが情報を正しく取得できるようになります。\nそれでも改善しない場合は報告をお願いいたします。');
        message.channel.send({embeds: [emb.embed]});
    }
}

module.exports = 
{
    args: false,
    guildOnly: false,
    adminOnly: false,
    execute(client, message, args) { func(client, message, args); },
    
    name: 'study',
    usage: '',
    description: '自習カードを表示します。',
    detail:
`
〇 情報が更新されるのはいつ？
    → 毎日朝9時(世界標準時刻の00:00:00) に更新されます。

〇 グラフの時間の合計と7daysの時間の合計が違う？
    → 7days と total は秒単位で計算しているので、
    　グラフ上の数値の合計とは異なる場合があります。

〇 ランクの意味は？
    → 灰筆...過去7日間の自習時間が 0 秒以下
    → 茶筆...過去7日間の自習時間が 1 秒以上
    → 水筆...過去7日間の自習時間が 14 時間以上
    → 青筆...過去7日間の自習時間が 28 時間以上
    → 黄筆...過去7日間の自習時間が 42 時間以上
    → 桃筆...過去7日間の自習時間が 56 時間以上
    → 赤筆...過去7日間の自習時間が 70 時間以上
`,
}