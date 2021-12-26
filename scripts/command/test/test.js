const Embed = require('../../utility/customEmbed');
const Time = require('../../utility/timeUtility');

async function body(message, args)
{
    let e = new Embed;
    e.setTitle('テスト送信');
    e.addField('今日の00:00:00', Time.getToday().toLocaleString('ja'), true);
    e.addField('昨日の23:59:59', Time.getYesterday().toLocaleString('ja'), true);
    e.addField('一週間前の00:00:00', Time.getOneWeekAgo().toLocaleString('ja'), true);

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