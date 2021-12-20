class TimeUtilitiy
{
    static month = {'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11};
    
    static toUnixTime(datetime) { return new Date(datetime).getTime(); }
    static toDateTime(unixtime) { return new Date(unixtime).toISOString(); }
    static getToday() { return new Date(((Date.now() / 86400000) | 0) * 86400000); }
    static getYesterday() {return new Date(((Date.now() / 86400000 - 1000) | 0) * 86400000); }
    static getOneWeekAgo() { return new Date(this.getToday().getTime() - (86400000 * 7)); }

    static getStudyTime(list)
    {
        /* 
         * 引数のフォーマット:
         *      [{status: [0 or 1], timestamp: [timestamp]}, {...}, ...]
         */
        
        list.push({status: 2});
        
        let day = 86400000;
        let yesterday = this.getToday();
        let oneWeekAgo = this.getOneWeekAgo();

        let studyTimeSum = 0;
        let inTime = oneWeekAgo;
        
        for (const column of list)
        {
            if (column.status === 0) studyTimeSum += column.timestamp - inTime;
            if (column.status === 1) inTime = column.timestamp;
            if (column.status === 2) studyTimeSum += inTime - yesterday;
        }

        return studyTimeSum / 3600000 | 0;
    }
}

module.exports = TimeUtilitiy;