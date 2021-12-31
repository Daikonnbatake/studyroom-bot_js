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
    args: true,
    guildOnly: true,
    adminOnly: true,
    execute(message, args){func(message, args)},
    
    name: 'rated',
    usage: '<チャンネル名>',
    description: '<チャンネル名> のボイスチャンネルを自習室に設定します。',
    detail:
    `
〇 自習室化したチャンネルはどうなる？
    → そのチャンネルに入っていると自習時間がカウントされます。

〇 自習室化を解除するには？
    → もう一度このコマンドを打つと自習室化が解除されます。
    → 解除されるとその自習室での活動は無かったことになります。

〇 自習室化を解除した後、もう一度自習室に登録しなおしたら？
    → いままでの活動記録が復活します。

〇 自習室にしていなかった既存チャンネルを自習室化したら？
    → そのチャンネルでの活動記録※ が自習時間に反映されます。
    → 登録し忘れても安心というわけです。
    → 遊び系チャンネルを自習室に転用することはお勧めしません。

※ 活動記録は bot がサーバーに追加された時以降の記録のみが有効です。`,
}