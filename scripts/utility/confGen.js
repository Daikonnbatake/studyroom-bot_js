const fs = require('fs');

function confGen()
{
    // DBの設定ファイルを生成
    const cwd = process.cwd();
    
    if (fs.existsSync(`${cwd}/meta/db-conf.json`))
    {
        const dbConfJson = { "host": "", "port": 3306, "user": "", "password": "", "database": "discord_srb"};
        fs.writeFile(`${cwd}/meta/db-conf.json`, JSON.stringify(dbConfJson, null, '\t'));
    }

    // tokenの設定ファイルを生成
    if (fs.existsSync(`${cwd}/meta/token.txt`))
    {
        fs.writeFile(`${cwd}/meta/db-conf.json`, '[ここにbotのtokenを張る]');
    }
}

module.exports = confGen;