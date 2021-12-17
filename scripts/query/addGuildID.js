const db = require('../utility/dbAccess');

const ex = async function addGuildID(guild)
{
    const ret = await db.query(`INSERT INTO guilds (discord_guild_id) VALUES (?)`, [guild.id]);
}

module.exports = ex;