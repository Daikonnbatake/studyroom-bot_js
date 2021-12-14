const DB = require('../utility/dbAccsess');
const Log = require ('../utility/log')

class VoiceObserver
{
    static VoiceIn(guild, channel, user)
    {
        // 各種データ登録
        DB.addUser(user);
        DB.addChannel(channel);
        DB.addGuild(guild);

        DB.loggingVoice(guild, channel, user, 1);
    }

    static VoiceOut(guild, channel, user)
    {
        // 各種データ登録
        DB.addUser(user);
        DB.addChannel(channel);
        DB.addGuild(guild);

        DB.loggingVoice(guild, channel, user, 0);
    }
}

module.exports = VoiceObserver;