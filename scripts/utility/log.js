const time = require('date-utils');

class Log
{
    type = 0;
    error = null;
    title = '';
    description = '';

    constructor (...arg)
    {   
        if (arg.length == 1)
        {
            this.type = 1;    
            this.error = arg[0];
        }

        if (arg.length == 2)
        {
            this.type = 0
            this.title = arg[0];
            this.description = arg[1];
        }
    }

    // Logをデバッグコンソールに表示
    print()
    {
        const timestamp = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
        let str = '';
        let dStrList = this.description.split('\n');
        
        if (this.type === 0)
        {
            str += `💬 [${timestamp.toFormat('YYYY-MM-DD HH24:MI:SS')}] ${this.title}\n`;
            for (let i of dStrList) { str += `    ${i}\n`; }
            console.log(str);
        }

        if (this.type === 1)
        {
            str += `❌ [${timestamp.toFormat('YYYY-MM-DD HH24:MI:SS')}] ${this.error.name}\n`;
            str += `    ${this.error.message} \n`
            console.error(str);
        }
    }
}

module.exports = Log;