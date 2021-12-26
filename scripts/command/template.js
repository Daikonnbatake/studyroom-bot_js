const Embed = require('../utility/customEmbed');

async function body(message, args)
{
    message.channel.send('てすとめっせ～じ');
}

async function func(message, args)
{
    try { body(message, args); }
    catch(e) { message.channel.send({embeds: [new Embed().error(e)]}); }
}

module.exports = 
{
    name: 'template',
    description: 'テンプレート',
    args: true,
    usage: '<文字列>',
    guildOnly: true,
    adminOnly: true,
    execute(message, args) { func(message, args); }
}