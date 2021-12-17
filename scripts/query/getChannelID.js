const db = require('../utility/dbAccess');

const ex = async function getChannelID(channel)
{
    const ret = await db.query(`SELECT * FROM channels WHERE discord_channel_id = (?)`, [channel.id]);
    return ret[0][0].id;
}

module.exports = ex;