/* モジュール読み込み */

const {Client, Intents} = require('discord.js');
const FS = require('fs');

/* ファイル読み込み */
const CWD = process.cwd();

const Token = FS.readFileSync('./meta/token.txt', 'utf-8').toString();

const client =  new Client({intents: Object.keys(Intents.FLAGS)});

client.on('ready', ()=>
{
    console.log(`${client.user.tag} でログインしています。` );
});

client.on('messageCreate', async msg =>
{
    if (msg.content === 'ping')
    {
        msg.channel.send('pong!');
    }
});

client.login(Token);