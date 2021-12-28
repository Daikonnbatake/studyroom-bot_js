const fs = require('fs');
const puppeteer = require('puppeteer');

class ImageGen
{
    static cwd = process.cwd();

    static async genUserHeader(userID, userName, userIconURL, userTitle='新兵')
    {
        const style = fs.readFileSync(`${ImageGen.cwd}/markup/style.css`, 'utf-8');
        let base = fs.readFileSync(`${ImageGen.cwd}/markup/base.html`, 'utf-8');
        let header =  fs.readFileSync(`${ImageGen.cwd}/markup/components/header.html`, 'utf-8');

        // headerに各種パラメータを埋め込む
        header = header.replace('?avatarURL', userIconURL);
        header = header.replace('?userName', userName);
        header = header.replace('?userTitle', userTitle);
        header = header.replace('?userID', '000' + String(userID).slice(-4));

        // baseにheaderとスタイルシートを埋め込む
        base = base.replace('/*style*/', style);
        base = base.replace('<!--header-->', header);

        // 一時的にhtmlとして保存
        fs.writeFileSync(`${ImageGen.cwd}/tmp/studyCards/${userID}.html`, base);

        // 画像に変換してpathを返す
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox']});
        const page = await browser.newPage();
        await page.goto(`file://${ImageGen.cwd}/tmp/studyCards/${userID}.html`);
        await page.screenshot({path: `${ImageGen.cwd}/images/test.png`, clip:{x: 0, y: 0, width: 500, height: 102}, omitBackground: true});
        await browser.close();

        return true;
    }
}

module.exports=ImageGen;