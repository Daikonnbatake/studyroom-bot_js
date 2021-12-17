const mysql = require('mysql2/promise');
const FS = require('fs');
const Log = require('./log');

class DBAccess
{
    // 設定
    static config = JSON.parse(FS.readFileSync(`${process.cwd()}/meta/db-conf.json`, 'utf-8'));

    // DBに接続
    static async _getConnect()
    {
        let ret = null;

        try{ ret = await mysql.createConnection(this.config); }
        catch(e){ let error = new Log(e).print()}

        return ret;
    }

    // ベーシックなクエリ送受信ラッパー
    static async query(query, data=[])
    {
        let ret = null;
        let con = await this._getConnect();

        try { ret = await con.query(query, data); }
        catch(e) { this._dbErrorLogging(e); }
        finally { con.end(); }

        const resultLog = new Log('DBから切断', `通信は正常に終了しました。\n${query}の結果が返却されました。`);
        if (ret != null) resultLog.print();

        return ret;
    }

    // DB側で発生したエラーのうち、UniqueKey重複エラー等重要度の低いエラー等は選別する。
    static _dbErrorLogging(error)
    {
        // Unique Key 制約によって発生した重複エラーは無視する
        if (error.code == 'ER_DUP_ENTRY') return;
        let errorLog = new Log(error);
        errorLog.print();
    }
}

module.exports = DBAccess;