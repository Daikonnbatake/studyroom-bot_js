const db = require('../utility/dbAccess');
const TimeUtilitiy = require('../utility/timeUtility');

const ex = async function getTotalStudyTime(user)
{
    const ret = await db.query(
        `
        SELECT va.id, va.status, va.timestamp
        FROM users
        INNER JOIN
            (
                SELECT *
                FROM voice_activities
                WHERE timestamp < ?
            ) va
            ON va.user_id = users.id

        INNER JOIN
            (
                SELECT id
                FROM channels
                WHERE rated = 1
            ) c
            ON va.channel_id = c.id
        WHERE users.discord_user_id = ?
        ORDER BY va.id
        `,
        [TimeUtilitiy.getToday(), user.id]);
    return TimeUtilitiy.getTotalTime(ret[0]);
}

module.exports = ex;