const Log = require('../../utility/log');
const addChannelID = require('../../query/addChannelID');
const switchRated = require('../../query/switchRated');

async function func(message, args)
{
    try
    {
        const ch = message.guild.channels.cache.find((channel) => channel.name === args[0]);
        await addChannelID(ch);
        const ret = await switchRated(ch);
        if (ret === 1) message.channel.send(`「${ch.name}」は自習室になりました。`);
        else message.channel.send(`「${ch.name}」は自習室ではなくなりました。`);
    }
    catch(e)
    {
        new Log(e).print();
        message.channel.send(`「${args[0]}」は存在しません。`);
    }
}

module.exports = 
{
    name: 'rated',
    description: '引数に与えられたチャンネルをランキングに反映するかどうかを切り替える',
    args: true,
    usage: '<チャンネル名>',
    guildOnly: true,
    adminOnly: true,
    execute(message, args){func(message, args)},
}