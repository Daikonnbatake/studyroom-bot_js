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
    if (!fs.existsSync(`${cwd}/meta/token.json`))
    {
        fs.writeFileSync(`${cwd}/meta/token.json`, '{"token" : "[ここにトークン]"}');
    }

    // prefixの設定ファイルを生成
    if (!fs.existsSync(`${cwd}/meta/prefix.txt`))
    {
        fs.writeFileSync(`${cwd}/meta/prefix.txt`, 'srb');
    }
}

module.exports = ex;