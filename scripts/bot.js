/* インポート周り */

const FS		= require('fs');
const DISCORD	= require('discord.js');


/* インスタンス等 */

const CLIENT	= new DISCORD.Client({ intents: [DISCORD.Intents.FLAGS.GUILDS] });


/* 設定ファイル読み込み */

const TOKEN		= FS.readFileSync('./meta/token.txt', 'utf-8');


/* テスト用 */
CLIENT.on('message', async message=>
{
	console.log(message.content);
	return;
});


/* コマンドどもを読み取る */


/* 実行 */
CLIENT.login(TOKEN);