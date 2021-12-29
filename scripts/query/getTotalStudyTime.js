const db = require('../utility/dbAccess');
const TimeUtilitiy = require('../utility/timeUtility');
const getVoiceActivities = require('./getVoiceActivities');

const ex = async function getUserID(user)
{
    const ret = TimeUtilitiy.getStudyTime(await getVoiceActivities(user, new Date(2021, 0, 0, 0, 0, 0)));
    let total = 0;
    for (const i of ret) total += i;

    return total;
}

module.exports = ex;