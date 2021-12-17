const db = require('../utility/dbAccess');

const ex = async function addChannelID(channel)
{
    const ret = await db.query(`INSERT INTO channels (discord_channel_id) VALUES (?)`, [channel.id]);
}

module.exports = ex;