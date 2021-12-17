const db = require('../utility/dbAccess');

const getUserID = require('../query/getUserID');
const getChannelID = require('../query/getChannelID');
const getGuildID = require('../query/getGuildID');

const ex = async function addVoiceActivity(guild, channel, user, isIn)
{
    const userId = await getUserID(user);
    const channelId = await getChannelID(channel);
    const guildId = await getGuildID(guild);

    const ret = await db.query
    (
        `INSERT INTO voice_activities (guild_id, channel_id, user_id, status) VALUES (?, ?, ?, ?)`,
        [userId, channelId, guildId, isIn]
    );
}

module.exports = ex;