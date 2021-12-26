const Embed = require('../../utility/customEmbed');

async function body(message, args)
{
    message.channel.send('てすとめっせ～じ');
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