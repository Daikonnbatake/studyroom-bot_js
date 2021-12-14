const mysql = require('mysql2/promise');
const FS = require('fs');
const { chdir } = require('process');
const Log = require('./log');

class DBAccsess
{
    // DBに接続
    static async _getConnection()
    {
        const cwd = process.cwd();
        const conf = JSON.parse(FS.readFileSync(cwd + '/meta/db-conf.json', 'utf-8'));

        try
        {
            return await mysql.createConnection(conf);
        }
        catch(e)
        {
            let log = new Log(Log.typeDict.error, '', '', e).print();
        }
        // 正常終了は true を返す
        return true;
    }

    // id(主キー)を取得
    static async getId(table, column, value)
    {
        const connect = await this._getConnection();
        let ret = null;

        try
        {
            let query = 'SELECT * FROM ?? WHERE ?? = ?';
            let data = [table, column, value];
            ret = await connect.query(query, data);
        }
        catch(e)
        {
            let log = new Log(Log.typeDict.error, '', '', e).print();
        }
        finally
        {
            connect.end();
        }
        return ret[0];
    }

    // カラムを取得
    static async getColumn(table, column, where = null)
    {
        const connect = this._getConnection();
        let ret = null;
        let queru;
        try
        {
            if (where === null) query = 'SELECT ?? FROM ??';
            else queru = `SELECT ?? FROM ?? WHERE ${where}`;
            const data = [column, table];
            ret = await connect.query(query, data);
        }
        catch(e){ let log = new Log(Log.typeDict.error, '', '', e).print(); }
        finally { connect.end(); }
        return ret[0];
    }

    // ユーザーを登録
    static async addUser(user)
    {
        // 接続を作成
        const connect = await this._getConnection();
        try
        {
            // ユーザーデータ追加
            let query = 'INSERT INTO users (discord_user_id) VALUES (?)';
            let data = [user.id];
            await connect.query(query, data);
        }
        // 諸々のエラーを無視
        catch(e)
        {
            let log = new Log(Log.typeDict.error, '', '', e).print();
        }
        finally
        {
            // 接続解除
            connect.end();
        }

        let log = new Log(Log.typeDict.message, 'ユーザー情報を登録', `ユーザー: ${user.username} (id: ${user.id})`);
        // 正常終了は true を返す
        return true;
    }
    // チャンネルを登録
    static async addChannel(channel)
    {
        // 接続を作成
        const connect = await this._getConnection();

        try
        {
            // チャンネルデータ追加
            let query = 'INSERT INTO channels (discord_channel_id) VALUES (?)';
            let data = [channel.id];
            await connect.query(query, data);
        }
        // 諸々のエラーを無視
        catch(e)
        {
            let log = new Log(Log.typeDict.error, '', '', e).print();
        }
        finally
        {
            // 接続解除
            connect.end();
        }

        let log = new Log(Log.typeDict.message, 'チャンネル情報を登録', `チャンネル: ${channel.name} (id: ${channel.id})`);
        // 正常終了は true を返す
        return true;
    }
    // サーバーを登録
    static async addGuild(guild)
    {
        // 接続を作成
        const connect = await this._getConnection();

        try
        {
            // サーバーデータ追加
            let query = 'INSERT INTO guilds (discord_guild_id) VALUES (?)';
            let data = [guild.id];
            await connect.query(query, data);
        }
        // 諸々のエラーを無視
        catch(e)
        {
            let log = new Log(Log.typeDict.error, '', '', e).print();
        }
        finally
        {
            // 接続解除
            connect.end();
        }


        let log = new Log(Log.typeDict.message, 'サーバー情報を登録', `サーバー: ${guild.name} (id: ${guild.id})`);
        // 正常終了は true を返す
        return true;
    }

    // vc入退室を記録
    static async loggingVoice(guild, channel, user, isIn)
    {
        // 接続を作成
        const connect = await this._getConnection();

        try
        {
            // 各種idを取得
            const guild_id = await this._getId('guilds', 'discord_guild_id', guild.id);
            const channel_id = await this._getId('channels', 'discord_channel_id', channel.id);
            const user_id = await this._getId('users', 'discord_user_id', user.id);

            // voice_activities テーブルを更新
            const query = 'INSERT INTO voice_activities (guild_id, channel_id, user_id, status) VALUES (?, ?, ?, ?)';

            const data = [guild_id[0].id, channel_id[0].id, user_id[0].id, isIn];
            await connect.query(query, data);
        }

        // 諸々のエラーを無視
        catch(e){ let log = new Log(Log.typeDict.error, '', '', e).print(); }
        finally { connect.end(); }

        // 正常終了は true を返す
        return true;
    }
}

module.exports = DBAccsess;