const { VoiceIn } = require("../observer/voiceObserver");

class TimeUtilitiy
{
    static month = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};
    
    static toUnixTime(datetime) { return new Date(datetime).getTime(); }
    static toDateTime(unixtime) { return new Date(unixtime).toISOString(); }
    static getToday() { return new Date(((Date.now() / 86400000) | 0) * 86400000); }
    static getYesterday() { return new Date(this.getToday() - 1000); }
    static getOneWeekAgo() { return new Date(this.getToday() - (86400000 * 7)); }

    static getStudyTime(list)
    {
        /* 
         * 引数のフォーマット:
         *      [{status: [0 or 1], timestamp: [timestamp]}, {...}, ...]
         * 
         * 自習時間を求める手順：
         *      1. 与えられたリストからすべての自習時間(秒単位区間)を7つの区間(日単位の区間)に分類する。日を跨いでいる場合は分割する。
         *      2. 日単位で分解した各区間について自習時間の総和を求める。
         *      3. 値を return する。
         * 
         * 1日は 00:00:00 ~ 23:59:59 (UTC+0 基準)
         * 
         * status は 0 なら退室、1 なら入室を表す
         */
        
        if (list.length === 0) return [0];

        let day = 86400000;
        let end = list[list.length-1].timestamp;
        let endDay = ((end / day | 0) + 1) * day -100;
        let start = list[0].timestamp;
        const calcRange = ((endDay - start) / day | 0) + 1;


        let studyTimeSections = Array(calcRange).fill().map(e=>([]));
        let studyTimeSum = Array(calcRange).fill(0);

        // もしログが退室から始まっていた場合、日を跨いでいるのでちゃんと入室のログを端につける
        if (list[0].status === 0) list.splice(0, 0, {status: 1, timestamp: new Date((start / day | 0) * day)});

        // もしログが入室で終わっていた場合、日を跨いでいるのでちゃんと退室のログを端につける
        if (list[list.length - 1].status === 1) list.push({status: 0, timestamp: new Date(((end / day | 0) + 1) * day - 1000)});

        // ログを日ごとに分割
        for (let i = 1; i<list.length; i+=2)
        {
            const voiceIn = list[i-1];
            const voiceOut = list[i];

            // 日を跨いでいるときは適切にアクティビティを区切る
            if ((voiceIn.timestamp / day | 0) != (voiceOut.timestamp / day | 0))
            {
                studyTimeSections[(endDay - voiceIn.timestamp) / day | 0].push(voiceIn);

                for (let j = ((voiceIn.timestamp / day | 0) + 1) * day; j <= voiceOut.timestamp; j += day)
                {
                    const before = new Date(j - 1000);
                    const after = new Date(j);
                    const index = (endDay - before) / day | 0;
                    studyTimeSections[index].push({status: 0, timestamp: before});
                    studyTimeSections[index - 1].push({status: 1, timestamp: after});
                }
                studyTimeSections[(endDay - voiceOut.timestamp) / day | 0].push(voiceOut);
            }
            else
            {
                const index = (endDay - voiceIn.timestamp) / day | 0;
                studyTimeSections[index].push(voiceIn);
                studyTimeSections[index].push(voiceOut);
            }
        }

        // 日ごとの総和を求める
        for (let i = 0; i < studyTimeSections.length; i++)
        {
            let tmp = null;
            for (const j of studyTimeSections[i])
            {
                if (j.status === 1) tmp = j.timestamp;
                else studyTimeSum[i] += (j.timestamp - tmp + 1000) / 3600000 | 0;
            }
        }

        return studyTimeSum;
    }
}

module.exports = TimeUtilitiy;