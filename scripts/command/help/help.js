const fs = require('fs');
const Embed = require('../../utility/customEmbed');
const TextDeco = require('../../utility/textDecorator');

const commandPrefix = JSON.parse(fs.readFileSync(`${process.cwd()}/meta/prefix.json`, 'utf-8')).prefix;


async function body(message, args)
{
    const commands = message.client.commands;
    const name = args[0];
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
    let e = new Embed();
    e.setTitle('ヘルプ');
    
    // 引数無し
    if (!args.length || name === 'help')
    {
        let commandList = '';
        for (const i of commands) commandList += TextDeco.bold(TextDeco.code(`${i[1].name}`)) + ' ';
        
        e.setDescription(`各コマンドの詳しい情報は ${TextDeco.code(`${commandPrefix} help [コマンド名]`)} で確認できます。`);
        e.addField('■ コマンド一覧 ■', commandList, true);
        e.addField('■ 自習時間のカウントについて ■', `自習時間は ${TextDeco.code('rated')} コマンドによって自習室として登録されたボイスチャンネルに入室していた時間のみがカウントされます。詳細は[こちら](https://github.com/Daikonnbatake/studyroom-bot_js/blob/master/README.md)。`, true);
        e.addField('■ 免責事項 ■', `このbotは素人学生の趣味の範囲で開発/運営されていますので、完成度に問題がある可能性があります。可能な限り対応していく所存ですが、それを踏まえたうえでお遊び程度の気持ちで使っていただけますと幸いです。またやむを得ずデータを削除する場合は事前に告知いたしますが、データを残してほしいなどの要望は受け付けませんのでご了承ください。`);
        e.addField('■ GitHub ■', 'このbotについての質問やバグ報告は[こちら](https://github.com/Daikonnbatake/studyroom-bot_js/issues)からいつでも受け付けています。なにか気づくことがあれば気軽に何でも書いていただけますと幸いです。')
    }
    
    // コマンドが存在しない場合
    else if (!command)
    {
        e.setDescription(TextDeco.codeblock(`${name} は有効なコマンドではありません。`));
    }
    
    else
    {
        e.setTitle(`ヘルプ: ${command.name}`);
        e.setDescription(command.description);
        e.addField('■ コマンド ■', TextDeco.codeblock(`${commandPrefix} ${command.name} ${command.usage}`));
        e.addField('■ 詳細 ■', TextDeco.codeblock(String(commands.detail)));
    }

    message.channel.send({embeds: [e.embed]});
}

async function func(message, args)
{
    try { body(message, args); }
    catch(e) { message.channel.send({embeds: [new Embed().error(e)]}); }
}

module.exports = 
{
    name: 'help',
    description: 'ヘルプを表示',
    args: false,
    usage: '<調べたいコマンド>',
    guildOnly: false,
    adminOnly: false,
    execute(message, args) { func(message, args); }
}