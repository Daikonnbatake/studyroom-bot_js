const fs = require('fs');

const ex = function confGen()
{
    // DBの設定ファイルを生成
    const cwd = process.cwd();
    
    if (!fs.existsSync(`${cwd}/meta/db-conf.json`))
    {
        const dbConfJson = {"host": "", "port": 3306, "user": "", "password": "", "database": "discord_srb"};
        fs.writeFileSync(`${cwd}/meta/db-conf.json`, JSON.stringify(dbConfJson, null, 4));
    }

    // tokenの設定ファイルを生成
    if (!fs.existsSync(`${cwd}/meta/token.txt`))
    {
        fs.writeFileSync(`${cwd}/meta/token.txt`, '[ここにbotのtokenを張る]');
    }
}

module.exports = ex;