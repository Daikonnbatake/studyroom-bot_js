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
        
        let day = 86400000;
        let yesterday = this.getYesterday();
        let oneWeekAgo = this.getOneWeekAgo();

        let studyTimeSections = [[], [], [], [], [], [], []];
        let studyTimeSum = [0, 0, 0, 0, 0, 0, 0];
        let lastVoiceIn = oneWeekAgo;

        // 8日以上前～7日前以内にかけてのアクティビティがあった場合、7日前の 00:00:00 に入室アクティビティを足す(エラー回避)
        if (list[0].status === 0) studyTimeSections[6].push({status: 1, timestamp: oneWeekAgo});

        // ランク更新時にVCに入っている場合、集計する区間を区切るための退室アクティビティを足す(エラー回避)
        if (list[list.length-1].status === 1) list.push({status: 0, timestamp: yesterday});

        // 秒単位の区間を日単位の区間で分割
        for (const i of list)
        {
            if (i.status === 0)
            {
                let sections = (i.timestamp - lastVoiceIn) / day  | 0;
                let section = (lastVoiceIn / day | 0) * day + day;
                let index = (yesterday - lastVoiceIn) / day | 0;

                for (let j = 0; j < sections; j++)
                {
                    studyTimeSections[index].push({status: 0, timestamp: new Date(section - 1000)});
                    studyTimeSections[index-1].push({status: 1, timestamp: new Date(section)});
                    section += day;
                    index -= 1;
                }
                studyTimeSections[(yesterday - i.timestamp) / day | 0].push({status:0 , timestamp: i.timestamp});
            }
            if (i.status === 1)
            {
                lastVoiceIn = i.timestamp;
                let tmp = ((yesterday - lastVoiceIn) / day) | 0;
                studyTimeSections[(yesterday - lastVoiceIn) / day | 0].push({status:1 , timestamp: lastVoiceIn});
            }
        }

        // 日ごとに集計
        for (const i in studyTimeSections)
        {
            let tmp = null;
            for (const j of studyTimeSections[i])
            {
                if (j.status === 0) studyTimeSum[i] += j.timestamp - tmp;
                if (j.status === 1) tmp = j.timestamp;
            }
            // 端の処理のために1秒を足す
            studyTimeSum[i] = (studyTimeSum[i] + 1000) / 3600000 | 0;
        }
        return studyTimeSections;
        return studyTimeSum;
    }
}

module.exports = TimeUtilitiy;