const getVoiceActivities = require('../../query/getVoiceActivities');
const Log = require('../../utility/log');
const TimeUtilitiy = require('../../utility/timeUtility');

async function func(message, args)
{
    try
    {
        let ret = await getVoiceActivities(message.author);
        message.channel.send(`現在の自習時間は ${TimeUtilitiy.getStudyTime(ret)} 時間です。`);
    }
    catch(e)
    {
        new Log(e).print();
        message.channel.send('ちくしょうやりやがった。誰もお前を愛さない。');
    }
}

module.exports = 
{
    name: 'study',
    description: '自習時間を可視化',
    args: false,
    usage: '',
    guildOnly: false,
    adminOnly: false,
    execute(message, args) { func(message, args); }
}