const fs = require('fs');

const ex = function dirfGen()
{
    const cwd = process.cwd();
    
    if (!fs.existsSync(`${cwd}/tmp`)) fs.mkdirSync(`${cwd}/tmp`);
    if (!fs.existsSync(`${cwd}/tmp/images`)) fs.mkdirSync(`${cwd}/tmp/images`);
    if (!fs.existsSync(`${cwd}/tmp/header`)) fs.mkdirSync(`${cwd}/tmp/header`);
    if (!fs.existsSync(`${cwd}/tmp/studyCards`)) fs.mkdirSync(`${cwd}/tmp/studyCards`);

}

module.exports = ex;