const db = require('../utility/dbAccess');
const getNextID = require('../query/getNextID');

const ex = async function addChannelID(channel)
{
    const id = await getNextID('channels');
    const ret = await db.query(`INSERT INTO channels (id, discord_channel_id) VALUES (?, ?)`, [id, channel.id]);
}

module.exports = ex;