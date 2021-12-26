class TextDecorator
{
    static italic(value) { return `*${value}*`; }
    static bold(value) { return `**${value}**`; }
    static underline(value) { return `__${value}__`}
    static strikethrough(value) { return `~~${value}~~`; }
    static spoiler(value) { return `||${value}||`; }
    static code(value) { return ` \`${value}\` ` }
    static codeblock(value, highlight = '') { return `\`\`\`\n${highlight}\n${value}\n\`\`\``; }
    static quote(value) { return `> ${value}`; }
}

module.exports = TextDecorator;