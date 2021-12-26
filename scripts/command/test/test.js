const Embed = require('../../utility/customEmbed');
const Time = require('../../utility/timeUtility');

const TextDeco = require('../../utility/textDecorator');
const getVoiceActivities = require('../../query/getVoiceActivities');

async function body(message, args)
{
    let e = new Embed;
    const studyTime = await getVoiceActivities(message.author);
    
    let log = '■ データベース\n';
    for (const i of studyTime) { log += `  ${i.status} ${i.timestamp.toLocaleString('ja')}\n`; }
    log += '\n■ 加工後\n';
    for (const i of Time.getStudyTime(studyTime))
    {
        for (const j of i) { log += `  ${j.status} ${j.timestamp.toLocaleString('ja')}\n`}
        log += '\n'
    }

    
    e.setTitle('テスト送信');
    e.addField('今日の00:00:00', Time.getToday().toLocaleString('ja'), true);
    e.addField('昨日の23:59:59', Time.getYesterday().toLocaleString('ja'), true);
    e.addField('一週間前の00:00:00', Time.getOneWeekAgo().toLocaleString('ja'), true);
    e.addField('VC履歴', TextDeco.codeblock(log));

    message.channel.send({embeds: [e.embed]});
}

async function func(message, args)
{
    try { await body(message, args); }
    catch(e) { message.channel.send({embeds: [new Embed().error(e)]}); }
}

module.exports = 
{
    name: 'test',
    description: 'テスト',
    args: false,
    usage: '',
    guildOnly: true,
    adminOnly: true,
    execute(message, args) { func(message, args); }
}