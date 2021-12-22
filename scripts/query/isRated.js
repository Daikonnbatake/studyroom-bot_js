const db = require('../utility/dbAccess');

const ex = async function isRated(channel)
{
    const ret = await db.query(`SELECT * FROM channels WHERE discord_channel_id = ?`, [channel.id]);
    return ret[0][0].rated;
}

module.exports = ex;