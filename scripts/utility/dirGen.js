const fs = require('fs');

const ex = function dirfGen()
{
    // DBの設定ファイルを生成
    const cwd = process.cwd();
    
    if (!fs.existsSync(`${cwd}/tmp`))
    {
        fs.mkdirSync(`${cwd}/tmp`);
        fs.mkdirSync(`${cwd}/tmp/studyCards`);
    }

}

module.exports = ex;