const addUserID = require('../query/addUserID');
const addChannelID = require('../query/addChannelID');
const addGuildID = require('../query/addGuildID');

const addVoiceActivity = require('../query/addVoiceActivity');

class VoiceObserver
{
    static async VoiceIn(guild, channel, user)
    {
        await addUserID(user);
        await addChannelID(channel);
        await addGuildID(guild);
        await addVoiceActivity(guild, channel, user, 1);
    }

    static async VoiceOut(guild, channel, user)
    {
        await addUserID(user);
        await addChannelID(channel);
        await addGuildID(guild);
        await addVoiceActivity(guild, channel, user, 0);
    }
}

module.exports = VoiceObserver;