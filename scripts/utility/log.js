const time = require('date-utils');

class Log
{
    // メッセージ or エラー
    static typeDict = {message: 0, error: 1};

    // コンストラクタ
    constructor(type = 0, title = '', description = '', errorObj = Error())
    {
        this.type = type;
        this.title = title;
        this.description = description;
        this.error = errorObj;
    }

    _messagePrint(){}
    _errorPrint(){}

    // Logをデバッグコンソールに表示
    print()
    {
        let str = '';
        
        if (this.type === 0)
        {
            str += `💬 ${this.title}\n`;
            str += `description: ${this.description}\n`;
        }

        if (this.type === 1)
        {
            str += `❌ ${this.error.message}\n`;
            str += `file: ${this.error.fileName} \n`;
            str += `line: ${this.error.lineNumber} \n`;
            str += `description: ${this.error.message} \n`
        }

        let timestamp = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
        str += `timestamp: ${timestamp.toFormat('YYYY-MM-DD HH24:MI:SS')}\n`;
        str += '--------------------------------'

        console.log(str);
    }
}

module.exports = Log;