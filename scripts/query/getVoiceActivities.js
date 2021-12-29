const db = require('../utility/dbAccess');
const TimeUtilitiy = require('../utility/timeUtility');

const ex = async function getVoiceActivities(user, start=TimeUtilitiy.getOneWeekAgo(), end=TimeUtilitiy.getToday())
{
    const ret = await db.query(
        `
        SELECT va.status, va.timestamp
        FROM users
        INNER JOIN
            (
                SELECT channel_id, user_id, status, timestamp
                FROM voice_activities
                WHERE ? <= timestamp
                AND timestamp < ?
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
        ORDER BY timestamp
        `,
        [start, end, user.id]);
    return ret[0];
}

module.exports = ex;