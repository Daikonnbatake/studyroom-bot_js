
/* 存在しない場合confファイルを生成 */
const confGen = require('./utility/confGen.js');
confGen();

/* 存在しない場合tmpディレクトリを生成 */
const dirGen = require('./utility/dirGen');
dirGen();

/* インポート周り */
const FS = require('fs');
const DISCORD = require('discord.js');
const cron = require('node-cron');
const Log = require('./utility/log');
const voiceObserver = require('./observer/voiceObserver.js');
const Embed = require('./utility/customEmbed');
const TextDeco = require('./utility/textDecorator');

/* インテントのフラグたて */
let intentFlag = new DISCORD.Intents
([
	// サーバー
	DISCORD.Intents.FLAGS.GUILDS,
	DISCORD.Intents.FLAGS.GUILD_MEMBERS,
	// DISCORD.Intents.FLAGS.GUILD_BANS,
	DISCORD.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	DISCORD.Intents.FLAGS.GUILD_INTEGRATIONS,
	DISCORD.Intents.FLAGS.GUILD_WEBHOOKS,
	// DISCORD.Intents.FLAGS.GUILD_INVITES,
	DISCORD.Intents.FLAGS.GUILD_VOICE_STATES,
	DISCORD.Intents.FLAGS.GUILD_PRESENCES,
	DISCORD.Intents.FLAGS.GUILD_MESSAGES,
	DISCORD.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	// DISCORD.Intents.FLAGS.GUILD_MESSAGE_TYPING,

	// DM
	DISCORD.Intents.FLAGS.DIRECT_MESSAGES,
	DISCORD.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	// DISCORD.Intents.FLAGS.DIRECT_MESSAGE_TYPING
]);


/* Botのインスタンスを作成 */
const CLIENT = new DISCORD.Client({ intents: intentFlag });
CLIENT.commands = new DISCORD.Collection();

/* 各種定数 */
const cwd = process.cwd();
const TOKEN	 = JSON.parse(FS.readFileSync(cwd + '/meta/token.json')).token;
const commandPrefix = JSON.parse(FS.readFileSync(cwd + '/meta/prefix.json','utf-8')).prefix;
const commandFolders = FS.readdirSync(cwd + '/scripts/command');

/* コマンドを読み込む */
for (const folder of commandFolders)
{
	// template.js は無視
	if (folder.slice(folder.length-3) === '.js') continue;
	
	const commandFiles = FS.readdirSync(`${cwd}/scripts/command/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles)
	{
		const command = require(`${cwd}/scripts/command/${folder}/${file}`);
		CLIENT.commands.set(command.name, command);
	}
}

/* コマンド解釈&実行 */
CLIENT.on('messageCreate', message =>
{
	// コマンド判定とBot無視
	if (!message.content.startsWith(commandPrefix) || message.author.bot) return;

	// 書き込み権限がない場所でコマンドが実行された時は無視する(権限エラーでbotが落ちるのを防ぐ)
	if (!message.channel.permissionsFor(message.client.user).has('SEND_MESSAGES')) return;

	const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = CLIENT.commands.get(commandName);
	
	// 存在しないコマンドは無視
	if(!CLIENT.commands.has(commandName))
	{
		let e = new Embed();
		e.setTitle('コマンドがありません。');
		e.setDescription(TextDeco.codeblock(`コマンド: ${commandPrefix} ${commandName} は存在しません。`));
		return message.channel.send({embeds: [e.embed]});
	}
	
	// 引数が足りない場合は受け付けない
	if (command.args && !args.length)
	{
		let e = new Embed();
		e.setTitle('引数に不備があります。');
		e.setDescription(TextDeco.codeblock(`コマンドを実行するために必要な引数を検知できませんでした。\nヘルプを参照してコマンドを確認してください。\n\n  → ${commandPrefix} help ${commandName} でヘルプを表示します。`));
		return message.channel.send({embeds: [e.embed]});
	}
	
	// サーバーのみ実行可能なコマンドをDMから受け取った時は受け付けない
	if (command.guildOnly && message.channel.type === 'dm')
	{
		let e = new Embed();
		e.setTitle('DMでこのコマンドは使用できません。');
		e.setDescription(TextDeco.codeblock(`コマンド: ${commandPrefix} ${commandName} はDMで使用することができません。\nこのbotが導入されているサーバーにてご利用ください。`))
		return message.channel.send({embeds: [e.embed]});
	}

	// 権限を要するコマンドは管理者以外弾く
	if (command.adminOnly && !message.guild.members.cache.find((member) => member.id === message.author.id).permissions.has('ADMINISTRATOR'))
	{
		let e = new Embed();
		e.setTitle('権限がありません');
		e.setDescription(TextDeco.codeblock(`コマンド: ${commandPrefix} ${commandName} はこのサーバーの管理者のみが使用できます。`))

		return message.channel.send({embeds: [e.embed]});
	}

	try { command.execute(message, args); }
	catch(error)
	{
		console.error(error);
		message.reply({embeds: [new Embed().error(error)]});
	}
});

/* vc 監視 */

CLIENT.on('voiceStateUpdate', async (oldState, newState)=>
{
	// 本番環境のbotだけがsqlにアクティビティを送信する
	if (commandPrefix === 'srb')
	{
		let user = oldState.member.user;
		let newCh = newState.channel;
		let oldCh = oldState.channel;
		
		// botは無視
		if (user.bot) return;
	
		// 入室
		if((oldState.channelId === null) && (newState.channelId != null)) await voiceObserver.VoiceIn(newCh.guild, newCh, user);
	
		// 退室
		if((oldState.channelId != null) && (newState.channelId === null)) await voiceObserver.VoiceOut(oldCh.guild, oldCh, user);
	
		// 移動
		if ((oldState.channelId != null) && (newState.channelId != null) && (oldState.channelId != newState.channelId))
		{
			await voiceObserver.VoiceOut(oldCh.guild, oldCh, user);
			await voiceObserver.VoiceIn(newCh.guild, newCh, user);
		}
	}
});

CLIENT.on('ready', ()=>
{
	// 本番環境なら help を視聴中を設定する
	if (commandPrefix === 'srb') CLIENT.user.setActivity(`srb help `, {type: 'WATCHING'});

	// 1日1回各種データを集計
	cron.schedule('0 0 0 * * *', async()=>
	{

	})
})

/* 実行 */
CLIENT.login(TOKEN);