const fs = require('fs');

class StudyRank
{
    static getUserRank(time = 0)
    {
        const rank = JSON.parse(fs.readFileSync(`${process.cwd()}/meta/studyRank.json`, 'utf-8'));
        let ret = null;
        for (const r of rank)
        {
            if (time < r.border) break;
            ret = r;
        }
        if (ret === null) ret = rank[rank.length - 1];
        return ret;
    }
}

module.exports = StudyRank;