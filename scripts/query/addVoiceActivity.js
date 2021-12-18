const db = require('../utility/dbAccess');

const getUserID = require('../query/getUserID');
const getChannelID = require('../query/getChannelID');
const getGuildID = require('../query/getGuildID');
const getNextID = require('../query/getNextID');

const ex = async function addVoiceActivity(guild, channel, user, isIn)
{
    const id = await getNextID('voice_activities');
    const guildId = await getGuildID(guild);
    const channelId = await getChannelID(channel);
    const userId = await getUserID(user);

    const ret = await db.query
    (
        `INSERT INTO voice_activities (id, guild_id, channel_id, user_id, status) VALUES (?, ?, ?, ?, ?)`,
        [id, guildId, channelId, userId, isIn]
    );
}

module.exports = ex;