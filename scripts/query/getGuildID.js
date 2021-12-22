const db = require('../utility/dbAccess');

const ex = async function getGuildID(guild)
{
    const ret = await db.query(`SELECT * FROM guilds WHERE discord_guild_id = (?)`, [guild.id]);
    return ret[0][0].id;
}

module.exports = ex;