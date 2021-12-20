const mysql = require('mysql2/promise');
const FS = require('fs');
const Log = require('./log');

class DBAccess
{
    // 設定
    static config = JSON.parse(FS.readFileSync(`${process.cwd()}/meta/db-conf.json`, 'utf-8'));
    static reBuild = FS.readFileSync(`${process.cwd()}/meta/dbInitialize.sql`, 'utf-8');

    // DBに接続
    static async _getConnect()
    {
        let ret = null;

        try{ ret = await mysql.createConnection(this.config); }
        catch(e)
        {
            new Log(e).print();
            try
            {
                await this._dbInit();
                new Log('DBを初期化', 'DBを取得できなかったため再構築しました。')
                ret = await mysql.createConnection(this.config);
            }
            catch(e)
            {
                new Log(e).print();
                new Log('DBの初期化を試みましたが、失敗しました。', '終了します。');
                throw(e);
            }
        }

        return ret;
    }

    // DBが無かったとき、DBを再構築する
    static async _dbInit()
    {
        let con = null;
        const conf =
        {
            host: this.config.host,
            port: this.config.port,
            user: this.config.user,
            password: this.config.password
        };

        try
        {
            let str = this.reBuild.toString().replace(/\n/g, '').split(';');
            con = await mysql.createConnection(conf);
            await con.query('BEGIN');
            for(let i of str)
            {
                if (i != '') await con.query(i);
            }
            await con.query('COMMIT');
            con.end();
        }
        catch(e)
        {
            await con.query('ROLLBACK');
            con.end();
            new Log(e);
            throw(e);
        }
    }

    // ベーシックなクエリ送受信ラッパー
    static async query(query, data=[])
    {
        let ret = null;
        let con = await this._getConnect();

        try { ret = await con.query(query, data); }
        catch(e) { this._dbErrorLogging(e); }
        finally { con.end(); }

        // if (ret != null) new Log('DBから切断', `通信は正常に終了しました。\n${query}の結果が返却されました。`).print();

        return ret;
    }

    // DB側で発生したエラーのうち、UniqueKey重複エラー等重要度の低いエラー等は選別する。
    static _dbErrorLogging(error)
    {
        // Unique Key 制約によって発生した重複エラーは無視する
        if (error.code == 'ER_DUP_ENTRY') return;
        new Log(error).print();
    }
}

module.exports = DBAccess;