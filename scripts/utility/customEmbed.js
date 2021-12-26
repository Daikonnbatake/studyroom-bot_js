const discord = require('discord.js');
const textDecorator = require('./textDecorator');

class Embed
{
    /* static */
    static embedColor = 0x64c259;
    
    /* コンストラクタ */
    constructor()
    {
        const timeDifference = 3600 * 9 * 1000;
        const timestamp = new Date(Date.now() + timeDifference).toLocaleString('ja');

        this.embed = new discord.MessageEmbed()
        .setColor(Embed.embedColor)
        .setFooter(`|  by Daikonnbatake  |  ${timestamp}  |`, 'https://avatars.githubusercontent.com/u/36390388?v=4');
    }

    /* ベース */
    setTitle(title = '') { this.embed.setTitle(textDecorator.bold(title)); }
    setDescription(description = '') { this.embed.setDescription(description); }
    setFooter(text = '', iconURL = '') { this.embed.setFooter(test, iconURL); }
    setImage(url = '') { this.embed.setImage(url); }
    addField(name = 'なし', value = 'なし', inline = false) { this.embed.addField(name, value, inline); }

    /* 拡張 */
    error(e)
    {
        this.setTitle('Error');
        this.setDescription(`${textDecorator.code(e.name)}${textDecorator.codeblock(`file: ${e.fileName}\nline: ${e.lineNumber}`)} ${textDecorator.codeblock(e.message)}`);
        return this.embed;
    }
}

module.exports = Embed;