async function func(message, args)
{
    try
    {
        message.channel.send('てすとめっせ～じ');
    }
    catch(e)
    {
        message.channel.send('ちくしょうやりやがった。誰もお前を愛さない。');
    }
}

module.exports = 
{
    name: 'test',
    description: 'dbアクセステスト',
    args: true,
    usage: '<文字列>',
    guildOnly: true,
    adminOnly: true,
    execute(message, args) { func(message, args); }
}