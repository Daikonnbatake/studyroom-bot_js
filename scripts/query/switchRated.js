const db = require('../utility/dbAccess');

const isRated = require('./isRated');

const ex = async function switchRated(channel)
{
    const rated = await isRated(channel);
    const ret = await db.query(`UPDATE channels SET rated = ? WHERE discord_channel_id = ?`, [rated^1, channel.id]);
    return rated^1;
}

module.exports = ex;