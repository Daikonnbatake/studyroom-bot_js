/* インポート周り */
const FS = require('fs');
const DISCORD = require('discord.js');


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


/* 設定ファイル読み込み */
const TOKEN	 = FS.readFileSync('./meta/token.txt', 'utf-8');


/* テスト用 */
CLIENT.on('messageCreate', message=>
{
	console.log(message.content);
});


/* 実行 */
CLIENT.login(TOKEN);