const fs = require('fs');
const puppeteer = require('puppeteer');
const TimeUtilitiy = require('../utility/timeUtility');

class ImageGen
{
    static cwd = process.cwd();

    static async renderingHtml(htmlPath, imageName, clipping={x: 0, y: 0, width: 500, height: 500})
    {
        // 画像に変換してpathを返す共通部分
        const conf = {path: `${ImageGen.cwd}/tmp/images/${imageName}.png`, clip: clipping, omitBackground: true}
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(`file://${htmlPath}`);
        await page.screenshot(conf);
        await browser.close();

        return conf.path;
    }

    // header を生成
    static async genUserHeader(userID, userName, userIconURL, userTitle = {name: '称号無し', color: '#dddddd'})
    {
        const style = fs.readFileSync(`${ImageGen.cwd}/markup/style.css`, 'utf-8');
        let base = fs.readFileSync(`${ImageGen.cwd}/markup/base.html`, 'utf-8');
        let header =  fs.readFileSync(`${ImageGen.cwd}/markup/components/header.html`, 'utf-8');

        // headerに各種パラメータを埋め込む
        header = header.replace('?avatarURL', userIconURL);
        header = header.replace('?userName', userName);
        header = header.replace('?rankImgURL', `${process.cwd()}/images/rank/${userTitle.file}`);
        header = header.replace('?userID', String(header.userID).padStart(4, '0'));

        // baseにheaderとスタイルシートを埋め込む
        base = base.replace('/*style*/', style);
        base = base.replace('<!--header-->', header);

        // 一時的にhtmlとして保存
        fs.writeFileSync(`${ImageGen.cwd}/tmp/header/${userID}.html`, base);

        const filePath = await ImageGen.renderingHtml(`${ImageGen.cwd}/tmp/header/${userID}.html`, String(userID), {x: 0, y: 0, width: 500, height: 102});

        return filePath;
    }

    static async genStudyCard(header, badge=['_dummy', '_dummy', '_dummy'], study={})
    {
        // header = {userID, userName, userIconURL, userTitle}
        // badge = [badgeURL1, badgeURL2, badgeURL3]
        // study = {total, study[]}

        const style = fs.readFileSync(`${ImageGen.cwd}/markup/style.css`, 'utf-8');
        let base = fs.readFileSync(`${ImageGen.cwd}/markup/base.html`, 'utf-8');
        let headerHtml = fs.readFileSync(`${ImageGen.cwd}/markup/components/header.html`, 'utf-8');
        let badgeHtml = fs.readFileSync(`${ImageGen.cwd}/markup/components/badge.html`, 'utf-8');
        let studyHtml = fs.readFileSync(`${ImageGen.cwd}/markup/components/study.html`, 'utf-8');

        // ヘッダーに値を埋め込む
        headerHtml = headerHtml.replace('?avatarURL', header.userIconURL);
        headerHtml = headerHtml.replace('?userName', header.userName);
        headerHtml = headerHtml.replace('?rankImgURL', `${process.cwd()}/images/rank/${header.userTitle.file}`);
        headerHtml = headerHtml.replace('?userID', String(header.userID).padStart(4, '0'));

        // バッジに値を埋め込む
        badgeHtml = badgeHtml.replace('?badge1', `${ImageGen.cwd}/images/badges/${badge[0]}.png`);
        badgeHtml = badgeHtml.replace('?badge2', `${ImageGen.cwd}/images/badges/${badge[1]}.png`);
        badgeHtml = badgeHtml.replace('?badge3', `${ImageGen.cwd}/images/badges/${badge[2]}.png`);

        // 自習時間に値を埋め込む
        let studyTimeSum = 0;
        let date = TimeUtilitiy.getToday();
        for (const i in study.study)
        {
            studyTimeSum += study.study[i];
            date.setDate(date.getDate()-1);
            studyHtml = studyHtml.replace(`?date${i}`, `${date.getMonth()+1}/${date.getDate()}`);
            studyHtml = studyHtml.replace(`?studyTime${i}`, String(study.study[i] / 3600000 | 0));
            studyHtml = studyHtml.replace(`?studyGraphBar${i}`, String(Math.min(150, (study.study[i] / 3600000 | 0) / 24 * 150)));
        }
        studyHtml = studyHtml.replace('?7daysStudyTime', String(studyTimeSum / 3600000 | 0));
        studyHtml = studyHtml.replace('?totalStudyTime', String(study.total / 3600000 | 0));

        // baseに各htmlとスタイルシートを埋め込む
        base = base.replace('/*style*/', style);
        base = base.replace('<!--header-->', headerHtml);
        base = base.replace('<!--badge-->', badgeHtml);
        base = base.replace('<!--study-->', studyHtml);

        // 一時的にhtmlとして保存
        fs.writeFileSync(`${ImageGen.cwd}/tmp/studyCards/${header.userID}.html`, base);

        const filePath = await ImageGen.renderingHtml(`${ImageGen.cwd}/tmp/studyCards/${header.userID}.html`, 'test', {x: 0, y: 0, width: 500, height: 482});
        return filePath;
    }
}

module.exports=ImageGen;