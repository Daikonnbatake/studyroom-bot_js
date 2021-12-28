const getVoiceActivities = require('../../query/getVoiceActivities');
const getTotalStudyTime = require('../../query/getTotalStudyTime');
const getUserID = require('../../query/getUserID');
const Log = require('../../utility/log');
const TimeUtilitiy = require('../../utility/timeUtility');
const ImageGen = require('../../utility/imageGen');

async function func(message, args)
{
    try
    {
        const ret = await getVoiceActivities(message.author);
        const userID = await getUserID(message.author);
        //const total = await getTotalStudyTime(message.author);

        const user = message.author;
        const header = {userID: userID, userName: user.username, userIconURL: user.avatarURL(), userTitle: 'カフェイン中毒者'};
        const badge = ['_dummy', '_dummy', '_dummy'];
        let study;
        if (0 < ret.length) study = {total: '00', study: TimeUtilitiy.getStudyTime(ret)};
        else study = {total: '00', study: [0, 0, 0, 0, 0, 0, 0]};

        const a = await ImageGen.genStudyCard(header, badge, study);
        message.channel.send({files: [a]});
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