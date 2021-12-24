/* ボイスチャンネルの監視をやるクラス */


/* ====================================================================================== */

/* インポート周り */
const FS = require('fs');
const DISCORD = require('discord.js');

const confGen = require('./utility/confGen');
const voiceObserver = require('./observer/voiceObserver.js');

/* インテントのフラグたて */
let intentFlag = new DISCORD.Intents
([
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
	DISCORD.Intents.FLAGS.DIRECT_MESSAGES,
	DISCORD.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
	// DISCORD.Intents.FLAGS.DIRECT_MESSAGE_TYPING
]);


/* Botのインスタンスを作成 */
const CLIENT = new DISCORD.Client({ intents: intentFlag });
CLIENT.commands = new DISCORD.Collection();

/* 設定ファイル読み込み */
const TOKEN	 = FS.readFileSync('./meta/token.txt', 'utf-8');

/* 各種定数 */
const cwd = process.cwd();
const commandPrefix = 'dev';
const commandFiles = FS.readdirSync(cwd  + '/scripts/command').filter(file => file.endsWith('.js'));

/* コマンドを読み込む */
for(const file of commandFiles)
{
	const command = require(cwd + `/scripts/command/${file}`);
	CLIENT.commands.set(command.name, command);
}

/* コマンド解釈&実行 */
CLIENT.on('messageCreate', message=>
{
	// コマンド判定とBot無視
	if (!message.content.startsWith(commandPrefix) || message.author.bot) return;

	const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = CLIENT.commands.get(commandName);

	// 存在しないコマンドは無視
	if(!CLIENT.commands.has(commandName)) return;

	try
	{
		command.execute(message, args);
	}
	catch(error)
	{
		console.error(error);
		message.reply('エラーが発生しました。お前のせいです。あーあ。');
	}
});

/* vc 監視 */
CLIENT.on('voiceStateUpdate', (oldState, newState)=>
{
	let user = oldState.member.user;
	let newCh = newState.channel;
	let oldCh = oldState.channel;
	let newGuild = newState.guild;
	let oldGuild = oldState.guild;

	// 入室
	if((oldState.channelId === null) && (newState.channelId != null))
		voiceObserver.VoiceIn(newGuild, newCh, user);
	
	// 退室
	if((oldState.channelId != null) && (newState.channelId === null))
		voiceObserver.VoiceOut(oldGuild, oldCh, user);

	// 移動
	if ((oldState.channelId != null) && (newState.channelId != null) && (oldState.channelId != newState.channelId))
	{
		voiceObserver.VoiceIn(newGuild, newCh, user);
		voiceObserver.VoiceOut(oldGuild, oldCh, user);
	}
});

/* 設定ファイル生成 */
confGen;

/* 実行 */
CLIENT.login(TOKEN);