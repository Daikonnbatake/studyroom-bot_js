const db = require('../utility/dbAccess');
const getNextID = require('../query/getNextID');

const ex = async function addGuildID(guild)
{
    const id = await getNextID('guilds');
    const ret = await db.query(`INSERT INTO guilds (id, discord_guild_id) VALUES (?, ?)`, [id, guild.id]);
}

module.exports = ex;